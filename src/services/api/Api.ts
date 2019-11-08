import HttpActions from './HttpActions';

export default class Api {
  private actions: HttpActions;

  constructor() {
    this.actions = new HttpActions('http://localhost:9000');
  }

  public ping: () => Promise<string>
      = async () => await this.actions.get('/ping');
}
