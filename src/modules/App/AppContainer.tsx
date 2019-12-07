import React from 'react';

import App from './App';
import { Api } from 'services/api';
import { CookieParser } from 'services/cookie';
import {
  workspacePath,
  managerPagePath,
  adminPagePath,
  authPath,
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
    = () => CookieParser.getRole() !== 'unknown';

  private getRedirectPath: () => string = () => {
    switch (CookieParser.getRole()) {
      case 'worker': {
        return workspacePath;
      }
      case 'manager': {
        return managerPagePath;
      }
      case 'admin': {
        return adminPagePath;
      }
      case 'unknown': {
        return authPath;
      }
    }
    throw new Error('No resolution for given role exists!');
  };

  private logOut: () => void = () => {
    (async () => {
      await this.state.api.logOut();
      this.forceUpdate();
    })();
  };

  render(): React.ReactNode {
    const {
      state: {
        api: {
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
        },
      },
      isAuthenticated,
      getRedirectPath,
      logOut,
    } = this;

    return (
      <App
        isAuthenticated={isAuthenticated()}
        getRedirectPath={getRedirectPath}
        login={login}
        getTelegramLink={getTelegramLink}
        takeItem={takeItem}
        returnItem={returnItem}
        getAvailableItemsForWorker={getAvailableItemsForWorker}
        getUsedItemsForWorker={getUsedItemsForWorker}
        checkCurrentlyAvailable={checkCurrentlyAvailable}
        registerWorkerByManager={registerWorkerByManager}
        listWorkers={listWorkers}
        setItem={setItem}
        getAvailableItemsForManager={getAvailableItemsForManager}
        getWorkerSchedule={getWorkerSchedule}
        setWorkerSchedule={setWorkerSchedule}
        checkTimeOverlap={checkTimeOverlap}
        registerManager={registerManager}
        onLogOut={logOut}
      />
    );
  }
}
