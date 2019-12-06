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
          registerManager,
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
        registerManager={registerManager}
      />
    );
  }
}
