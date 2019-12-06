import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Api } from 'services/api';
import {
  workspacePath,
  managerPagePath,
  adminPagePath,
  authPath,
} from 'shared/constants';
import { WorkspacePage } from 'modules/WorkspacePage';
import { ManagerPage } from 'modules/ManagerPage';
import { AdminPage } from 'modules/AdminPage';
import { AuthorizationPage } from 'modules/AuthorizationPage';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
}));

interface IProps {
  isAuthenticated: boolean;
  getRedirectPath: () => string;
  loginWorker: Api['loginWorker'];
  takeItem: Api['takeItem'];
  returnItem: Api['returnItem'];
  getAvailableItemsForWorker: Api['getAvailableItemsForWorker'];
  getUsedItemsForWorker: Api['getUsedItemsForWorker'];
  registerWorkerByManager: Api['registerWorkerByManager'];
  listWorkers: Api['listWorkers'];
  setItem: Api['setItem'];
  getAvailableItemsForManager: Api['getAvailableItemsForManager'];
  setWorkerSchedule: Api['setWorkerSchedule'];
  checkTimeOverlap: Api['checkTimeOverlap'];
  registerManager: Api['registerManager'];
}

const App: React.FC<IProps> = ({
  isAuthenticated,
  getRedirectPath,
  loginWorker,
  takeItem,
  returnItem,
  getAvailableItemsForWorker,
  getUsedItemsForWorker,
  registerWorkerByManager,
  listWorkers,
  setItem,
  getAvailableItemsForManager,
  setWorkerSchedule,
  checkTimeOverlap,
  registerManager,
}: IProps) => {
  /* const classes = */ useStyles();

  return (
    <BrowserRouter>
      <React.Fragment>
        <CssBaseline />
        {
          !isAuthenticated &&
          <Redirect to={getRedirectPath()} />
        }
        <Switch>
          <Route path={workspacePath}>
            <WorkspacePage
              availableItemsApi={getAvailableItemsForWorker}
              usedItemsApi={getUsedItemsForWorker}
              takeItemApi={takeItem}
              returnItemApi={returnItem}
            />
          </Route>
          <Route path={managerPagePath}>
            <ManagerPage
              registerWorkerApi={registerWorkerByManager}
              listWorkersApi={listWorkers}
              setItemApi={setItem}
              listAvailableItemsApi={getAvailableItemsForManager}
              setWorkerScheduleApi={setWorkerSchedule}
              checkOverlapApi={checkTimeOverlap}
            />
          </Route>
          <Route path={adminPagePath}>
            <AdminPage
              registerManagerApi={registerManager}
            />
          </Route>
          <Route path={authPath}>
            <AuthorizationPage
              onSuccess={getRedirectPath}
              authorizationApi={loginWorker}
            />
          </Route>
          {
            isAuthenticated &&
            <Route path='/'>
              <Redirect to={workspacePath} />
            </Route>
          }
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
