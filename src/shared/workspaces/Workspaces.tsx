type Id = string;
type TypeId = Id;
type SlotId = Id;
type WorkspaceId = Id;

type ItemPictureId = 'hammer';

interface ISlotInfo {
  allowedTypes: TypeId[];
  translation: {
    x: string;
    y: string;
  };
}

interface IItemType {
  description: string;
  pictureId: ItemPictureId;
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
        pictureId: 'hammer',
      },
    },
  },
};

export default workspaces;
