import React from 'react';

import ManagerRegistrationForm, { SubmissionStatus } from './ManagerRegistrationForm';
import { IRegisterFields } from 'shared/types/models';

interface IProps {
  onRegisterAttempt: (regFields: IRegisterFields) => Promise<void>;
}

interface IState {
  formFields: Required<IRegisterFields>;
  isWaiting: boolean;
  status: SubmissionStatus;
}

export default class ManagerRegistrationFormContainer extends React.PureComponent<IProps, IState> {
  private _isMounted: boolean = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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
    status: 'unknown',
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

    let succeed = false;

    this.setState({ isWaiting: true });

    try {
      await onRegisterAttempt(formFields);
      succeed = true;
    } catch (e) { }

    if (this._isMounted) {
      this.setState({
        isWaiting: false,
        status: succeed ? 'succeed' : 'failed',
      });
    }
  }

  render(): JSX.Element {
    const {
      state: {
        formFields,
        isWaiting,
        status,
      },
      handleFieldChange,
      handleFormSubmit,
    } = this;

    return (
      <ManagerRegistrationForm
        formFields={formFields}
        isWaiting={isWaiting}
        submissionStatus={status}
        handleFieldChange={handleFieldChange}
        handleFormSubmit={handleFormSubmit}
      />
    );
  }
}
