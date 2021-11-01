import { dateTime } from '@savantly/sprout-api';
import { getUserContextService } from '@savantly/sprout-runtime';
import { ColumnDescription, Icon } from '@sprout-platform/ui';
import { useFMLocations } from 'plugin/pages/Locations/Stores/hooks';
import { AppModuleRootState } from 'plugin/types';
import React, { useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
import { useQAISections } from '../sections/hooks';
import { QAISectionSubmission as EntityClass, qaiSubmissionStateProvider } from './entity';

const IndexPage = () => {
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const qaiSections = useQAISections();
  const fmLocations = useFMLocations();
  const userContext = getUserContextService().getUserContext();

  useMemo(() => {
    if (!submissionState.isFetched && !submissionState.isFetching) {
      dispatch(qaiSubmissionStateProvider.loadState());
    }
  }, [submissionState, dispatch]);

  const userIsQAIAdmin = userContext && userContext.user && userContext.user.authorities.includes('QAI_ADMIN');

  const getSection = (sectionId?: string) => {
    if (qaiSections && sectionId) {
      const found = qaiSections.filter(s => s.itemId === sectionId);
      if (found) {
        return found[0];
      }
    }
    return undefined;
  };

  const getLocation = (locationId?: string) => {
    if (fmLocations && locationId) {
      const found = fmLocations.filter(s => s.id === locationId);
      if (found) {
        return found[0];
      }
    }
    return undefined;
  };

  const columns: Array<ColumnDescription<EntityClass>> = [
    {
      dataField: 'locationId',
      text: 'Location',
      sort: true,
      formatter: (cell, row) => {
        const location = getLocation(row.locationId);
        return <span>{location?.name}</span>;
      },
      isDummyField: true,
    },
    {
      dataField: 'sectionId',
      text: 'Section',
      sort: true,
      formatter: (cell, row) => {
        const section = getSection(row.sectionId);
        return <span>{section?.name}</span>;
      },
      isDummyField: true,
    },
    {
      dataField: 'dateScored',
      text: 'Date Scored',
      sort: true,
      formatter: (cell, row) => {
        return dateTime(row.dateScored).format('dd YYYY-MM-DD hh:mm A');
      },
    },
    {
      dataField: 'actions',
      text: 'Actions',
      formatter: (cell, row) => {
        return (
          <ButtonGroup>
            <Button
              color="info"
              onClick={() => {
                navigate(`../item/${row.itemId}`);
              }}
            >
              <Icon name="eye" />
            </Button>
            <Button
              color="warning"
              onClick={() => {
                navigate(`../item/${row.itemId}/edit`);
              }}
            >
              <Icon name="pen" />
            </Button>
            <Button
              color="danger"
              onClick={() => {
                navigate(`../item/${row.itemId}/delete`);
              }}
              disabled={!userIsQAIAdmin}
            >
              <Icon name="trash" />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];

  return (
    <BootstrapTable columns={columns} data={submissionState.response?.content || []} keyField="itemId" striped={true} />
  );
};

export default IndexPage;
