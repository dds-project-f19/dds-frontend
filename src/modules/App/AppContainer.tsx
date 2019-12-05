import React from 'react';

import App from './App';
import { Api } from 'services/api';
import {
  authPath,
  workspacePath,
  managerPagePath,
} from 'shared/constants';

interface IProps { }

interface IState {
  api: Api;
}

export default class AppContainer extends React.PureComponent<IProps, IState> {
  public state: IState = {
    api: new Api(),
  };

  private isAuthenticated: () => boolean
    = () => this.state.api.role !== 'unknown';

  private getRedirectPath = () => {
    switch (this.state.api.role) {
      case 'unknown': {
        return authPath;
      }
      case 'manager': {
        return managerPagePath;
      }
      case 'worker': {
        return workspacePath;
      }
      default: {
        throw new Error('No resolution for given role exists!');
      }
    }
  }

  public render(): JSX.Element {
    const {
      state: {
        api: {
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
        },
      },
      isAuthenticated,
      getRedirectPath,
    } = this;

    return (
      <App
        isAuthenticated={isAuthenticated()}
        getRedirectPath={getRedirectPath}
        loginWorker={loginWorker}
        takeItem={takeItem}
        returnItem={returnItem}
        getAvailableItemsForWorker={getAvailableItemsForWorker}
        getUsedItemsForWorker={getUsedItemsForWorker}
        registerWorkerByManager={registerWorkerByManager}
        listWorkers={listWorkers}
        setItem={setItem}
        getAvailableItemsForManager={getAvailableItemsForManager}
        setWorkerSchedule={setWorkerSchedule}
        checkTimeOverlap={checkTimeOverlap}
      />
    );
  }
}
