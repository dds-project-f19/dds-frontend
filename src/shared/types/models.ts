export interface IRegisterFields {
  username: string;
  password: string;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
}

export interface IWorkerInfo {
  username: string;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
}

export interface ICredentials {
  username: string;
  password: string;
}

export interface IBasicResponse {
  message: string;
}

export interface ILoginResponse {
  token: string;
}

export interface IUserInfo { // TODO: Change name
  username: string;
  name: string;
}

export interface IUserList {
  data: IUserInfo[];
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
  items: IUsedItems[];
}
