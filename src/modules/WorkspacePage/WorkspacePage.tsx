import React from 'react';
import Container from '@material-ui/core/Container';

interface IProps { }

const WorkspacePage: React.FC<IProps> = () => {
  return (
    <Container
      component='main'
      maxWidth='xl'
    >
      <div>
        {'Workspace is under construction! Keep patience :)'}
      </div>
    </Container>
  );
};

export default WorkspacePage;
