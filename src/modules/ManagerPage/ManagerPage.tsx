import React from 'react';
import Container from '@material-ui/core/Container';

import { ManagerForm } from 'features/ManagerForm';
import { IWorkerList, IAvailableItems, IItemInfo, IWeekDays, ISetSchedule, ISchedule, IBasicResponse } from 'shared/types/models';

interface IProps {
  listWorkersApi: () => Promise<IWorkerList>;
  listAvailableItemsApi: () => Promise<IAvailableItems>;
  setItemApi: (item: IItemInfo) => Promise<void>;
  setWorkerScheduleApi: (setShedule: ISetSchedule) => Promise<IBasicResponse>;
  checkOverlapApi: (shedule: ISchedule) => Promise<boolean>;
}

const ManagerPage: React.FC<IProps> = ({
  listWorkersApi,
  listAvailableItemsApi,
  setItemApi,
  setWorkerScheduleApi,
  checkOverlapApi,
}: IProps) => {
  return (
    <Container
      component='main'
      maxWidth='xl'
    >
      <ManagerForm
        workspace='garage' // TODO: retrieve workspace info
        listWorkersApi={listWorkersApi}
        listAvailableItemsApi={listAvailableItemsApi}
        setItemApi={setItemApi}
        setWorkerScheduleApi={setWorkerScheduleApi}
        checkOverlapApi={checkOverlapApi}
      />
    </Container>
  );
};

export default ManagerPage;
