import React from 'react';
import logo from './pic/logo.svg';
import './LoginPage.css';

interface IProps {
  pingContent: string;
  pingServer: () => void;
}

const LoginPage: React.FC<IProps> = ({ pingContent, pingServer }: IProps) => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/LoginPage.tsx</code> and save to reload.
      </p>
      <div>
        {pingContent}
      </div>
      <button onClick={pingServer}>
        {'PING'}
      </button>
    </header>
  </div>
);

export default LoginPage;
