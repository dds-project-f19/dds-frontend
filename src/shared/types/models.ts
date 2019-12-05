export interface IBasicResponse {
  message: string;
}

export interface ICredentials {
  username: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  claim: 'worker'|'manager'|'admin'|'unknown';
}

export interface IWorkerInfo {
  username: string;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
}

export interface ITakeItemInfo {
  itemtype: string;
  slot: string;
}

export interface IReturnItemInfo {
  slot: string;
}

export interface IItemInfo {
  itemtype: string;
  count: number;
}

export interface IAvailableItems {
  items: IItemInfo[];
}

export interface IUsedItem {
  itemtype: string;
  assignedtoslot: string;
}

export interface IManagerUsedItem extends IUsedItem {
  takenby: string;
}

export interface IManagerUsedItems {
  items: IManagerUsedItem[];
}

export interface IUsedItems {
  items: IUsedItem[];
}

export interface IRegisterFields {
  username: string;
  password: string;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
}

export interface IWorkerList {
  users: IWorkerInfo[];
}

export interface IManagerRegisterFields extends IRegisterFields {
  gametype: string;
}

export interface IWeekDays { // TODO: Kill me for this (by @kzvdar42)
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface ISetSchedule {
  username: string;
  starttime: string;
  endtime: string;
  workdays: string;
}

export interface ISchedule {
  starttime: string;
  endtime: string;
  workdays: string;
}

export interface IOverlapCheckResponse {
  overlap: boolean;
}
