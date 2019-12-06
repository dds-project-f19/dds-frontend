import React from 'react';
import WorkerScheduleForm from './WorkerScheduleForm';

import {
  IWorkerList,
  IWeekDays,
  ISetSchedule,
  ISchedule,
  IBasicResponse,
} from 'shared/types/models';

interface IProps {
  listWorkersApi: () => Promise<IWorkerList>;
  getWorkerScheduleApi: (username: string) => Promise<ISchedule>;
  setWorkerScheduleApi: (setShedule: ISetSchedule) => Promise<IBasicResponse>;
  checkOverlapApi: (shedule: ISchedule) => Promise<boolean>;
}

interface IState {
  curUser: string;
  usersList: string[];
  weekdays: IWeekDays,
  startDate: Date;
  endDate: Date;
  isUserWaiting: boolean;
  isOccupied: boolean;
  isTimeLoading: boolean;
  isButtonSuccess: boolean;
  resText: string;
}

const defaultTime = {
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
  endDate: new Date(),
  isOccupied: false,
}

export default class WorkerScheduleFormContainer extends React.PureComponent<IProps, IState> {

  public state: IState = {
    curUser: '',
    usersList: [],
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
    isOccupied: false,
    isTimeLoading: false,
    isButtonSuccess: false,
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

  private static dateToStr: (date: Date) => string
    = (date) => `${date.getUTCHours()}:${date.getUTCMinutes()}`;

  private static strToDate: (date: string) => Date
    = (strDate) => {
      const hd = strDate.split(':').map(Number);
      const date: Date = new Date();
      date.setHours(hd[0])
      date.setMinutes(hd[1])
      return date;
    }

  private static workdaysToStr: (checkList: IWeekDays) => string
    = (checkList) => Object.values(checkList).reduce(
      (out, val, index) => val ? out.concat(index + 1) : out, // FIXME: UTC week day
      []
    ).join();

  private static strToWorkdays: (workdays: string) => IWeekDays
    = (workdays) => {
      var res: IWeekDays = { ...defaultTime.weekdays };

      workdays.split(',').map(Number).forEach(weekday => {
        const resInd: keyof IWeekDays = Object.keys(res)[weekday - 1] as keyof IWeekDays;
        res[resInd] = true;
      });
      return res
    }

  private getCurTimeForRequest: (state: IState) => ISchedule = (state) => {
    const { curUser, startDate, endDate, weekdays } = state;

    return {
      username: curUser,
      starttime: WorkerScheduleFormContainer.dateToStr(startDate),
      endtime: WorkerScheduleFormContainer.dateToStr(endDate),
      workdays: WorkerScheduleFormContainer.workdaysToStr(weekdays),
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
    if (this.state.isTimeLoading) return;
    const newCurUser = event.target.value as string

    this.setState({
      curUser: newCurUser,
      isUserWaiting: true,
      isButtonSuccess: false,
      resText: '',
    });

    let {
      startDate,
      endDate,
      weekdays,
    } = defaultTime;

    try {
      const {
        starttime,
        endtime,
        workdays,
      } = await this.props.getWorkerScheduleApi(newCurUser);
      startDate = WorkerScheduleFormContainer.strToDate(starttime);
      endDate = WorkerScheduleFormContainer.strToDate(endtime);
      weekdays = WorkerScheduleFormContainer.strToWorkdays(workdays);
    } catch (e) { }

    if (this._isMounted) {
      this.setState({
        isUserWaiting: false,
        startDate: startDate,
        endDate: endDate,
        weekdays: weekdays,
      });
    };

    this.getTimeSlotStatus({ ...this.state, weekdays: weekdays }); // TODO: handle better
  };


  private handleWeekDaysChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.isTimeLoading) return;
    const { weekdays } = this.state;

    const newWeekdays = { ...weekdays, [name]: event.target.checked };
    this.setState({
      weekdays: newWeekdays,
    });
    this.getTimeSlotStatus({ ...this.state, weekdays: newWeekdays }); // TODO: handle better
  };

  private handleStartTimeChange = async (time: Date | null) => {
    if (this.state.isTimeLoading) return;
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
    if (this.state.isTimeLoading) return;
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
      isTimeLoading: true,
      isButtonSuccess: false,
      resText: '',
    });

    const isOccupied = await this.props.checkOverlapApi(this.getCurTimeForRequest(state));
    console.log(isOccupied);

    if (this._isMounted) {
      this.setState({
        isTimeLoading: false,
        isOccupied: isOccupied,
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

  private handleScheduleSubmit: (name: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = (name) => (event) => {
    if (this.state.isTimeLoading) return;
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

    this.setState({
      isTimeLoading: true,
      isButtonSuccess: false,
    })

    setWorkerScheduleApi({
      username: name,
      starttime: WorkerScheduleFormContainer.dateToStr(startDate),
      endtime: WorkerScheduleFormContainer.dateToStr(endDate),
      workdays: WorkerScheduleFormContainer.workdaysToStr(weekdays),
    });

    this.setState({
      isTimeLoading: false,
      isButtonSuccess: true,
    })
  };

  render(): JSX.Element {
    const {
      state: {
        curUser,
        usersList,
        weekdays,
        startDate,
        endDate,
        isUserWaiting,
        isOccupied,
        isTimeLoading,
        isButtonSuccess,
      },
      handleUserChange,
      handleWeekDaysChange,
      handleStartTimeChange,
      handleEndTimeChange,
      handleScheduleSubmit,
    } = this;

    return (
      <WorkerScheduleForm
        usersList={usersList}

        isUserWaiting={isUserWaiting}
        isOccupied={isOccupied}
        isTimeLoading={isTimeLoading}
        isButtonSuccess={isButtonSuccess}
        curUser={curUser}
        weekdays={weekdays}
        startDate={startDate}
        endDate={endDate}

        handleUserChange={handleUserChange}
        handleWeekDaysChange={handleWeekDaysChange}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
        handleScheduleSubmit={handleScheduleSubmit}
      />
    );
  }
}
