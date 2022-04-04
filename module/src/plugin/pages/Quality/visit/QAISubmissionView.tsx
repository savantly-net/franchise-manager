import { Icon } from '@sprout-platform/ui';
import React, { Fragment, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, ButtonGroup } from 'reactstrap';
import '../../storevisittabs.css';
import StoreVisitTabs from './StoreVisitTabs';

export const QAISubmissionView = () => {
  const navigate = useNavigate();
  const storeId = useParams().storeId;
  const itemId = useParams().itemId;
  const [error, setError] = useState('');
  if (!itemId) {
    const message = 'An itemId was not provided';
    console.error(message);
    setError(message);
  }

  let tabData = {
    itemId: storeId,
    sectionSubmissionId: itemId,
  };
  return (
    <Fragment>
      <ButtonGroup className="buttonPostion">
        <Button
          color="warning"
          onClick={() => {
            navigate(`../../../item/${storeId}/edit`);
          }}
          className="ml-1"
        >
          <span style={{ marginRight: '4px' }}>
            <Icon name="pen" />
          </span>
          Edit
        </Button>{' '}
        <Button
          style={{ marginLeft: '4px' }}
          color="info"
          onClick={() => {
            navigate(`../../../`);
          }}
          className="active ml-1"
        >
          Back to list
        </Button>
      </ButtonGroup>
      <StoreVisitTabs item={tabData} isVisit={false} isTitle={`TODO`} />
      {error && <Alert color="warning">{error}</Alert>}
    </Fragment>
  );
};

// export default QAISubmissionView;
