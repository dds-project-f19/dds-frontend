import {
  IBasicResponse,
  ICredentials,
  ILoginResponse,
  IWorkerInfo,
  ITakeItemInfo,
  IReturnItemInfo,
  IItemInfo,
  IAvailableItems,
  IRegisterFields,
  IWorkerList,
  IManagerUsedItems,
  IManagerRegisterFields,
  ISetSchedule,
  ISchedule,
  IOverlapCheckResponse,
} from 'shared/types/models';
import HttpActions from './HttpActions';

export default class Api {
  private actions: HttpActions;
  public role: ILoginResponse['claim'] = 'unknown';

  constructor() {
    this.actions = new HttpActions('/api');
  }

  public ping: () => Promise<string>
    = async () => await this.actions.get('/ping');

// ----------- Worker -----------

  public loginWorker: (data: ICredentials) => Promise<void> = async (data) => {
    const { token, claim } = await this.actions.post('/common/login', data) as ILoginResponse;
    this.role = claim;
    this.actions.addHeader('Authorization', token);
  };

  public getWorkerInfo: () => Promise<IWorkerInfo>
    = async () => await this.actions.get('/worker/get');

  public updateWorker: (newData: IWorkerInfo) => Promise<void> = async (newData) => {
    await this.actions.patch('/worker/update', newData);
  };

  public takeItem: (item: ITakeItemInfo) => Promise<IBasicResponse>
    = async (item) => await this.actions.post('/worker/take_item', item);

  public returnItem: (item: IReturnItemInfo) => Promise<IBasicResponse>
    = async (item) => await this.actions.post('/worker/return_item', item);

  public getAvailableItemsForWorker: () => Promise<IAvailableItems>
    = async () => await this.actions.get('/worker/list_available_items');

  public getUsedItemsForWorker: () => Promise<IManagerUsedItems>
    = async () => await this.actions.get('/worker/list_taken_items');

  public getSchedule: () => Promise<ISchedule>
    = async () => await this.actions.get('/worker/get_schedule');

// ----------- Manager -----------

  public registerWorkerByManager: (data: IRegisterFields) => Promise<void> = async (data) => {
    // This token is useless since we're logged in as a manager
    // eslint-disable-next-line
    const { token } = await this.actions.post('/manager/register_worker', data) as ILoginResponse;
  };

  public listWorkers: () => Promise<IWorkerList>
    = async () => await this.actions.get('/manager/list_workers');

  public removeWorker: (username: string) => Promise<void> = async (username) => {
    await this.actions.delete(`/manager/remove_worker/${username}`);
  };

  public setItem: (item: IItemInfo) => Promise<void> = async (item) => {
    await this.actions.patch('/manager/set_available_items', item);
  };

  public removeItem: (item: IItemInfo) => Promise<void> = async (item) => {
    await this.actions.patch('/manager/remove_available_items', item);
  };

  public getAvailableItemsForManager: () => Promise<IAvailableItems>
    = async () => await this.actions.get('/manager/list_available_items');

  public getTakenItemsForManager: () => Promise<IManagerUsedItems>
    = async () => await this.actions.get('/manager/list_taken_items');

  public setWorkerSchedule: (setShedule: ISetSchedule) => Promise<IBasicResponse>
    = async (setShedule) => await this.actions.post('/manager/set_worker_schedule', setShedule);

  public checkTimeOverlap: (shedule: ISchedule) => Promise<boolean> = async (shedule) => {
    const { overlap } = await this.actions.post('/manager/check_overlap', shedule) as IOverlapCheckResponse;
    return overlap;
  };

// ----------- Admin -----------

  public registerManager: (data: IManagerRegisterFields) => Promise<void> = async (data) => {
    await this.actions.post('/admin/register_manager', data);
  };
}
