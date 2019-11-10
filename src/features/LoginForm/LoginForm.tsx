import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { IFormFields } from './LoginFormContainer';
import { LoginFormInput } from './_Input';

interface IProps {
  formFields: IFormFields;
  isWaiting: boolean;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pictogram: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginForm: React.FC<IProps> = ({
  formFields: {
    login: loginValue,
    password: passwordValue,
  },
  isWaiting,
  handleFormSubmit,
  handleFieldChange,
}: IProps) => {
  const classes = useStyles();

  return (
    <div
      className={classes.paper}
    >
      <Avatar className={classes.pictogram}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography
        component="h1"
        variant="h5"
      >
        {'Sign in'}
      </Typography>
      <form
        className={classes.form}
        onSubmit={handleFormSubmit}
      >
        <LoginFormInput
          name="login"
          label="Login"
          required
          autoComplete="username"
          autoFocus
          disabled={isWaiting}
          value={loginValue}
          onChange={handleFieldChange}
        />
        <LoginFormInput
          name="password"
          label="Password"
          required
          autoComplete="current-password"
          type="password"
          disabled={isWaiting}
          value={passwordValue}
          onChange={handleFieldChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {'Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
