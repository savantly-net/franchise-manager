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
import { useQASections } from '../sections/hooks';
import { QASubmission as EntityClass, qaSubmissionStateProvider } from './entity';

const IndexPage = () => {
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaSubmissions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const qaSections = useQASections();
  const fmLocations = useFMLocations();
  const userContext = getUserContextService().getUserContext();

  useMemo(() => {
    if (!submissionState.isFetched && !submissionState.isFetching) {
      dispatch(qaSubmissionStateProvider.loadState());
    }
  }, [submissionState, dispatch]);

  const userIsQAIAdmin = userContext && userContext.user && userContext.user.authorities.includes('QAI_ADMIN');

  const getSection = (section?: any) => {
    if (qaSections && qaSections.length && section) {
      let found: any;
      let sectionNames: any = [];
      section.map((resp: any, index: any) => {
        found = qaSections.filter(s => s.itemId === resp.sectionId);
        sectionNames.push(found[0]?.name);
      });
      if (sectionNames.length) {
        return sectionNames.toString();
      }
    }
    return '';
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
        const section = getSection(row.sections);
        return <span>{section}</span>;
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
                navigate(`../item/${row.id}`);
              }}
            >
              <Icon name="eye" />
            </Button>
            <Button
              color="warning"
              onClick={() => {
                navigate(`../item/${row.id}/edit`);
              }}
            >
              <Icon name="pen" />
            </Button>
            <Button
              color="danger"
              onClick={() => {
                navigate(`../item/${row.id}/delete`);
              }}
              disabled={!userIsQAIAdmin}
            >
              <Icon name="trash" />
            </Button>
            <Button
              color="info"
              onClick={() => {
                navigate(`../${row.id}/score`);
              }}
              title="score card"
            >
              <Icon name="clipboard-list" />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];

  return (
    <BootstrapTable
      columns={columns}
      data={qaSections && qaSections.length && fmLocations.length ? submissionState.response?.content || [] : []}
      keyField="id"
      striped={true}
    />
  );
};

export default IndexPage;