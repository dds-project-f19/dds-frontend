import React from 'react';
import Container from '@material-ui/core/Container';

import { LoginForm } from 'features/LoginForm';
import { ICredentials } from 'shared/types/models';

interface IProps {
  authorizationApi: (credendtials: ICredentials) => Promise<void>;
}

const LoginPage: React.FC<IProps> = ({ authorizationApi }: IProps) => (
  <Container
    component='main'
    maxWidth='sm'
  >
    <LoginForm
      onLoginAttempt={authorizationApi}
    />
  </Container>
);

export default LoginPage;
