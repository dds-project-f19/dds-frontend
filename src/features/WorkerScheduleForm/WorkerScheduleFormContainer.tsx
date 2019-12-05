import React from 'react';
import WorkerScheduleForm from './WorkerScheduleForm';
import update from 'react-addons-update';

import {
  IWorkerList,
  IAvailableItems,
  IItemInfo,
  IWeekDays,
  ISetSchedule,
  ISchedule,
  IBasicResponse,
} from 'shared/types/models';
import { workspacesInfo } from 'shared/workspaces';

interface IProps {
  workspace: string;
  listWorkersApi: () => Promise<IWorkerList>;
  listAvailableItemsApi: () => Promise<IAvailableItems>;
  setItemApi: (item: IItemInfo) => Promise<void>;
  setWorkerScheduleApi: (setShedule: ISetSchedule) => Promise<IBasicResponse>;
  checkOverlapApi: (shedule: ISchedule) => Promise<boolean>;
}

interface IState {
  curUser: string;
  usersList: string[];
  itemsList: IItemInfo[];
  weekdays: IWeekDays,
  startDate: Date;
  endDate: Date;
  isUserWaiting: boolean;
  isTimeWaiting: boolean;
  resText: string;
}

const freeText = 'Time slot is free';
const occupiedText = 'This time slot is already occupied!';

export default class WorkerScheduleFormContainer extends React.PureComponent<IProps, IState> {
  public state: IState = {
    curUser: '',
    usersList: [],
    itemsList: [],
    weekdays: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    startDate: new Date(),
    isUserWaiting: false,
    isTimeWaiting: false,
    endDate: new Date(),
    resText: '',
  };

  private _isMounted: boolean = false; // TODO: Cansellable promises

  componentDidMount() {
    this._isMounted = true;
    this.requestData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  private static getTime: (date: Date) => string
    = (date) => `${date.getUTCHours()}:${date.getUTCMinutes()}`;

  private static getWorkdays: (checkList: IWeekDays) => string
    = (checkList) => Object.values(checkList).reduce(
      (out, val, index) => val ? out.concat(index + 1) : out, // FIXME: UTC week day
      []
    ).join();

  private getCurTimeForRequest: (state: IState) => ISchedule = (state) => {
    const { startDate, endDate, weekdays } = state;

    return {
      starttime: WorkerScheduleFormContainer.getTime(startDate),
      endtime: WorkerScheduleFormContainer.getTime(endDate),
      workdays: WorkerScheduleFormContainer.getWorkdays(weekdays),
    };
  };

  private getTimeWithDate: (time: Date, date: Date) => Date = (time, date) => {
    // Look, how beatufull! (No!)
    const tempDate = new Date(date.valueOf());
    tempDate.setHours(time.getHours());
    tempDate.setMinutes(time.getMinutes());
    tempDate.setSeconds(time.getSeconds());
    tempDate.setMilliseconds(time.getMilliseconds());
    return tempDate;
  };

  private handleUserChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const {
      props: {
        workspace,
      },
      state: {
        itemsList,
      },
    } = this;

    this.setState({
      curUser: event.target.value as string,
      isUserWaiting: true,
      resText: '',
    });

    const { items } = await this.props.listAvailableItemsApi();
    // TODO: retrieve and set worker schedule (issue #18)

    const newItemsList: typeof itemsList = [];
    for (const type in workspacesInfo[workspace].types) {
      newItemsList.push((items || []).find(({ itemtype }) => itemtype === type) || { itemtype: type, count: 0 });
    }

    if (this._isMounted) {
      this.setState({
        itemsList: newItemsList,
        isUserWaiting: false,
      });
    }
  };

  private handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { itemsList } = this.state;
    const { id, value } = event.target;
    const numValue: number = parseInt(value);

    if (numValue < 0) return;

    const index = itemsList.findIndex(item => item.itemtype === id);

