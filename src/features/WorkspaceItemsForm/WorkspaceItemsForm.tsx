import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

import { CookieParser } from 'services/cookie';
import { IItemInfo } from 'shared/types/models';
import { workspacesInfo } from 'shared/workspaces';

const useStyles = makeStyles((theme) => ({
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
    'justify-content': 'center',
  },
  box: {
    width: '50%',
  },
  card: {
    padding: theme.spacing(2, 2, 2),
  },
  listitem: {
    margin: 20,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  title: {
    margin: 10,
  },
}));

interface IProps {
  itemsList: IItemInfo[];
  isItemsWaiting: boolean;
  buttonLoading: boolean;
  buttonSuccess: boolean;

  handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleItemsUpdateSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const WorkspaceItemsForm: React.FC<IProps> = ({
  itemsList,
  isItemsWaiting,
  buttonLoading,
  buttonSuccess,

  handleFieldChange,
  handleItemsUpdateSubmit,
}: IProps) => {
  const { types } = workspacesInfo[CookieParser.getWorkspace()];
  const classes = useStyles();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: buttonSuccess,
  });

  return (
    <Grid className={classes.maingrid}>
      <Box component='span' m={1} className={classes.box}>
        <Card className={classes.card}>
          <Grid item xs={10} md={11}>
            <Typography variant='h6' className={classes.title}>
              {'Available items'}
            </Typography>
            {
              isItemsWaiting ? (
                <Fade
                  in={isItemsWaiting}
                  style={{
                    transitionDelay: isItemsWaiting ? '800ms' : '0ms'
                  }}
                  unmountOnExit
                >
                  <CircularProgress className={classes.progressBar} />
                </Fade>
              ) : (
                  <Grow in={!isItemsWaiting}>
                    <Box>
                      <List>
                        {itemsList.map(({ itemtype, count }) =>
                          React.cloneElement(
                            (
                              <ListItem
                                key={itemtype}
                                className={classes.listitem}
                              >
                                <ListItemText primary={types[itemtype].description} />
                                <ListItemSecondaryAction>
                                  <TextField
                                    id={itemtype}
                                    label='Amount'
                                    type='number'
                                    variant='outlined'
                                    value={count}
                                    // disabled={itemsDisabled()}
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
                      <div className={classes.wrapper}>
                        <Button
                          variant='contained'
                          color='primary'
                          className={buttonClassname}
                          disabled={buttonLoading}
                          onClick={handleItemsUpdateSubmit}
                        >
                          Save
                    </Button>
                        {buttonLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </div>
                    </Box>
                  </Grow>
                )
            }
          </Grid>
        </Card>
      </Box>
    </Grid>
  );
};

export default WorkspaceItemsForm;
