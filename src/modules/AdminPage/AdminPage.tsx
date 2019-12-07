import React from 'react';
import Container from '@material-ui/core/Container';

import { Api } from 'services/api';
import { PageHeader } from 'features/PageHeader';
import { ManagerRegistrationForm } from 'features/ManagerRegistrationForm';

interface IProps {
  registerManagerApi: Api['registerManager'];
  onLogOut: () => void;
}

const AdminPage: React.FC<IProps> = ({
  registerManagerApi,
  onLogOut,
}) => {
  return (
    <React.Fragment>
      <PageHeader
        pageTitle={'Admin Page'}
        tabs={[
          'Register New Manager',
        ]}
        tabIndex={0}
        handleTabIndexChange={() => { }}
        onLogOut={onLogOut}
      />
      <Container
        component='main'
        maxWidth='sm'
      >
        <ManagerRegistrationForm
          onRegisterAttempt={registerManagerApi}
        />
      </Container>
    </React.Fragment>
  );
};

export default AdminPage;
