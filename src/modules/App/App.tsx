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
  login: Api['login'];
  getTelegramLink: Api['getTelegramLink'];
  takeItem: Api['takeItem'];
  returnItem: Api['returnItem'];
  getAvailableItemsForWorker: Api['getAvailableItemsForWorker'];
  getUsedItemsForWorker: Api['getUsedItemsForWorker'];
  checkCurrentlyAvailable: Api['checkCurrentlyAvailable'];
  registerWorkerByManager: Api['registerWorkerByManager'];
  listWorkers: Api['listWorkers'];
  setItem: Api['setItem'];
  getAvailableItemsForManager: Api['getAvailableItemsForManager'];
  getWorkerSchedule: Api['getWorkerSchedule'];
  setWorkerSchedule: Api['setWorkerSchedule'];
  checkTimeOverlap: Api['checkTimeOverlap'];
  registerManager: Api['registerManager'];
  onLogOut: () => void;
}

const App: React.FC<IProps> = ({
  isAuthenticated,
  getRedirectPath,
  login,
  getTelegramLink,
  takeItem,
  returnItem,
  getAvailableItemsForWorker,
  getUsedItemsForWorker,
  checkCurrentlyAvailable,
  registerWorkerByManager,
  listWorkers,
  setItem,
  getAvailableItemsForManager,
  getWorkerSchedule,
  setWorkerSchedule,
  checkTimeOverlap,
  registerManager,
  onLogOut,
}: IProps) => {
  /* const classes = */ useStyles();

  return (
    <BrowserRouter>
      <React.Fragment>
        <CssBaseline />
        {
          !isAuthenticated &&
          <Redirect to={'/'} />
        }
        <Switch>
          <Route path={workspacePath}>
            <WorkspacePage
              getTelegramLinkApi={getTelegramLink}
              availableItemsApi={getAvailableItemsForWorker}
              usedItemsApi={getUsedItemsForWorker}
              checkCurrentlyAvailableApi={checkCurrentlyAvailable}
              takeItemApi={takeItem}
              returnItemApi={returnItem}
              onLogOut={onLogOut}
            />
          </Route>
          <Route path={managerPagePath}>
            <ManagerPage
              registerWorkerApi={registerWorkerByManager}
              listWorkersApi={listWorkers}
              setItemApi={setItem}
              listAvailableItemsApi={getAvailableItemsForManager}
              getWorkerScheduleApi={getWorkerSchedule}
              setWorkerScheduleApi={setWorkerSchedule}
              checkOverlapApi={checkTimeOverlap}
              onLogOut={onLogOut}
            />
          </Route>
          <Route path={adminPagePath}>
            <AdminPage
              registerManagerApi={registerManager}
              onLogOut={onLogOut}
            />
          </Route>
          <Route path={authPath}>
            <AuthorizationPage
              onSuccess={getRedirectPath}
              authorizationApi={login}
            />
          </Route>
          <Route path='/'>
            <Redirect to={isAuthenticated ? getRedirectPath() : authPath} />
          </Route>
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
