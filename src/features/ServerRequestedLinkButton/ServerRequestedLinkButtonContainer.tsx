import React from 'react';

import ServerRequestedLinkButton from './ServerRequestedLinkButton';

interface IProps {
  getLinkApi: () => Promise<string>;
  label: string;
}

interface IState {
  link?: string;
}

export default class ServerRequestedLinkButtonContainer extends React.PureComponent<IProps, IState> {
  public state: IState = {
    link: undefined,
  };

  private _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    this.requestLink();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  private requestLink: () => Promise<void> = async () => {
    const { getLinkApi } = this.props;

    const link = await getLinkApi();

    if (this._isMounted) {
      this.setState({
        link,
      });
    }
  };

  render(): React.ReactNode {
    const {
      props: {
        label,
      },
      state: {
        link,
      }
    } = this;

    return (
      <ServerRequestedLinkButton
        link={link}
        label={label}
      />
    );
  }
}
