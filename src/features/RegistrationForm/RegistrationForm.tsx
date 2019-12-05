import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MaterialLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import ListAltOutlined from '@material-ui/icons/ListAltOutlined';

import { IRegisterFields } from 'shared/types/models';
import { InputField } from 'features/InputField';

interface IProps {
  formFields: Required<IRegisterFields>;
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

const RegistrationForm: React.FC<IProps> = ({
  formFields: {
    username: usernameValue,
    password: passwordValue,
    name: nameValue,
    surname: surnameValue,
    phone: phoneValue,
    address: addressValue,
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
        <ListAltOutlined />
      </Avatar>
      <Typography
        component='h1'
        variant='h5'
      >
        {'Sign up'}
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
          autoComplete='new-password'
          type='password'
          disabled={isWaiting}
          value={passwordValue}
          onChange={handleFieldChange}
        />
        <InputField
          name='name'
          label='Name'
          autoComplete='given-name'
          disabled={isWaiting}
          value={nameValue}
          onChange={handleFieldChange}
        />
        <InputField
          name='surname'
          label='Surname'
          autoComplete='family-name'
          disabled={isWaiting}
          value={surnameValue}
          onChange={handleFieldChange}
        />
        <InputField
          name='phone'
          label='Phone number'
          autoComplete='tel'
          type='tel'
          disabled={isWaiting}
          value={phoneValue}
          onChange={handleFieldChange}
        />
        <InputField
          name='address'
          label='Address'
          autoComplete='street-address'
          disabled={isWaiting}
          value={addressValue}
          onChange={handleFieldChange}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
        >
          {'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
