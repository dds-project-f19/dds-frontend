import React from 'react';

import LoginForm from './LoginForm';
import { ICredentials } from 'shared/types/models';

interface IProps {
  onLoginAttempt: (credentials: ICredentials) => Promise<void>;
}

interface IState {
  formFields: IFormFields;
  isWaiting: boolean;
}

export interface IFormFields {
  username: string;
  password: string;
}

export default class LoginFormContainer extends React.PureComponent<IProps, IState> {
  public static defaultProps = {
    onLoginAttempt: () => { },
  };

  public state: IState = {
    formFields: {
      username: '',
      password: '',
    },
    isWaiting: false,
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

  public handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      state: {
        formFields: {
          username,
          password,
        },
      },
      props: {
        onLoginAttempt
      },
    } = this;

    this.setState({ isWaiting: true });

    await onLoginAttempt({ username, password });

    this.setState({ isWaiting: false });
  }

  render(): JSX.Element {
    const {
      handleFieldChange,
      handleFormSubmit,
      state: {
        formFields,
        isWaiting,
      },
    } = this;

    return (
      <LoginForm
        formFields={formFields}
        isWaiting={isWaiting}
        handleFieldChange={handleFieldChange}
        handleFormSubmit={handleFormSubmit}
      />
    );
  }
}
