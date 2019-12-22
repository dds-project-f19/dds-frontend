import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import BuildIcon from '@material-ui/icons/Build';
import Gavel from '@material-ui/icons/Gavel';

import { CookieParser } from 'services/cookie';
import { workspacesInfo } from 'shared/workspaces';

interface IPlaceholderProps {
  placeholder: true;
}

interface ICompleteProps {
  placeholder?: false;
  itemType: string;
  isDragging: boolean;
}

type IProps = IPlaceholderProps | ICompleteProps;

const useStyles = makeStyles((theme) => ({
  itemCard: {
    width: '150px',
    height: '150px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    textAlign: 'center',
  },
  itemPicture: {
    width: '100px',
    height: '100px',
    alignSelf: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
}));

const WorkerItem: React.FC<IProps> = (props: IProps) => {
  const { types } = workspacesInfo[CookieParser.getWorkspace()];
  const classes = useStyles();

  return (
    <Card
      className={classes.itemCard}
      raised={props.placeholder ? false : props.isDragging}
    >
      {props.placeholder ? (
        'Empty :('
      ) : (
          (() => {
            const {
              itemType,
            } = props;
            const {
              description,
              pictureId,
            } = types[itemType];

            let pic;
            switch (pictureId) {
              case 'hammer': {
                pic = (
                  <Gavel className={classes.icon} />
                );
                break;
              }
              case 'wrench': {
                pic = (
                  <BuildIcon className={classes.icon} />
                );
                break;
              }
            }
            if (pic === undefined) {
              throw new Error('Unknown picture ID provided for WorkerItem');
            }

            return (
              <React.Fragment>
                <div
                  key='workeritem-picture'
                  className={classes.itemPicture}
                >
                  {pic}
                </div>
                <CardHeader
                  key='workeritem-description'
                  subheader={description}
                />
              </React.Fragment>
            );
          })()
        )}
    </Card>
  );
};

export default WorkerItem;
