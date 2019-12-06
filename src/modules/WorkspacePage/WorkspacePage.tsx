import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Workspace } from 'features/Workspace';
import {
  IAvailableItems,
  IUsedItems,
  IBasicResponse,
  ITakeItemInfo,
  IReturnItemInfo,
} from 'shared/types/models';

interface IProps {
  availableItemsApi: () => Promise<IAvailableItems>;
  usedItemsApi: () => Promise<IUsedItems>;
  checkCurrentlyAvailable: () => Promise<boolean>;
  takeItemApi: (item: ITakeItemInfo) => Promise<IBasicResponse>;
  returnItemApi: (item: IReturnItemInfo) => Promise<IBasicResponse>;
}

const useStyles = makeStyles((theme) => ({
  WorkspacePageContainer: {
    width: '100vw',
    height: '100vh',
    padding: '30px',
    overflow: 'hidden',
  },
}));

const WorkspacePage: React.FC<IProps> = ({
  availableItemsApi,
  usedItemsApi,
  checkCurrentlyAvailable,
  takeItemApi,
  returnItemApi,
}: IProps) => {
  const classes = useStyles();

  return (
    <Container
      component='main'
      maxWidth='xl'
      className={classes.WorkspacePageContainer}
    >
      <Workspace
        availableItemsApi={availableItemsApi}
        usedItemsApi={usedItemsApi}
        checkCurrentlyAvailable={checkCurrentlyAvailable}
        takeItemApi={takeItemApi}
        returnItemApi={returnItemApi}
      />
    </Container>
  );
};

export default WorkspacePage;
