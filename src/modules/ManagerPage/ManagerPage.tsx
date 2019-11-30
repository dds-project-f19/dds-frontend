import React from 'react';
import Container from '@material-ui/core/Container';

import { ManagerForm } from 'features/ManagerForm';

interface IProps { }

const ManagerPage: React.FC<IProps> = ({ }: IProps) => {
  return (
    <Container
      component='main'
      maxWidth='xl'
    >
      <ManagerForm></ManagerForm>
    </Container>
  );
};

export default ManagerPage;
