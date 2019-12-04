import React from 'react';
import ManagerForm from './ManagerForm';
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
  userslist: string[];
  itemslist: IItemInfo[];
  weekdays: IWeekDays,
  startDate: Date;
  endDate: Date;
  isUserWaiting: boolean;
  isTimeWaiting: boolean;
  resText: string;
}

export default class ManagerFormContainer extends React.PureComponent<IProps, IState> {
  private _isMounted: boolean = false; // TODO: Cansellable promises

  public freeText = () => 'Time slot is free';
  public occupiedText = () => 'This time slot is already occupied!';

  public state: IState = {
    curUser: '',
    userslist: [],
    itemslist: [],
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

  private getCurTimeForRequest: (state: IState) => ISchedule = (state) => {
    const { startDate, endDate, weekdays } = state;
    console.log(state)

    var myValues = Object.values(weekdays)
    myValues = myValues.reduce(
      (out, bool, index) => bool ? out.concat(index + 1) : out,
      []
    )

    return {
      starttime: `${startDate.getHours()}:${startDate.getMinutes()}`,
      endtime: `${endDate.getHours()}:${endDate.getMinutes()}`,
      workdays: myValues.join(),
    } as ISchedule;
  };

  private getTimewithDate: (time: Date, date: Date) => Date = (
    time: Date,
    date: Date
  ) => {
    // Look, how beatufull! (No!)
    let tempDate = new Date(date.valueOf());
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
        itemslist,
      },
    } = this;

    this.setState({
      curUser: event.target.value as string,
      isUserWaiting: true,
      resText: '',
    });

    const { items } = await this.props.listAvailableItemsApi();

    let newItemsList: typeof itemslist = [];
    for (const type in workspacesInfo[workspace].types) {
      newItemsList.push((items || []).find(({ itemtype }) => itemtype === type) || { itemtype: type, count: 0 });
    }

    if (this._isMounted) {
      this.setState({
        itemslist: newItemsList,
        isUserWaiting: false,
      })
    } else {
      return
    }
  };

  private handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { itemslist } = this.state;
    const { id, value } = event.target;

    if (parseInt(value) < 0) return

    var index = itemslist.findIndex(item => item.itemtype === id)

    this.setState({
      itemslist: update(this.state.itemslist, { [index]: { count: { $set: value } } })
    });
  };


  private handleWeekDaysChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { weekdays } = this.state;

    const newWeekdays = { ...weekdays, [name]: event.target.checked };
    this.setState({
      weekdays: newWeekdays,
    });
    this.getTimeSlotStatus({ ...this.state, weekdays: newWeekdays });
  };

  private handleStartTimeChange = async (time: Date | null) => {
    if (time === null) {
      throw new Error('Date is null');
    }
    const { startDate, endDate } = this.state;
    const newStartDate = this.getTimewithDate(time, startDate);

    this.setState({
      startDate: newStartDate,
    });

    if (newStartDate.valueOf() > endDate.valueOf()) {
      this.setState({
        endDate: newStartDate,
      });
    }
    this.getTimeSlotStatus({ ...this.state, endDate: newStartDate });
  };

  private handleEndTimeChange = async (time: Date | null) => {
    if (time === null) {
      throw new Error('Date is null');
    }
    const { startDate } = this.state;
    const newEndDate = this.getTimewithDate(time, startDate);
    if (newEndDate.valueOf() > startDate.valueOf()) {
      this.setState({
        endDate: newEndDate,
      })
      this.getTimeSlotStatus({ ...this.state, endDate: newEndDate });
    }
  };

  private getTimeSlotStatus = async (state: IState) => {
    this.setState({
      isTimeWaiting: true,
      resText: '',
    })

    const isFree = await this.props.checkOverlapApi(this.getCurTimeForRequest(state));

    this.setState({
      isTimeWaiting: false,
    })
    if (isFree) {
      this.setState({
        resText: this.freeText(),
      })
    } else {
      this.setState({
        resText: this.occupiedText(),
      })
    }
  };

  private requestData = async () => {
    const { users } = await this.props.listWorkersApi();
    if (this._isMounted && users) { // Maybe condition on `users` is wrong
      this.setState({
        userslist: users.map(({ username }) => username),
      });
    }
  };

  componentDidMount() {
    this._isMounted = true;
    this.requestData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render(): JSX.Element {
    const {
      state: {
        curUser,
        userslist,
        itemslist,
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
    } = this;

    return (
      <ManagerForm
        userslist={userslist}
        itemslist={itemslist}
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
      />
    );
  }

}
