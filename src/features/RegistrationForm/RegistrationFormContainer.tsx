import React from 'react';

import RegistrationForm from './RegistrationForm';
import { IRegisterFields } from 'shared/types/models';

interface IProps {
  onRegisterAttempt: (regFields: IRegisterFields) => Promise<void>;
  loginFormPath: string;
}

interface IState {
  formFields: Required<IRegisterFields>;
  isWaiting: boolean;
}

export default class RegistrationFormContainer extends React.PureComponent<IProps, IState> {
  public static defaultProps = {
    onRegisterAttempt: async () => { },
  };

  public state: IState = {
    formFields: {
      username: '',
      password: '',
      name: '',
      surname: '',
      phone: '',
      address: '',
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
        onRegisterAttempt,
      },
      state: {
        formFields,
      },
    } = this;

    this.setState({ isWaiting: true });

    await onRegisterAttempt(formFields);

    this.setState({ isWaiting: false });
  }

  render(): JSX.Element {
    const {
      props: {
        loginFormPath,
      },
      state: {
        formFields,
        isWaiting,
      },
      handleFieldChange,
      handleFormSubmit,
    } = this;

    return (
      <RegistrationForm
        formFields={formFields}
        isWaiting={isWaiting}
        loginFormPath={loginFormPath}
        handleFieldChange={handleFieldChange}
        handleFormSubmit={handleFormSubmit}
      />
    );
  }
}
