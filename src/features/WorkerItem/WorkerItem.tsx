import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import { workspacesInfo } from 'shared/workspaces';

interface IPlaceholderProps {
  placeholder: true;
}

interface ICompleteProps {
  placeholder?: false;
  workspace: string;
  itemType: string;
  isDragging: boolean;
}

type IProps = IPlaceholderProps | ICompleteProps;

const useStyles = makeStyles((theme) => ({
  ItemCard: {
    width: '150px',
    height: '150px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    textAlign: 'center',
  },
  ItemPicture: {
    width: '100px',
    height: '100px',
    alignSelf: 'center',
  },
}));

const WorkerItem: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.ItemCard}
      raised={props.placeholder ? false : props.isDragging}
    >
      {props.placeholder ? (
        'Empty :('
      ) : (
          (() => {
            const {
              workspace,
              itemType,
            } = props;
            const { description, pic } = workspacesInfo[workspace].types[itemType];

            return (
              <React.Fragment>
                <div
                  key='workeritem-picture'
                  className={classes.ItemPicture}
                >
                  {pic()}
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
