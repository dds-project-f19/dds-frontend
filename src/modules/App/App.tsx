import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Api } from 'services/api';
import {
  authPath,
  workspacePath,
  managerPagePath,
} from 'shared/constants';
import { AuthorizationPage } from 'modules/AuthorizationPage';
import { WorkspacePage } from 'modules/WorkspacePage';
import { ManagerPage } from 'modules/ManagerPage';

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
  listWorkers: Api['listWorkers'];
  getAvailableItemsForManager: Api['getAvailableItemsForManager'];
  setItem: Api['setItem'];
  setWorkerSchedule: Api['setWorkerSchedule'];
  checkTimeOverlap: Api['checkTimeOverlap'];
}

const App: React.FC<IProps> = ({
  isAuthenticated,
  getRedirectPath,
  loginWorker,
  takeItem,
  returnItem,
  getAvailableItemsForWorker,
  getUsedItemsForWorker,
  listWorkers,
  getAvailableItemsForManager,
  setItem,
  setWorkerSchedule,
  checkTimeOverlap,
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
          <Route path={authPath}>
            <AuthorizationPage
              onSuccess={getRedirectPath}
              authorizationApi={loginWorker}
            />
          </Route>
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
              listWorkersApi={listWorkers}
              listAvailableItemsApi={getAvailableItemsForManager}
              setItemApi={setItem}
              setWorkerScheduleApi={setWorkerSchedule}
              checkOverlapApi={checkTimeOverlap}
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
