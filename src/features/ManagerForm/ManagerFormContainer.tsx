import React from 'react';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import ManagerForm from './ManagerForm';
import { string } from 'prop-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listitem: {
      margin: 20,
    },
  })
);

interface IProps { }

interface IState {
  curUser: string;
  startDate: Date;
  endDate: Date;
  isUserWaiting: boolean;
  isTimeWaiting: boolean;
  resText: string;
}

export default class ManagerFormContainer extends React.PureComponent<IProps, IState> {
  public static defaultProps = {};

  public freeText = () => "Time slot is free";
  public occupiedText = () => "This time slot is already occupied!";

  public state: IState = {
    curUser: "",
    startDate: new Date(),
    isUserWaiting: false,
    isTimeWaiting: false,
    endDate: new Date(),
    resText: "",
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

  private handleUserChange = (event: React.ChangeEvent<{ value: string }>) => {
    this.setState({
      curUser: event.target.value,
      isUserWaiting: true,
      resText: "",
    })

    // TODO: Add actual API call

    this.setState({
      isUserWaiting: false,
    })
  };

  private handleFieldChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event)
    console.log(event.target)
    // TODO
  };

  private handleDateChange = async (date: Date) => {
    const { startDate, endDate } = this.state;
    const newEndDate = this.getTimewithDate(endDate, startDate);

    this.setState({
      startDate: date,
      endDate: newEndDate,
    });
    this.getTimeSlotStatus();
  };

  private handleStartTimeChange = async (time: Date) => {
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
    this.getTimeSlotStatus();
  };

  private handleEndTimeChange = async (time: Date) => {
    const { startDate } = this.state;
    const newEndDate = this.getTimewithDate(time, startDate);
    if (newEndDate.valueOf() > startDate.valueOf()) {
      this.setState({
        endDate: newEndDate,
      })
      this.getTimeSlotStatus();
    }
  };

  private getTimeSlotStatus = async () => {
    const { startDate, endDate } = this.state;

    this.setState({
      isTimeWaiting: true,
      resText: "",
    })

    // TODO: Add actual API call

    this.setState({
      isTimeWaiting: false,
    })
    if (startDate.getHours() > 8 && endDate.getHours() > 8) {
      this.setState({
        resText: this.freeText(),
      })
    } else {
      this.setState({
        resText: this.occupiedText(),
      })
    }
  };

  render(): JSX.Element {
    const {
      state: {
        curUser,
        startDate,
        endDate,
        isTimeWaiting,
        isUserWaiting,
        resText,
      },
      handleUserChange,
      handleFieldChange,
      handleDateChange,
      handleStartTimeChange,
      handleEndTimeChange,
    } = this;

    return (
      <ManagerForm
        userslist={["User0", "User1"]}
        itemslist={}
        resText={resText}
        isUserWaiting={isUserWaiting}
        isTimeWaiting={isTimeWaiting}
        curUser={curUser}
        startDate={startDate}
        endDate={endDate}

        handleUserChange={handleUserChange}
        handleFieldChange={handleFieldChange}
        handleDateChange={handleDateChange}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
      />
    );
  }

}