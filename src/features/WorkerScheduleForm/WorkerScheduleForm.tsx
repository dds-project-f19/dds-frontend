import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import DateFnsUtils from '@date-io/date-fns';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { IWeekDays } from 'shared/types/models';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 250,
    'margin-left':  'auto',
    'margin-right': 'auto',
  },
  progressBar: {
    margin: theme.spacing(1),
  },
  maingrid: {
    display: 'flex',
    flexDirection: 'column',
    'justify-content': 'center',
  },
  box: {
    width: '50%',
    'margin-left':  'auto',
    'margin-right': 'auto',
  },
  timegrid: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    padding: theme.spacing(2, 2, 2),
  },
  subtitle: {},
  datepicker: {
    padding: 5,
  },
}));

interface IProps {
  usersList: string[];

  resText: string;
  isUserWaiting: boolean;
  isTimeWaiting: boolean;
  curUser: string;
  weekdays: IWeekDays;
  startDate: Date;
  endDate: Date;

  handleUserChange: (event: React.ChangeEvent<{ value: unknown; }>) => void;
  handleWeekDaysChange: (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStartTimeChange: (d: Date | null) => void;
  handleEndTimeChange: (d: Date | null) => void;
  handleScheduleSubmit: (name: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function mapToMenuItems(userList: string[]) {
  return userList.map(username => <MenuItem key={username} value={username}>{username}</MenuItem>);
}

// TODO: import `freeText` from `ManagerFormContainer`.
const freeText = 'Time slot is free';

const keyToLabel = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const WorkerScheduleForm: React.FC<IProps> = ({
  usersList,

  resText,
  isUserWaiting,
  isTimeWaiting,
  curUser,
  weekdays,
  startDate,
  endDate,

  handleUserChange,
  handleWeekDaysChange,
  handleStartTimeChange,
  handleEndTimeChange,
  handleScheduleSubmit,
}: IProps) => {
  const classes = useStyles();

  const timePickersDisabled = () => {
    return isUserWaiting && isTimeWaiting;
  };

  const boxesIn = () => {
    return !(curUser === '');
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
      <Grid className={classes.maingrid}>
        <FormControl variant='outlined' className={classes.formControl}>
          <InputLabel ref={inputLabel} id='user-select-label'>
            {'User'}
          </InputLabel>
          <Select
            labelId='user-select-label'
            id='user-select'
            value={curUser}
            onChange={handleUserChange}
            labelWidth={labelWidth}
          >
            {mapToMenuItems(usersList)}
          </Select>
        </FormControl>
        <Fade
          in={isUserWaiting}
          style={{
            transitionDelay: isUserWaiting ? '800ms' : '0ms'
          }}
          unmountOnExit
        >
          <CircularProgress className={classes.progressBar} />
        </Fade>
        
          <Grow in={boxesIn()} {...(boxesIn() ? { timeout: 1000 } : {})}>
            <Box component='span' m={1} className={classes.box}>
              <Card className={classes.card}>
                <Grid className={classes.timegrid}>
                  <div>
                    <FormControl
                      component='fieldset'
                      className={classes.formControl}
                    >
                      <FormLabel component='legend'>Weekdays</FormLabel>
                      <FormGroup>
                        {Object.keys(weekdays).map((k) => {
                          const key = k as keyof IWeekDays;
                          return (
                            <FormControlLabel
                              key={key}
                              control={
                                <Checkbox
                                  checked={weekdays[key]}
                                  onChange={handleWeekDaysChange(key)}
                                  value={key}
                                  color='primary'
                                />
                              }
                              label={keyToLabel[key]}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                    <FormControl className={classes.datepicker}>
                      <KeyboardTimePicker
                        disabled={timePickersDisabled()}
                        margin='normal'
                        id='time-picker'
                        label='From'
                        value={startDate}
                        onChange={handleStartTimeChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change time'
                        }}
                      />
                    </FormControl>
                    <FormControl className={classes.datepicker}>
                      <KeyboardTimePicker
                        disabled={timePickersDisabled()}
                        margin='normal'
                        id='time-picker'
                        label='To'
                        value={endDate}
                        onChange={handleEndTimeChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change time'
                        }}
                      />
                    </FormControl>
                  </div>
                  <Typography variant='h6' className={classes.subtitle}>
                    {resText}
                  </Typography>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={isTimeWaiting && isFree()}
                    onClick={handleScheduleSubmit(curUser)}
                  >
                    {'Assign'}
                  </Button>
                  <Fade
                    in={isTimeWaiting}
                    style={{
                      transitionDelay: isTimeWaiting ? '800ms' : '0ms'
                    }}
                    unmountOnExit
                  >
                    <CircularProgress className={classes.progressBar} />
                  </Fade>
                </Grid>
              </Card>
            </Box>
          </Grow>
        </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default WorkerScheduleForm;
