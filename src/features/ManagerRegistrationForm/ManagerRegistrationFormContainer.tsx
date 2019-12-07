import React from 'react';

import ManagerRegistrationForm, { SubmissionStatus, IProps as IViewProps } from './ManagerRegistrationForm';
import { IManagerRegisterFields } from 'shared/types/models';
import { workspacesInfo } from 'shared/workspaces';

interface IProps {
  onRegisterAttempt: (regFields: IManagerRegisterFields) => Promise<void>;
}

interface IState {
  formFields: Required<IManagerRegisterFields>;
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
      gametype: Object.keys(workspacesInfo)[0], // TODO: work on default and required select
      name: '',
      surname: '',
      phone: '',
      address: '',
    },
    isWaiting: false,
    status: 'unknown',
  };

  private handleFieldChange: IViewProps['handleFieldChange'] = (event) => {
    const { formFields } = this.state;
    const {
      name,
      value,
    } = event.target;

    if (name === undefined) {
      throw new Error('Form field name is undefined');
    }

    this.setState({
      formFields: {
        ...formFields,
        [name]: value,
      },
    });
  };

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
  };

  render(): React.ReactNode {
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
