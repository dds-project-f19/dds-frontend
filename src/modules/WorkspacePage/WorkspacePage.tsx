import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import { PageHeader } from 'features/PageHeader';
import { Workspace } from 'features/Workspace';
import {
  IAvailableItems,
  IUsedItems,
  IBasicResponse,
  ITakeItemInfo,
  IReturnItemInfo,
} from 'shared/types/models';

interface IProps {
  getTelegramLinkApi: () => Promise<string>;
  availableItemsApi: () => Promise<IAvailableItems>;
  usedItemsApi: () => Promise<IUsedItems>;
  checkCurrentlyAvailableApi: () => Promise<boolean>;
  takeItemApi: (item: ITakeItemInfo) => Promise<IBasicResponse>;
  returnItemApi: (item: IReturnItemInfo) => Promise<IBasicResponse>;
  onLogOut: () => void;
}

const useStyles = makeStyles((theme) => ({
  pageBox: {
    width: '100vw',
    height: '100vh',
  },
  pageContainer: {
    width: '100%',
    height: '90%',
    padding: '30px',
    overflow: 'hidden',
  },
}));

const WorkspacePage: React.FC<IProps> = ({
  getTelegramLinkApi,
  availableItemsApi,
  usedItemsApi,
  checkCurrentlyAvailableApi,
  takeItemApi,
  returnItemApi,
  onLogOut,
}: IProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabIndexChange = (event: React.ChangeEvent<{}>, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const [telegramLink, setTelegramLink] = React.useState();

  (async () => {
    if (!telegramLink) {
      setTelegramLink(await getTelegramLinkApi())
    }
  })();

  const classes = useStyles();

  return (
    <Box
      className={classes.pageBox}
    >
      <PageHeader
        pageTitle={'Workspace'}
        tabs={[
          'Move items',
          'Telegram bot',
        ]}
        tabIndex={tabIndex}
        handleTabIndexChange={handleTabIndexChange}
        onLogOut={onLogOut}
      />
      <Container
        component='main'
        maxWidth='xl'
        className={classes.pageContainer}
      >
        {[
          (
            <Workspace
              availableItemsApi={availableItemsApi}
              usedItemsApi={usedItemsApi}
              checkCurrentlyAvailableApi={checkCurrentlyAvailableApi}
              takeItemApi={takeItemApi}
              returnItemApi={returnItemApi}
            />
          ),
          (
            <Button
              href={telegramLink}
            >
              {'Join Telegram bot'}
            </Button>
          ),
        ][tabIndex]}
      </Container>
    </Box>
  );
};

export default WorkspacePage;
