import React from 'react';
import Gavel from '@material-ui/icons/Gavel';

type Id = string;
type TypeId = Id;
type SlotId = Id;
type WorkspaceId = Id;

type ItemPicture = () => React.ReactElement;

interface ISlotInfo {
  allowedTypes: TypeId[];
  translation: {
    x: string;
    y: string;
  };
}

interface IItemType {
  description: string;
  pic: ItemPicture;
}

interface IWorkspaceDescription {
  [key: string]: {
    slots: {
      [key: string]: ISlotInfo;
    };
    types: {
      [key: string]: IItemType;
    };
  };
}

const workspaces: IWorkspaceDescription = {
  garage: {
    slots: {
      '0': {
        allowedTypes: ['0'],
        translation: {
          x: '531px',
          y: '314px',
        },
      },
      '1': {
        allowedTypes: ['0'],
        translation: {
          x: '411px',
          y: '724px',
        },
      }
    },
    types: {
      '0': {
        description: 'Hammer',
        pic: () => <Gavel style={{ width: '100%', height: '100%' }} />,
      },
    },
  },
};

export default workspaces;
