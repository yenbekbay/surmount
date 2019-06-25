import {RouteComponentProps} from '@reach/router';
import {DialogModal, Modal} from 'fannypack';
import React from 'react';

interface DashboardProps extends RouteComponentProps {}

export const Dashboard: React.FC<DashboardProps> = _props => {
  return (
    <Modal.Container defaultVisible>
      {modal => (
        <DialogModal title="Dashboard" {...modal}>
          <p>Yo</p>
        </DialogModal>
      )}
    </Modal.Container>
  );
};
