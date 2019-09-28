import { autobind } from 'core-decorators';

import { IDetailedServerUser } from './types';
import { convertUserDetails } from './converters';
import HttpActions from './HttpActions';

class Api {
  private actions: HttpActions;

  private headers = {
    get: {
      'Accept': 'application/vnd.github.v3+json',
    },
  };

  constructor() {
    this.actions = new HttpActions('https://api.github.com/', this.headers);
  }

  @autobind
  public async loadUserDetails(username: string) {
    const URL = `/users/${username}`;
    const response = await this.actions.get<IDetailedServerUser>(URL);
    return convertUserDetails(response.data);
  }
}

export default Api;
