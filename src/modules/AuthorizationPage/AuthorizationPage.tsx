import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import { LoginForm } from 'features/LoginForm';
import { RegistrationForm } from 'features/RegistrationForm';
import { ICredentials, IRegisterFields } from 'shared/types/models';

interface IProps {
  onSuccessRedirectPath: string;
  authorizationApi: (credendtials: ICredentials) => Promise<void>;
  registrationApi: (regFields: IRegisterFields) => Promise<void>;
}

const AuthorizationPage: React.FC<IProps> = ({
  onSuccessRedirectPath,
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
            onSuccessRedirectPath={onSuccessRedirectPath}
          />
        </Route>
        <Route path={regFormPath}>
          <RegistrationForm
            onRegisterAttempt={registrationApi}
            loginFormPath={loginFormPath}
            onSuccessRedirectPath={onSuccessRedirectPath}
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
