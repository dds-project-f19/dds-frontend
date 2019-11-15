import React from 'react';
import { Redirect } from 'react-router-dom';

import LoginForm from './LoginForm';
import { ICredentials } from 'shared/types/models';

interface IProps {
  onLoginAttempt: (credentials: ICredentials) => Promise<void>;
  regFormPath: string;
  onSuccessRedirectPath: string;
}

interface IState {
  formFields: Required<ICredentials>;
  isWaiting: boolean;
  toRedirect: boolean;
}

export default class LoginFormContainer extends React.PureComponent<IProps, IState> {
  public static defaultProps = {
    onLoginAttempt: async () => { },
  };

  public state: IState = {
    formFields: {
      username: '',
      password: '',
    },
    isWaiting: false,
    toRedirect: false,
  };

  private handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formFields } = this.state;
    const {
      name,
      value,
    } = e.target;

    this.setState({
      formFields: {
        ...formFields,
        [name]: value,
      },
    });
  }

  private handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      props: {
        onLoginAttempt,
      },
      state: {
        formFields,
      },
    } = this;

    this.setState({ isWaiting: true });

    try {
      await onLoginAttempt(formFields);
      this.setState({ toRedirect: true });
    } catch (e) {
      this.setState({
        isWaiting: false,
        /* TODO: error message */
      });
    }
  }

  render(): JSX.Element {
    const {
      props: {
        regFormPath,
        onSuccessRedirectPath,
      },
      state: {
        formFields,
        isWaiting,
        toRedirect,
      },
      handleFieldChange,
      handleFormSubmit,
    } = this;

    if (toRedirect) {
      return (
        <Redirect to={onSuccessRedirectPath} />
      );
    }

    return (
      <LoginForm
        formFields={formFields}
        isWaiting={isWaiting}
        regFormPath={regFormPath}
        handleFieldChange={handleFieldChange}
        handleFormSubmit={handleFormSubmit}
      />
    );
  }
}