    this.setState({
      itemsList: update(this.state.itemsList, { [index]: { count: { $set: numValue } } }),
    });
  };


  private handleWeekDaysChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { weekdays } = this.state;

    const newWeekdays = { ...weekdays, [name]: event.target.checked };
    this.setState({
      weekdays: newWeekdays,
    });
    this.getTimeSlotStatus({ ...this.state, weekdays: newWeekdays }); // TODO: handle better
  };

  private handleStartTimeChange = async (time: Date | null) => {
    if (time === null) {
      throw new Error('Date is null');
    }
    const { startDate, endDate } = this.state;
    const newStartDate = this.getTimeWithDate(time, startDate);

    this.setState({
      startDate: newStartDate,
    });

    if (newStartDate.valueOf() > endDate.valueOf()) {
      this.setState({
        endDate: newStartDate,
      });
    }
    this.getTimeSlotStatus({ ...this.state, endDate: newStartDate }); // TODO: handle better
  };

  private handleEndTimeChange = async (time: Date | null) => {
    if (time === null) {
      throw new Error('Date is null');
    }
    const { startDate } = this.state;
    const newEndDate = this.getTimeWithDate(time, startDate);
    if (newEndDate.valueOf() > startDate.valueOf()) {
      this.setState({
        endDate: newEndDate,
      });
      this.getTimeSlotStatus({ ...this.state, endDate: newEndDate }); // TODO: handle better
    }
  };

  private getTimeSlotStatus = async (state: IState) => {
    if (!this._isMounted) return;

    this.setState({
      isTimeWaiting: true,
      resText: '',
    });

    const isOccupied = await this.props.checkOverlapApi(this.getCurTimeForRequest(state));

    if (this._isMounted) {
      this.setState({
        isTimeWaiting: false,
        resText: isOccupied ? occupiedText : freeText,
      });
    }
  };

  private requestData = async () => {
    const { users } = await this.props.listWorkersApi();
    if (this._isMounted && users) { // Maybe condition on `users` is wrong
      this.setState({
        usersList: users.map(({ username }) => username),
      });
    }
  };

  private handleItemsUpdateSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = (event) => {
    event.preventDefault();

    const {
      props: {
        setItemApi,
      },
      state: {
        itemsList,
      },
    } = this;

    itemsList.forEach((itemInfo) => setItemApi(itemInfo));
  };

  private handleScheduleSubmit: (name: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = (name) => (event) => {
    event.preventDefault();

    const {
      props: {
        setWorkerScheduleApi,
      },
      state: {
        startDate,
        endDate,
        weekdays,
      },
    } = this;

    setWorkerScheduleApi({
      username: name,
      starttime: WorkerScheduleFormContainer.getTime(startDate),
      endtime: WorkerScheduleFormContainer.getTime(endDate),
      workdays: WorkerScheduleFormContainer.getWorkdays(weekdays),
    });
  };

  render(): JSX.Element {
    const {
      props: {
        workspace,
      },
      state: {
        curUser,
        usersList,
        itemsList,
        weekdays,
        startDate,
        endDate,
        isTimeWaiting,
        isUserWaiting,
        resText,
      },
      handleUserChange,
      handleFieldChange,
      handleWeekDaysChange,
      handleStartTimeChange,
      handleEndTimeChange,
      handleItemsUpdateSubmit,
      handleScheduleSubmit,
    } = this;

    return (
      <WorkerScheduleForm
        workspace={workspace}

        usersList={usersList}
        itemsList={itemsList}
        resText={resText}
        isUserWaiting={isUserWaiting}
        isTimeWaiting={isTimeWaiting}
        curUser={curUser}
        weekdays={weekdays}
        startDate={startDate}
        endDate={endDate}

        handleUserChange={handleUserChange}
        handleFieldChange={handleFieldChange}
        handleWeekDaysChange={handleWeekDaysChange}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
        handleItemsUpdateSubmit={handleItemsUpdateSubmit}
        handleScheduleSubmit={handleScheduleSubmit}
      />
    );
  }
}
