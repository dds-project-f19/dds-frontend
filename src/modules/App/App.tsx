import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';

import { LoginPage } from 'modules/LoginPage';
import { Api } from 'services/api';
import { ICredentials } from 'shared/types/models';

makeStyles((theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
}));

interface IProps { }

interface IState {
  api: Api;
  pingContent: string;
}

export default class App extends React.PureComponent<IProps, IState> {
  public state: IState = {
    api: new Api(),
    pingContent: '',
  };

  private pingServer: () => Promise<void> = async () => {
    const { api } = this.state;

    try {
      this.setState({
        pingContent: await api.ping(),
      });
    } catch (e) {
      this.setState({
        pingContent: e.toString(),
      });
    }
  }

  private login: (credentials: ICredentials) => Promise<void> = async (credentials: ICredentials) => {
    const { api } = this.state;

    try {
      // TODO: check if this a manager or a worker
      api.loginWorker(credentials)
    } catch (e) {
      // TODO: Handle errors
    }
  }

  public render(): JSX.Element {
    return (
      <React.Fragment>
        <CssBaseline />
        <LoginPage
          authorizationApi={this.login}
        />
      </React.Fragment>
    );
  }
}
