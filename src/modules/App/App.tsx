import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { AuthorizationPage } from 'modules/AuthorizationPage';
import { WorkspacePage } from 'modules/WorkspacePage';
import { Api } from 'services/api';

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

  public render(): JSX.Element {
    const {
      isAuthenticated,
      loginWorker,
      registerWorker,
    } = this.state.api;

    const authPath = '/auth';
    const workspacePath = '/workspace';

    return (
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          {
            !isAuthenticated &&
            <Redirect to={authPath} />
          }
          <Switch>
            <Route path={authPath}>
              <AuthorizationPage
                onSuccessRedirectPath={workspacePath}
                authorizationApi={loginWorker}
                registrationApi={registerWorker}
              />
            </Route>
            <Route path={workspacePath}>
              <WorkspacePage />
            </Route>
            <Route path='/'>
              <Redirect to={workspacePath} />
            </Route>
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}
