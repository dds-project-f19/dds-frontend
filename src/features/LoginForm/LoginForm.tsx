import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { ICredentials } from 'shared/types/models';
import { InputField } from 'features/InputField';

interface IProps {
  formFields: Required<ICredentials>;
  isWaiting: boolean;
  handleFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useStyles = makeStyles((theme) => ({
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
    username: usernameValue,
    password: passwordValue,
  },
  isWaiting,
  handleFieldChange,
  handleFormSubmit,
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
        component='h1'
        variant='h5'
      >
        {'Sign in'}
      </Typography>
      <form
        className={classes.form}
        onSubmit={handleFormSubmit}
      >
        <InputField
          name='username'
          label='Username'
          required
          autoComplete='username'
          autoFocus
          disabled={isWaiting}
          value={usernameValue}
          onChange={handleFieldChange}
        />
        <InputField
          name='password'
          label='Password'
          required
          autoComplete='current-password'
          type='password'
          disabled={isWaiting}
          value={passwordValue}
          onChange={handleFieldChange}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
        >
          {'Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
