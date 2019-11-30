import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import DateFnsUtils from "@date-io/date-fns";
import Grow from "@material-ui/core/Grow";
import Fade from "@material-ui/core/Fade";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import CircularProgress from "@material-ui/core/CircularProgress";

import { IItemInfo } from 'shared/types/models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    maingrid: {
      display: "flex",
      "flex-direction": "row"
    },
    leftbox: {
      width: "40%"
    },
    rightbox: {
      width: "55%"
    },
    timegrid: {
      display: "flex",
      "flex-direction": "column"
    },
    card: {
      padding: theme.spacing(2, 2, 2)
    },
    listdiv: {
      backgroundColor: theme.palette.background.paper
    },
    listitem: {
      margin: 20
    },
    title: {
      margin: 10
    },
    subtitle: {},
    datepicker: {
      padding: 5
    }
  })
);

interface IProps {
  userslist: string[];
  itemslist: IItemInfo[];

  resText: string;
  isUserWaiting: boolean;
  isTimeWaiting: boolean;
  curUser: string;
  startDate: Date;
  endDate: Date;

  handleUserChange: (event: React.ChangeEvent<{ value: unknown; }>) => void;
  handleFieldChange: (event: React.ChangeEvent<{ value: unknown; }>) => void;
  handleDateChange: (d: Date) => void;
  handleStartTimeChange: (d: Date) => void;
  handleEndTimeChange: (d: Date) => void;
}

function mapToMenuItems(userList: string[]) {
  return userList.map(username => <MenuItem value={username}>username</MenuItem>);
}

function mapToItemsList(itemsList: IItemInfo[], onChange: (e) => void) {
  const classes = useStyles();

  return itemsList.map(({ itemtype, count }) =>
    React.cloneElement(
      (
        <ListItem className={classes.listitem}>
          <ListItemText primary={itemtype} />
          <ListItemSecondaryAction>
            <TextField
              id={`amount-of-${itemtype}`}
              label="Amount"
              type="number"
              variant="outlined"
              value={count}
              onChange={onChange}
              // TODO: Add on change listener
            />
          </ListItemSecondaryAction>
        </ListItem>
      ) as React.ReactElement,
      {
        key: itemtype
      }
    )
  );
}


const ManagerForm: React.FC<IProps> = ({
  userslist,
  itemslist,

  resText,
  isUserWaiting,
  isTimeWaiting,
  curUser,
  startDate,
  endDate,

  handleUserChange,
  handleFieldChange,
  handleDateChange,
  handleStartTimeChange,
  handleEndTimeChange,
}: IProps) => {
  const classes = useStyles();

  //TODO: import `freeText` from `ManagerFormContainer`.
  const freeText = "Time slot is free";

  const timePickersDisabled = () => {
    return isUserWaiting && isTimeWaiting;
  };

  const itemsDisabled = () => {
    return isUserWaiting;
  };

  const boxesIn = () => {
    return !(curUser === "");
  };

  const isFree = () => {
    return resText === freeText;
  };

  const inputLabel = React.useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <Typography variant="h4" className={classes.title}>
          Manager Page
        </Typography>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} id="user-select-label">
            User
          </InputLabel>
          <Select
            labelId="user-select-label"
            id="user-select"
            value={curUser}
            onChange={handleUserChange}
            labelWidth={labelWidth}
          >
            <MenuItem value={curUser} disabled />
            {mapToMenuItems(userslist)}
          </Select>
        </FormControl>
        <Grid className={classes.maingrid}>
          <Grow in={boxesIn()}>
            <Box component="span" m={1} className={classes.leftbox}>
              <Card className={classes.card}>
                <Grid item xs={10} md={11}>
                  <Typography variant="h6" className={classes.title}>
                    Available items
                  </Typography>
                  <div className={classes.listdiv}>
                    <List>{mapToItemsList(itemslist, handleFieldChange)}</List>
                  </div>
                </Grid>
              </Card>
            </Box>
          </Grow>
          <Grow in={boxesIn()} {...(boxesIn() ? { timeout: 1000 } : {})}>
            <Box component="span" m={1} className={classes.rightbox}>
              <Card className={classes.card}>
                <Grid className={classes.timegrid}>
                  <div>
                    <FormControl className={classes.datepicker}>
                      <KeyboardDatePicker
                        disableToolbar
                        disabled={timePickersDisabled()}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={startDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date"
                        }}
                      />
                    </FormControl>
                    <FormControl className={classes.datepicker}>
                      <KeyboardTimePicker
                        disabled={timePickersDisabled()}
                        margin="normal"
                        id="time-picker"
                        label="From"
                        value={startDate}
                        onChange={handleStartTimeChange}
                        KeyboardButtonProps={{
                          "aria-label": "change time"
                        }}
                      />
                    </FormControl>
                    <FormControl className={classes.datepicker}>
                      <KeyboardTimePicker
                        disabled={timePickersDisabled()}
                        margin="normal"
                        id="time-picker"
                        label="To"
                        value={endDate}
                        onChange={handleEndTimeChange}
                        KeyboardButtonProps={{
                          "aria-label": "change time"
                        }}
                      />
                    </FormControl>
                  </div>
                  <Typography variant="h6" className={classes.subtitle}>
                    {resText}
                  </Typography>
                  <Fade in={isFree()}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isTimeWaiting}
                    >
                      Assign
                    </Button>
                  </Fade>
                  {isTimeWaiting && <CircularProgress />}
                </Grid>
              </Card>
            </Box>
          </Grow>
        </Grid>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default ManagerForm;
