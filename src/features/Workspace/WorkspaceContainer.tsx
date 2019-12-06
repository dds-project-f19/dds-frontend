import React from 'react';
import { DragDropContextProps } from 'react-beautiful-dnd';

import Workspace from './Workspace';
import {
  IAvailableItems,
  IUsedItems,
  IBasicResponse,
  ITakeItemInfo,
  IReturnItemInfo,
  IItemInfo,
  IUsedItem,
} from 'shared/types/models';

interface IProps {
  availableItemsApi: () => Promise<IAvailableItems>;
  usedItemsApi: () => Promise<IUsedItems>;
  takeItemApi: (item: ITakeItemInfo) => Promise<IBasicResponse>;
  returnItemApi: (item: IReturnItemInfo) => Promise<IBasicResponse>;
}

export interface IClientAvailableItems {
  [id: string]: IItemInfo['itemtype'];
}

export interface IClientUsedItems {
  [id: string]: IUsedItem;
}

interface IData {
  availableItems?: IClientAvailableItems;
  usedItems?: IClientUsedItems;
}

interface IRelocationCandidate {
  itemId: keyof IClientUsedItems;
  sourceId: IUsedItem['assignedtoslot'],
  destinationId: IUsedItem['assignedtoslot'],
}

interface IState {
  requestItemsError?: any;
  data: IData;
  relocationCandidate: IRelocationCandidate | null;
}

export const itemListDroppableId = 'item_list';

export default class WorkspaceContainer extends React.PureComponent<IProps, IState> {
  public state: IState = {
    requestItemsError: undefined,
    data: {
      availableItems: undefined,
      usedItems: undefined,
    },
    relocationCandidate: null,
  };
  // https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
  // TODO: cancellable promises
  private _isMounted: boolean = false;

  componentDidMount() {
    this._isMounted = true;
    this.requestItems();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  private transformData(
    { items: availableItems }: IAvailableItems,
    { items: usedItems }: IUsedItems,
  ): IData {
    let counter = 0;

    function nextId() {
      return (counter++).toString(36);
    }

    let newAvailableItems: IData['availableItems'] = {};

    if (availableItems !== null) { // TODO: no if
      for (const { itemtype: itemType, count } of availableItems) {
        for (let i = 0; i < count; ++i) {
          newAvailableItems[nextId()] = itemType;
        }
      }
    }

    let newUsedItems: IData['usedItems'] = {};

    if (usedItems !== null) { // TODO: no if
      for (const item of usedItems) {
        newUsedItems[nextId()] = item;
      }
    }

    return {
      availableItems: newAvailableItems,
      usedItems: newUsedItems,
    };
  }

  private async requestItems(): Promise<void> {
    const {
      availableItemsApi,
      usedItemsApi,
    } = this.props;

    let availableItems, usedItems;

    try {
      ([availableItems, usedItems] = await Promise.all([availableItemsApi(), usedItemsApi()]));
    } catch (e) {
      if (this._isMounted) {
        this.setState({
          requestItemsError: e,
        });
      }
      return;
    }

    if (this._isMounted) {
      this.setState({
        data: this.transformData(
          availableItems,
          usedItems,
        ),
      });
    }
  }

  private async requestRelocation(relocationCandidate: IRelocationCandidate) {
    const {
      props: {
        takeItemApi,
        returnItemApi,
      },
      state: {
        data: {
          availableItems,
          usedItems,
        },
      },
    } = this;

    if (relocationCandidate === null
      || availableItems === undefined
      || usedItems === undefined) {
      return; // Should be unreachable
    }

    const {
      itemId,
      sourceId,
      destinationId,
    } = relocationCandidate;

    let success: boolean = true;
    let newAvailableItems = { ...availableItems };
    let newUsedItems = { ...usedItems };

    if (sourceId === itemListDroppableId) {
      // From list to slot
      const itemType = availableItems[itemId];

      try {
        await takeItemApi({
          itemtype: itemType,
          slot: destinationId,
        });
      } catch (e) {
        success = false;
      }

      if (success) {
        newUsedItems[itemId] = {
          itemtype: availableItems[itemId],
          assignedtoslot: destinationId,
        };
        delete newAvailableItems[itemId];
      }
    }
    else {
      // From slot to list
      try {
        await returnItemApi({
          slot: sourceId,
        });
      } catch (e) {
        success = false;
      }

      if (success) {
        newAvailableItems[itemId] = usedItems[itemId].itemtype;
        delete newUsedItems[itemId];
      }
    }

    if (this._isMounted) {
      this.setState({
        relocationCandidate: null,
      });
      if (success) {
        this.setState({
          data: {
            availableItems: newAvailableItems,
            usedItems: newUsedItems,
          },
        });
      }
    }
  }

  private onDragEnd: DragDropContextProps['onDragEnd'] = ({
    draggableId,
    type,
    source: {
      droppableId: sourceId,
      index: sourceIndex,
    },
    mode,
    destination,
    combine,
    reason,
  }, { announce }) => {
    if (!destination) {
      return;
    }

    const {
      droppableId: destinationId,
      // index: destinationIndex, // TODO: move to another slot
    } = destination;

    if (sourceId === destinationId) {
      return; // TODO?
    }

    const relocationCandidate = {
      itemId: draggableId,
      sourceId,
      destinationId,
    };

    this.setState({
      relocationCandidate,
    });

    this.requestRelocation(relocationCandidate);
  };

  render(): JSX.Element {
    const {
      state: {
        requestItemsError,
        data: {
          availableItems,
          usedItems,
        },
      },
    } = this;

    if (requestItemsError !== undefined) {
      return (
        <Workspace loadingStatus='Failed' />
      );
    }

    else if (availableItems === undefined || usedItems === undefined) {
      return (
        <Workspace loadingStatus='In Progress' />
      );
    }

    return (
      <Workspace
        availableItems={availableItems}
        usedItems={usedItems}
        onDragEnd={this.onDragEnd}
      />
    );
  }
}
