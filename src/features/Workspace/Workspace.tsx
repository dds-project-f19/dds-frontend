import React from 'react';
import { DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { ItemList } from './ItemList';
import { WorkspaceWindow, } from './WorkspaceWindow';
import {
  IClientAvailableItems,
  IClientUsedItems,
  itemListDroppableId,
} from './WorkspaceContainer';

interface ILoadingProps {
  loadingStatus: 'In Progress';
}

interface ILoadingFailedProps {
  loadingStatus: 'Failed';
}

interface ILoadedProps {
  loadingStatus?: 'Done';
  availableItems: IClientAvailableItems;
  usedItems: IClientUsedItems;
  onDragEnd: DragDropContextProps['onDragEnd'];
}

type IProps = ILoadingProps | ILoadingFailedProps | ILoadedProps;

const useStyles = makeStyles((theme) => ({
  WorkspaceBox: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
}));

const Workspace: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  switch (props.loadingStatus) {
    case 'In Progress': {
      return ( // TODO
        <div>
          {'Workspace is loading...'}
        </div>
      );
    }

    case 'Failed': {
      return ( // TODO
        <div>
          {'Loading failed! Check your connection.'}
        </div>
      );
    }

    case 'Done':
    case undefined: {
      const {
        availableItems,
        usedItems,
        onDragEnd,
      } = props as ILoadedProps;

      return (
        <DragDropContext
        //onBeforeCapture
        //onBeforeDragStart
        //onDragStart
        //onDragUpdate
          onDragEnd={onDragEnd}
        //liftInstruction
        //nonce
        //sensors
        //enableDefaultSensors
        >
          <Box
            className={classes.WorkspaceBox}
          >
            <ItemList
              droppableId={itemListDroppableId}
              items={availableItems}
            />
            <WorkspaceWindow
              items={usedItems}
            />
          </Box>
        </DragDropContext>
      );
    }
  }
};

export default Workspace;
