import React from 'react';
import {
  Droppable,
  DroppableProps,
  Draggable,
  DraggableProps,
} from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { IClientAvailableItems } from '../WorkspaceContainer';
import { WorkerItem } from 'features/WorkerItem';

interface IProps {
  droppableId: string;
  items: IClientAvailableItems;
}

const useStyles = makeStyles((theme) => ({
  ListBox: {
    padding: '15px',
    width: 'fit-content',
    height: '100%',
    overflowY: 'scroll',
  },
  Item: {
    marginBottom: '5px',
    '&:last-child': {
      marginBottom: '0',
    },
  },
}));

const ItemList: React.FC<IProps> = ({
  droppableId,
  items,
}: IProps) => {
  const classes = useStyles();

  return (
    <Droppable
      droppableId={droppableId}
    //type
    //mode
    //isDropDisabled
    //isCombineEnabled
    //direction
    //ignoreContainerClipping
    //renderClone
    //getContainerForClone
    >
      {(
        ({
          innerRef,
          placeholder,
          droppableProps,
        }, {
          isDraggingOver,
          draggingOverWith,
          draggingFromThisWith,
          // isUsingPlaceholder,
        }) => (
            <div
              ref={innerRef}
              {...droppableProps}
            >
              <Box
                className={classes.ListBox}
                border={1}
                borderRadius={5}
              >
                {Object.keys(items).map((itemId, index) => (
                  <Draggable
                    key={`itemlist-draggable-${itemId}`}
                    draggableId={itemId}
                    index={index}
                  //isDragDisabled
                  //disableInteractiveElementBlocking
                  //shouldRespectForcePress
                  >
                    {(
                      ({
                        innerRef,
                        draggableProps,
                        dragHandleProps,
                      }, {
                        isDragging,
                        isDropAnimating,
                        dropAnimation,
                        draggingOver,
                        combineWith,
                        combineTargetFor,
                        mode,
                      }) => (
                          <div
                            ref={innerRef}
                            {...draggableProps}
                            {...dragHandleProps}
                            className={classes.Item}
                          >
                            <WorkerItem
                              isDragging={isDragging}
                              itemType={items[itemId]}
                            />
                          </div>
                        )
                    ) as DraggableProps['children']}
                  </Draggable>
                ))}
                {placeholder}
              </Box>
            </div>
          )
      ) as DroppableProps['children']}
    </Droppable>
  );
};

export default ItemList;
