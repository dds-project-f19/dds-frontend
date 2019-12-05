import React from 'react';
import { Redirect } from 'react-router-dom';

import LoginForm from './LoginForm';
import { ICredentials } from 'shared/types/models';

interface IProps {
  onLoginAttempt: (credentials: ICredentials) => Promise<void>;
  onSuccess: () => string;
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

    let succeed: boolean = false;
    try {
      await onLoginAttempt(formFields);
      succeed = true;
    } catch (e) { }

    if (this._isMounted) {
      this.setState({
        toRedirect: succeed,
        isWaiting: false,
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
      <LoginForm
        formFields={formFields}
        isWaiting={isWaiting}
        handleFieldChange={handleFieldChange}
        handleFormSubmit={handleFormSubmit}
      />
    );
  }
}
