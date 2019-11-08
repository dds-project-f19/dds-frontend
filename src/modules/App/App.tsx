import React from 'react';

import { LoginPage } from '../LoginPage';

import { Api } from 'services/api';

interface IProps { }

interface IState {
  api: Api;
  pingContent: string;
}

export default class App extends React.PureComponent<IProps, IState> {
  public state: IState = {
    api: new Api(),
    pingContent: '',
  }

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

  public render() {
    const { pingContent } = this.state;

    return (
      <LoginPage
        pingContent={pingContent}
        pingServer={this.pingServer}
      />
    );
  }
}
