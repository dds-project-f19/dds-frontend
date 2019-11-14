import React from 'react';

import LoginForm from './LoginForm';
import { ICredentials } from 'shared/types/models';

interface IProps {
  onLoginAttempt: (credentials: ICredentials) => Promise<void>;
  regFormPath: string;
}

interface IState {
  formFields: Required<ICredentials>;
  isWaiting: boolean;
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

    await onLoginAttempt(formFields);

    this.setState({ isWaiting: false });
  }

  render(): JSX.Element {
    const {
      props: {
        regFormPath,
      },
      state: {
        formFields,
        isWaiting,
      },
      handleFieldChange,
      handleFormSubmit,
    } = this;

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
