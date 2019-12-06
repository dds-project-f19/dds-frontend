import React from 'react';
import {
  Droppable,
  DroppableProps,
  Draggable,
  DraggableProps,
} from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { CookieParser } from 'services/cookie';
import { IClientUsedItems } from '../WorkspaceContainer';
import { WorkerItem } from 'features/WorkerItem';
import { workspacesInfo } from 'shared/workspaces';

interface IProps {
  items: IClientUsedItems;
}

const useStyles = makeStyles((theme) => ({
  SlotBox: {
    padding: '10px',
    width: 'fit-content',
    height: 'fit-content',
  },
}));

const WorkspaceWindow: React.FC<IProps> = ({
  items,
}: IProps) => {
  const { slots } = workspacesInfo[CookieParser.getWorkspace()];
  const classes = useStyles();

  return (
    <React.Fragment>
      {Object.keys(slots).map((slotId) => {
        const emplacedItemId = Object.keys(items).find((id) => (items[id].assignedtoslot === slotId));
        const isEmpty: boolean = emplacedItemId === undefined;

        let droppableContent = isEmpty ? (
          <WorkerItem placeholder />
        ) : (
            <Draggable
              draggableId={emplacedItemId as string}
              index={0}
            >
              {(
                ({
                  innerRef,
                  draggableProps,
                  dragHandleProps,
                }, { isDragging }) => (
                    <div
                      ref={innerRef}
                      {...draggableProps}
                      {...dragHandleProps}
                    >
                      <WorkerItem
                        isDragging={isDragging}
                        itemType={items[emplacedItemId as string].itemtype}
                      />
                    </div>
                  )
              ) as DraggableProps['children']}
            </Draggable>
          );

        return (
          <Box
            key={`workspacewindow-droppable-${slotId}`}
            className={classes.SlotBox}
          >
            <Droppable
              droppableId={slotId}
              isDropDisabled={!isEmpty}
            >
              {(
                ({
                  innerRef,
                  placeholder,
                  droppableProps,
                }) => (
                    <div
                      ref={innerRef}
                      {...droppableProps}
                    >
                      {droppableContent}
                      {placeholder}
                    </div>
                  )
              ) as DroppableProps['children']}
            </Droppable>
          </Box>
        );
      })}
    </React.Fragment>
  );
};

export default WorkspaceWindow;
