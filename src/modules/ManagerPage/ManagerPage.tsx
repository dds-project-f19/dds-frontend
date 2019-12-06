import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import { Api } from 'services/api';
import { WorkspaceItemsForm } from 'features/WorkspaceItemsForm';
import { WorkerScheduleForm } from 'features/WorkerScheduleForm';
import { WorkerRegistrationForm } from 'features/WorkerRegistrationForm';

interface IProps {
  registerWorkerApi: Api['registerWorkerByManager'];
  listWorkersApi: Api['listWorkers'];
  setItemApi: Api['setItem'];
  listAvailableItemsApi: Api['getAvailableItemsForManager'];
  getWorkerScheduleApi: Api['getWorkerSchedule'];
  setWorkerScheduleApi: Api['setWorkerSchedule'];
  checkOverlapApi: Api['checkTimeOverlap'];
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTitle: {
    margin: theme.spacing(1),
  },
  pageContainer: {
    padding: theme.spacing(2),
  },
}));

const ManagerPage: React.FC<IProps> = ({
  registerWorkerApi,
  listWorkersApi,
  listAvailableItemsApi,
  setItemApi,
  getWorkerScheduleApi,
  setWorkerScheduleApi,
  checkOverlapApi,
}: IProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const classes = useStyles();

  const handleTabIndexChange = (event: React.ChangeEvent<{}>, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  return (
    <React.Fragment>
      <AppBar
        position='static'
        className={classes.appBar}
      >
        <Typography
          variant='h5'
          className={classes.pageTitle}
        >
          {'Manager Page'}
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabIndexChange}>
          <Tab label='Add/Remove Items' />
          <Tab label='Register New Worker' />
          <Tab label='Manage Worker Schedule' />
        </Tabs>
      </AppBar>
      <Container
        component='main'
        maxWidth='xl'
        className={classes.pageContainer}
      >
        {[
          (
            <WorkspaceItemsForm
              listAvailableItemsApi={listAvailableItemsApi}
              setItemApi={setItemApi}
            />
          ),
          (
            <WorkerRegistrationForm
              onRegisterAttempt={registerWorkerApi}
            />
          ),
          (
            <WorkerScheduleForm
              listWorkersApi={listWorkersApi}
              getWorkerScheduleApi={getWorkerScheduleApi}
              setWorkerScheduleApi={setWorkerScheduleApi}
              checkOverlapApi={checkOverlapApi}
            />
          ),
        ][tabIndex]}
      </Container>
    </React.Fragment>
  );
};

export default ManagerPage;
