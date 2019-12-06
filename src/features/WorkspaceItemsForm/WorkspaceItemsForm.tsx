import React from 'react';
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
  title: {
    margin: 10,
  },
}));

interface IProps {
  workspace: string;

  itemsList: IItemInfo[];
  isItemsWaiting: boolean;

  handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleItemsUpdateSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function getItemTypeName(workspace: string, itemType: string) {
  return workspacesInfo[workspace].types[itemType].description;
}

const WorkspaceItemsForm: React.FC<IProps> = ({
  workspace,
  itemsList,
  isItemsWaiting,

  handleFieldChange,
  handleItemsUpdateSubmit,
}: IProps) => {
  const classes = useStyles();

  return (
    <Grid className={classes.maingrid}>
    <Box component='span' m={1} className={classes.box}>
      <Card className={classes.card}>
        <Grid item xs={10} md={11}>
          <Typography variant='h6' className={classes.title}>
            {'Available items'}
          </Typography>
          { !isItemsWaiting &&
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
                        <ListItemText primary={getItemTypeName(workspace, itemtype)} />
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
              <Button
                variant='contained'
                color='primary'
                // disabled={isUserWaiting}
                onClick={handleItemsUpdateSubmit}
              >
                {'Save'}
              </Button>
            </Box>
          </Grow> }
          { isItemsWaiting &&
          <Fade
              in={isItemsWaiting}
              style={{
                transitionDelay: isItemsWaiting ? '800ms' : '0ms'
              }}
              unmountOnExit
            >
              <CircularProgress className={classes.progressBar} />
            </Fade> }
        </Grid>
      </Card>
    </Box>
    </Grid>
  );
};

export default WorkspaceItemsForm;
