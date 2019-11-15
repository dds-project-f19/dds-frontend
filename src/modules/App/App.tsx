import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { AuthorizationPage } from 'modules/AuthorizationPage';
import { Api } from 'services/api';
import { ICredentials, IRegisterFields } from 'shared/types/models';

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

  private login: (credentials: ICredentials) => Promise<void> = async (credentials: ICredentials) => {
    const { api } = this.state;

    try {
      // TODO: check if this a manager or a worker
      api.loginWorker(credentials)
    } catch (e) {
      // TODO: Handle errors
    }
  }

  private register: (regFields: IRegisterFields) => Promise<void> = async (regFields: IRegisterFields) => {
    const { api } = this.state;

    try {
      // TODO: check if this a manager or a worker
      api.registerWorker(regFields)
    } catch (e) {
      // TODO: Handle errors
    }
  }

  public render(): JSX.Element {
    const {
      login,
      register,
      state: {
        api: {
          isAuthenticated,
        },
      },
    } = this;

    const authPath = '/auth';

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
                authorizationApi={login}
                registrationApi={register}
              />
            </Route>
            <Route path='/'>
              {/* TODO: '/game' */}
              <Redirect to={authPath} />
            </Route>
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}
