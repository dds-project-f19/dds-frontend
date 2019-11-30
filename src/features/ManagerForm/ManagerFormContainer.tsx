import React from 'react';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import ManagerForm from './ManagerForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listitem: {
      margin: 20,
    },
  })
);

interface IProps { }

interface IState {
  startDate: Date;
  endDate: Date;
  isWaiting: boolean;
  resText: string;
}

export default class ManagerFormContainer extends React.PureComponent<IProps, IState> {
  public static defaultProps = {};

  public freeText = () => "Time slot is free";
  public occupiedText = () => "This time slot is already occupied!";

  public state: IState = {
    startDate: new Date(),
    isWaiting: false,
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
      isWaiting: true,
      resText: "",
    })
    // TODO: Change with actual API call

    this.setState({
      isWaiting: false,
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
        startDate,
        endDate,
        isWaiting,
        resText,
      },
      handleDateChange,
      handleStartTimeChange,
      handleEndTimeChange,
    } = this;

    return (
      <ManagerForm
        userslist={generateUsersList()}
        itemslist={generateItemsList()}
        resText={resText}
        isWaiting={isWaiting}
        startDate={startDate}
        endDate={endDate}
        handleDateChange={handleDateChange}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
      />
    );
  }

}

function generateUsersList() {
  return [0, 1, 2, 3, 4, 5].map(id => <option value={id}>User{id}</option>);
}

function generateRoomList() {
  return [0, 1, 2, 3, 4, 5].map(id => <option value={id}>Room{id}</option>);
}

function generateItemsList() {
  const classes = useStyles();

  return [0, 1, 2, 3, 4, 5].map(value =>
    React.cloneElement(
      (
        <ListItem className={classes.listitem}>
          <ListItemText primary={`Item${value}`} />
          <ListItemSecondaryAction>
            <TextField id="outlined-basic" label="Amount" variant="outlined" />
          </ListItemSecondaryAction>
        </ListItem>
      ) as React.ReactElement,
      {
        key: value
      }
    )
  );
}