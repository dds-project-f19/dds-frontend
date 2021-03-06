import React from 'react';
import WorkspaceItemsForm from './WorkspaceItemsForm';
import update from 'react-addons-update';

import { CookieParser } from 'services/cookie';
import {
  IAvailableItems,
  IItemInfo,
} from 'shared/types/models';
import { workspacesInfo } from 'shared/workspaces';

interface IProps {
  listAvailableItemsApi: () => Promise<IAvailableItems>;
  setItemApi: (item: IItemInfo) => Promise<void>;
}

interface IState {
  itemsList: IItemInfo[];
  isItemsWaiting: boolean;
  buttonLoading: boolean;
  buttonSuccess: boolean;
}

export default class WorkspaceItemsFormContainer extends React.PureComponent<IProps, IState> {
  public state: IState = {
    itemsList: [],
    isItemsWaiting: false,
    buttonLoading: false,
    buttonSuccess: false,
  };

  private _isMounted: boolean = false; // TODO: Cansellable promises

  componentDidMount() {
    this._isMounted = true;
    this.requestData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  private handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.buttonLoading) return;

    const { itemsList } = this.state;
    const { id, value } = event.target;
    const numValue: number = parseInt(value);

    if (numValue < 0) return;

    const index = itemsList.findIndex(item => item.itemtype === id);

    this.setState({
      itemsList: update(this.state.itemsList, { [index]: { count: { $set: numValue } } }),
      buttonSuccess: false,
    });
  };

  private requestData = async () => {
    const {
      state: {
        itemsList,
      },
    } = this;
    // if (!this._isMounted) return;

    this.setState({
      isItemsWaiting: true,
    });

    const { items } = await this.props.listAvailableItemsApi();

    const newItemsList: typeof itemsList = [];
    for (const type in workspacesInfo[CookieParser.getWorkspace()].types) {
      newItemsList.push((items || []).find(({ itemtype }) => itemtype === type) || { itemtype: type, count: 0 });
    }

    if (this._isMounted) { // Maybe condition on `items` is wrong
      this.setState({
        itemsList: newItemsList,
        isItemsWaiting: false,
      });
    };
  };

  private handleItemsUpdateSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = (event) => {
    if (this.state.buttonLoading) return;
    event.preventDefault();

    const {
      props: {
        setItemApi,
      },
      state: {
        itemsList,
      },
    } = this;

    this.setState({
      buttonLoading: true,
      buttonSuccess: false,
    })

    itemsList.forEach((itemInfo) => setItemApi(itemInfo));

    this.setState({
      buttonLoading: false,
      buttonSuccess: true,
    })
  };

  render(): React.ReactNode {
    const {
      state: {
        itemsList,
        isItemsWaiting,
        buttonLoading,
        buttonSuccess,
      },
      handleFieldChange,
      handleItemsUpdateSubmit,
    } = this;

    return (
      <WorkspaceItemsForm
        itemsList={itemsList}
        isItemsWaiting={isItemsWaiting}
        buttonLoading={buttonLoading}
        buttonSuccess={buttonSuccess}
        handleFieldChange={handleFieldChange}
        handleItemsUpdateSubmit={handleItemsUpdateSubmit}
      />
    );
  }
}
