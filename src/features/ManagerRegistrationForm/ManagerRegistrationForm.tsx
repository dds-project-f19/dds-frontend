import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListAltOutlined from '@material-ui/icons/ListAltOutlined';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import { IManagerRegisterFields } from 'shared/types/models';
import { InputField } from 'features/InputField';
import { workspacesInfo } from 'shared/workspaces';

export type SubmissionStatus = 'unknown' | 'succeed' | 'failed';

export interface IProps {
  formFields: Required<IManagerRegisterFields>;
  isWaiting: boolean;
  submissionStatus: SubmissionStatus;
  handleFieldChange: (e: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function getWorkspaces(): string[] {
  return Object.keys(workspacesInfo);
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

const ManagerRegistrationForm: React.FC<IProps> = ({
  formFields: {
    username: usernameValue,
    password: passwordValue,
    gametype: gameTypeValue,
    name: nameValue,
    surname: surnameValue,
    phone: phoneValue,
    address: addressValue,
  },
  isWaiting,
  submissionStatus, // TODO: message on success/failure
  handleFieldChange,
  handleFormSubmit,
}) => {
  const classes = useStyles();

  const inputLabel = React.useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

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
        {'Manager sign up'}
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
        <FormControl
          variant='outlined'
          margin='normal'
          fullWidth
          required
        >
          <InputLabel
            ref={inputLabel}
            id='demo-simple-select-outlined-label'
          >
            {'Game type'}
          </InputLabel>
          <Select
            labelId='demo-simple-select-outlined-label'
            id='demo-simple-select-outlined'
            name='gametype'
            value={gameTypeValue}
            onChange={handleFieldChange}
            labelWidth={labelWidth}
          >
            {getWorkspaces().map((workspaceName) => (
              <MenuItem value={workspaceName}>{workspaceName}</MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default ManagerRegistrationForm;
