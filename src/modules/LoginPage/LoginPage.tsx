import React from 'react';
import Container from '@material-ui/core/Container';

import { LoginForm } from 'features/LoginForm';

interface IProps {
  onLoginAttempt: (login: string, password: string) => Promise<void>;
}

const LoginPage: React.FC<IProps> = ({ onLoginAttempt }: IProps) => (
  <Container
    component="main"
    maxWidth="sm"
  >
    <LoginForm
      onLoginAttempt={onLoginAttempt}
    />
  </Container>
);

export default LoginPage;
