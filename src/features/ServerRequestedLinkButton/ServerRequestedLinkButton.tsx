import React from 'react';
import Button from '@material-ui/core/Button';

interface IProps {
  link?: string;
  label: string;
}

const ServerRequestedLinkButton: React.FC<IProps> = ({
  link,
  label,
}) => {
  return (
    <Button
      href={link}
      disabled={link === undefined}
      variant='contained'
      component='a'
      target='_blank'
      rel='noopener noreferrer'
    >
      {label}
    </Button>
  );
};

export default ServerRequestedLinkButton;
