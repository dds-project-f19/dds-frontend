import {
  IBasicResponse,
  ICredentials,
  IRegisterFields,
  IWorkerInfo,
  IUserList,
  ILoginResponse,
  IItemInfo,
  IAvailableItems,
  IUsedItems,
} from 'shared/types/models'
import HttpActions from './HttpActions';

export default class Api {
  private actions: HttpActions;
  public isAuthenticated: boolean = false;

  constructor() {
    this.actions = new HttpActions('/api');
  }

  public ping: () => Promise<string>
      = async () => await this.actions.get('/ping');

  public registerWorker: (data: IRegisterFields) => Promise<void> = async (data: IRegisterFields) => {
    const { token } = await this.actions.post('/worker/register', data);
    this.isAuthenticated = true;
    this.actions.addHeader('Authorization', token);
  }

  public loginWorker: (data: ICredentials) => Promise<void> = async (data: ICredentials) => {
    const { token } = await this.actions.post('/worker/login', data) as ILoginResponse;
    this.isAuthenticated = true;
    this.actions.addHeader('Authorization', token);
  }

  public getWorkerInfo: () => Promise<IWorkerInfo>
      = async () => await this.actions.get('/worker/get');

  public updateWorker: (newData: IWorkerInfo) => Promise<void>
      = async (newData: IWorkerInfo) => await this.actions.patch('/worker/update', newData);

  public takeItem: (item: IItemInfo) => Promise<IBasicResponse>
      = async (item: IItemInfo) => await this.actions.post('/worker/take_item', item);

  public returnItem: (item: IItemInfo) => Promise<IBasicResponse>
      = async (item: IItemInfo) => await this.actions.post('/worker/return_item', item);

  public getAvailableItemsForWorker: () => Promise<IAvailableItems>
      = async () => await this.actions.get('/worker/list_available_items');

  public getUsedItemsForWorker: () => Promise<IUsedItems>
      = async () => await this.actions.get('/worker/taken_items');

// ----------- Manager -----------

  public loginManager: (data: ICredentials) => Promise<ILoginResponse>
      = async (data: ICredentials) => await this.actions.post('/manager/login', data);

  public listWorkers: () => Promise<IUserList>
      = async () => await this.actions.post('/manager/list_workers');

  public removeWorker: (username: String) => Promise<void>
      = async (username: String) => await this.actions.delete(`/manager/remove_worker/${username}`)

  public addItem: (item: IItemInfo) => Promise<void>
      = async (item: IItemInfo) => await this.actions.patch('/manager/add_available_items', item)

  public removeItem: (item: IItemInfo) => Promise<void>
      = async (item: IItemInfo) => await this.actions.patch('/manager/remove_available_items', item)

  public getAvailableItemsForManager: () => Promise<IAvailableItems>
      = async () => await this.actions.get('/manager/list_available_items');

  public getTakenItemsForManager: () => Promise<IUsedItems>
      = async () => await this.actions.get('/manager/list_taken_items');

// ----------- Admin -----------

  public registerManager: (data: ICredentials) => Promise<void>
      = async (data: ICredentials) => await this.actions.post('/admin/register_manager', data);
}
