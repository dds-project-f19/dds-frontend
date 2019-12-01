import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import { LoginForm } from 'features/LoginForm';
import { RegistrationForm } from 'features/RegistrationForm';
import { ICredentials, IRegisterFields } from 'shared/types/models';

interface IProps {
  onSuccess: () => string;
  authorizationApi: (credendtials: ICredentials) => Promise<void>;
  registrationApi: (regFields: IRegisterFields) => Promise<void>;
}

const AuthorizationPage: React.FC<IProps> = ({
  onSuccess,
  authorizationApi,
  registrationApi,
}: IProps) => {
  const { path: matchPath } = useRouteMatch() || {};

  const loginFormPath = `${matchPath}/in`;
  const regFormPath = `${matchPath}/up`;

  return (
    <Container
      component='main'
      maxWidth='sm'
    >
      <Switch>
        <Route path={loginFormPath}>
          <LoginForm
            onLoginAttempt={authorizationApi}
            regFormPath={regFormPath}
            onSuccess={onSuccess}
          />
        </Route>
        <Route path={regFormPath}>
          <RegistrationForm
            onRegisterAttempt={registrationApi}
            loginFormPath={loginFormPath}
            onSuccess={onSuccess}
          />
        </Route>
        <Route exact path={matchPath}>
          <Redirect to={loginFormPath} />
        </Route>
      </Switch>
    </Container>
  );
};

export default AuthorizationPage;
