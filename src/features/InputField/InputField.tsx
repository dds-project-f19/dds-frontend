import React from 'react';
import TextField from '@material-ui/core/TextField';

interface IProps {
  name: string;
  [key: string]: any;
}

const InputField: React.FC<IProps> = ({
  name,
  ...otherProps
}: IProps) => (
    <TextField
      id={name}
      name={name}
      type='input'
      fullWidth
      margin='normal'
      variant='outlined'
      {...otherProps}
    />
  );

export default InputField;
