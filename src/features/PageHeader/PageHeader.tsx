import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

interface IProps {
  pageTitle: string;
  tabs: string[];
  tabIndex: number;
  handleTabIndexChange: (event: React.ChangeEvent<{}>, newTabIndex: number) => void;
  onLogOut: () => void;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTitle: {
    margin: theme.spacing(1),
  },
  logOutButton: {},
}));

const PageHeader: React.FC<IProps> = ({
  pageTitle,
  tabs,
  tabIndex,
  handleTabIndexChange,
  onLogOut,
}) => {
  const classes = useStyles();

  return (
    <AppBar
      position='static'
      className={classes.appBar}
    >
      <Typography
        variant='h5'
        className={classes.pageTitle}
      >
        {pageTitle}
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabIndexChange}>
        {tabs.map((tabTitle, index) => (<Tab key={index} label={tabTitle} />))}
      </Tabs>
      <Button
        onClick={onLogOut}
        className={classes.logOutButton}
      >
        {'Log out'}
      </Button>
    </AppBar>
  );
};

export default PageHeader;
