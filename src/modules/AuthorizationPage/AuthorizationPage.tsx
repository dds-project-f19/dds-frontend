import React from 'react';
import Container from '@material-ui/core/Container';

import { LoginForm } from 'features/LoginForm';
import { ICredentials } from 'shared/types/models';

interface IProps {
  onSuccess: () => string;
  authorizationApi: (credendtials: ICredentials) => Promise<void>;
}

const AuthorizationPage: React.FC<IProps> = ({
  onSuccess,
  authorizationApi,
}: IProps) => {
  return (
    <Container
      component='main'
      maxWidth='sm'
    >
      <LoginForm
        onLoginAttempt={authorizationApi}
        onSuccess={onSuccess}
      />
    </Container>
  );
};

export default AuthorizationPage;
