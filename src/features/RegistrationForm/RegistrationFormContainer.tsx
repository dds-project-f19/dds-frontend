import React from 'react';
import { Redirect } from 'react-router-dom';

import RegistrationForm from './RegistrationForm';
import { IRegisterFields } from 'shared/types/models';

interface IProps {
  onRegisterAttempt: (regFields: IRegisterFields) => Promise<void>;
  onSuccess: () => string;
}

interface IState {
  formFields: Required<IRegisterFields>;
  isWaiting: boolean;
  toRedirect: boolean;
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
        onRegisterAttempt,
      },
      state: {
        formFields,
      },
    } = this;

    this.setState({ isWaiting: true });

    try {
      await onRegisterAttempt(formFields);
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
        onSuccess,
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
        <Redirect to={onSuccess()} />
      );
    }

    return (
      <RegistrationForm
        formFields={formFields}
        isWaiting={isWaiting}
        handleFieldChange={handleFieldChange}
        handleFormSubmit={handleFormSubmit}
      />
    );
  }
}
