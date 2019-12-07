import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Api } from 'services/api';
import { PageHeader } from 'features/PageHeader';
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
  onLogOut: () => void;
}

const useStyles = makeStyles((theme) => ({
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
  onLogOut,
}: IProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabIndexChange = (event: React.ChangeEvent<{}>, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <PageHeader
        pageTitle='Manager Page'
        tabs={[
          'Add/Remove Items',
          'Register New Worker',
          'Manage Worker Schedule',
        ]}
        tabIndex={tabIndex}
        handleTabIndexChange={handleTabIndexChange}
        onLogOut={onLogOut}
      />
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
