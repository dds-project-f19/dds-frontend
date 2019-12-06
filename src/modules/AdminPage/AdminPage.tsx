import React from 'react';
import Container from '@material-ui/core/Container';

import { Api } from 'services/api';
import { ManagerRegistrationForm } from 'features/ManagerRegistrationForm';

interface IProps {
  registerManagerApi: Api['registerManager'];
}

const AdminPage: React.FC<IProps> = ({
  registerManagerApi,
}) => {
  return (
    <Container
      component='main'
      maxWidth='sm'
    >
      <ManagerRegistrationForm
        onRegisterAttempt={registerManagerApi}
      />
    </Container>
  );
};

export default AdminPage;
