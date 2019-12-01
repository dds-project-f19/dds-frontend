import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { AuthorizationPage } from 'modules/AuthorizationPage';
import { WorkspacePage } from 'modules/WorkspacePage';
import { Api } from 'services/api';
import { ManagerPage } from 'modules/ManagerPage';

makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
}));

interface IProps { }

interface IState {
  api: Api;
}

export default class App extends React.PureComponent<IProps, IState> {
  public state: IState = {
    api: new Api(),
  };

  private isAuthenticated(): boolean {
    return this.state.api.role !== 'unknown';
  }

  public render(): JSX.Element {
    const {
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
    } = this.state.api;

    const authPath = '/auth';
    const workspacePath = '/workspace';
    const managerPagePath = '/manage';

    const redirectTo = () => {
      const { role } = this.state.api;
      switch (role) {
        case 'manager': {
          return managerPagePath;
        }
        case 'worker': return workspacePath;
        default: return authPath;
      }
    }

    return (
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          {
            !this.isAuthenticated() &&
            <Redirect to={authPath} />
          }
          <Switch>
            <Route path={authPath}>
              <AuthorizationPage
                onSuccess={redirectTo}
                authorizationApi={loginWorker}
                registrationApi={async () => { }} // FIXME: remove sign up
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
              this.isAuthenticated() &&
              <Route path='/'>
                <Redirect to={workspacePath} />
              </Route>
            }
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}
