import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
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

import { IItemInfo, IWeekDays } from 'shared/types/models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    progressBar: {
      margin: theme.spacing(1),
    },
    maingrid: {
      display: 'flex',
      flexDirection: 'row',
    },
    leftbox: {
      width: '40%',
    },
    rightbox: {
      width: '55%',
    },
    timegrid: {
      display: 'flex',
      flexDirection: 'column',
    },
    card: {
      padding: theme.spacing(2, 2, 2),
    },
    listdiv: {
      backgroundColor: theme.palette.background.paper,
    },
    listitem: {
      margin: 20,
    },
    title: {
      margin: 10,
    },
    subtitle: {},
    datepicker: {
      padding: 5,
    },
  })
);

interface IProps {
  userslist: string[];
  itemslist: IItemInfo[];

  resText: string;
  isUserWaiting: boolean;
  isTimeWaiting: boolean;
  curUser: string;
  weekdays: IWeekDays,
  startDate: Date;
  endDate: Date;

  handleUserChange: (event: React.ChangeEvent<{ value: unknown; }>) => void;
  handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleWeekDaysChange: (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStartTimeChange: (d: Date | null) => void;
  handleEndTimeChange: (d: Date | null) => void;
}

function mapToMenuItems(userList: string[]) {
  return userList.map(username => <MenuItem key={username} value={username}>{username}</MenuItem>);
}

const ManagerForm: React.FC<IProps> = ({
  userslist,
  itemslist,

  resText,
  isUserWaiting,
  isTimeWaiting,
  curUser,
  weekdays,
  startDate,
  endDate,

  handleUserChange,
  handleFieldChange,
  handleWeekDaysChange,
  handleStartTimeChange,
  handleEndTimeChange,
}: IProps) => {
  const classes = useStyles();

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

  const timePickersDisabled = () => {
    return isUserWaiting && isTimeWaiting;
  };

  const itemsDisabled = () => {
    return isUserWaiting;
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
      <div>
        <Typography variant='h4' className={classes.title}>
          {'Manager Page'}
        </Typography>
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
            {mapToMenuItems(userslist)}
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
        <Grid className={classes.maingrid}>
          <Grow in={boxesIn()}>
            <Box component='span' m={1} className={classes.leftbox}>
              <Card className={classes.card}>
                <Grid item xs={10} md={11}>
                  <Typography variant='h6' className={classes.title}>
                    {'Available items'}
                  </Typography>
                  <div className={classes.listdiv}>
                    <List>
                      {itemslist.map(({ itemtype, count }) =>
                        React.cloneElement(
                          (
                            <ListItem
                              key={itemtype}
                              className={classes.listitem}
                            >
                              <ListItemText primary={itemtype} />
                              <ListItemSecondaryAction>
                                <TextField
                                  id={itemtype}
                                  label='Amount'
                                  type='number'
                                  variant='outlined'
                                  value={count}
                                  disabled={itemsDisabled()}
                                  onChange={handleFieldChange}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          ) as React.ReactElement,
                          {
                            key: itemtype
                          }
                        )
                      )}
                    </List>
                  </div>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={isUserWaiting}
                  >
                    {'Save'}
                  </Button>
                </Grid>
              </Card>
            </Box>
          </Grow>
          <Grow in={boxesIn()} {...(boxesIn() ? { timeout: 1000 } : {})}>
            <Box component='span' m={1} className={classes.rightbox}>
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
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default ManagerForm;
