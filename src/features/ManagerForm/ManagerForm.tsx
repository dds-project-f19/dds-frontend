import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    title: {
      margin: 15
    },
    subtitle: {},
    datepicker: {
      padding: 5
    }
  })
);

interface IProps {
  userslist: React.ReactElement[];
  itemslist: React.ReactElement[];

  resText: string;
  isWaiting: boolean;
  startDate: Date;
  endDate: Date;
  handleDateChange: (d: Date) => void;
  handleStartTimeChange: (d: Date) => void;
  handleEndTimeChange: (d: Date) => void;
}

const ManagerForm: React.FC<IProps> = ({
  userslist,
  itemslist,

  resText,
  isWaiting,
  startDate,
  endDate,

  handleDateChange,
  handleStartTimeChange,
  handleEndTimeChange,
}: IProps) => {
  const classes = useStyles();

  //TODO: import `freeText` from `ManagerFormContainer`.
  const freeText = "Time slot is free";

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <Typography variant="h4" className={classes.title}>
          Manager Page
        </Typography>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel htmlFor="outlined-age-native-simple">Age</InputLabel>
          <Select
            native
            // value={state.age}
            // onChange={handleChange("age")}
            inputProps={{
              name: "User",
              id: "outlined-age-native-simple"
            }}
          >
            {userslist}) }
          </Select>
        </FormControl>
        <Grid className={classes.maingrid}>
          <Box component="span" m={1} className={classes.leftbox}>
            <Card className={classes.card}>
              <Grid item xs={10} md={11}>
                <Typography variant="h6" className={classes.subtitle}>
                  Available items
                </Typography>
                <div className={classes.listdiv}>
                  <List>{itemslist}</List>
                </div>
              </Grid>
            </Card>
          </Box>
          <Box component="span" m={1} className={classes.rightbox}>
            <Card className={classes.card}>
              <Grid className={classes.timegrid}>
                {/* <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-room-native-simple">
                  Room
                </InputLabel>
                <Select
                  native
                  // value={state.age}
                  // onChange={handleChange("age")}
                  inputProps={{
                    name: "Room",
                    id: "outlined-room-native-simple"
                  }}
                >
                  {generateRoomList()}) }
                </Select>
              </FormControl> */}
                <div>
                  <KeyboardDatePicker
                    className={classes.datepicker}
                    disabled={isWaiting}
                    disableToolbar
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

                  <KeyboardTimePicker
                    className={classes.datepicker}
                    disabled={isWaiting}
                    margin="normal"
                    id="time-picker"
                    label="From"
                    value={startDate}
                    onChange={handleStartTimeChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time"
                    }}
                  />
                  <KeyboardTimePicker
                    className={classes.datepicker}
                    disabled={isWaiting}
                    margin="normal"
                    id="time-picker"
                    label="To"
                    value={endDate}
                    onChange={handleEndTimeChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time"
                    }}
                  />
                </div>
                <Typography variant="h6" className={classes.title}>
                  {resText}
                </Typography>
                {resText === freeText && (
                  <Button variant="contained" color="primary" disabled={isWaiting}>
                    Occupy
                  </Button>
                )}
                {isWaiting && <CircularProgress />}
              </Grid>
            </Card>
          </Box>
        </Grid>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default ManagerForm;
