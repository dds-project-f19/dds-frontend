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
  takenby: string;
  itemtype: string;
  assignedtoslot: string;
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
