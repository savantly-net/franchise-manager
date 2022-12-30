import { dateTime } from '@savantly/sprout-api';
import { getUserContextService } from '@savantly/sprout-runtime';
import { ColumnDescription, ConfirmModal, Icon, LoadingIcon } from '@sprout-platform/ui';
import { useFMLocations } from 'plugin/pages/Locations/Stores/hooks';
import { AppModuleRootState } from 'plugin/types';
import React, { useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
import { useQASections } from '../sections/hooks';
import { qaService, QASubmission as EntityClass, qaSubmissionStateProvider, QASubmissionSummary } from './entity';

const IndexPage = () => {
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaSubmissions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const qaSections = useQASections();
  const fmLocations = useFMLocations();
  const userContext = getUserContextService().getUserContext();
  const [data, setData] = useState<QASubmissionSummary[] | undefined>();

  useMemo(() => {
    if (!submissionState.isFetched && !submissionState.isFetching) {
      dispatch(qaSubmissionStateProvider.loadState());
    } else if (submissionState.isFetched && data === undefined) {
      setData(submissionState.response?.content || []);
    }
  }, [submissionState, data, setData, dispatch]);

  const userIsQAIAdmin = userContext && userContext.user && userContext.user.authorities.includes('FM_QAI_ADMIN');

  const showLoading = !qaSections || !fmLocations;

  const [open, setOpen] = useState(false);
  const [confirmVal, setConfirmVal] = useState('');

  const deleteHandle = (itemId: any) => {
    setConfirmVal(itemId);
    setOpen(!open);
  };

  const confirmHandle = () => {
    if (confirmVal) {
      qaService.deleteQASubmission(confirmVal).then(() => {
        dispatch(qaSubmissionStateProvider.loadState());
      });
    }
    setOpen(!open);
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
      dataField: 'fsc',
      text: 'FSC',
      sort: true,
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
            <Button color="danger" onClick={() => deleteHandle(row?.id)} disabled={!userIsQAIAdmin}>
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
    <>
      <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
      {!showLoading ? (
        <>
          <BootstrapTable
            defaultSorted={[{dataField: 'dateScored', order: 'desc'}]}
            columns={columns}
            data={qaSections && qaSections.length && fmLocations.length ? data || [] : []}
            keyField="id"
            striped={true}
          />
          {open && (
            <ConfirmModal
              onClose={() => setOpen(!open)}
              message={'Are you sure?'}
              title={'Warning!'}
              size={'md'}
              buttonsComponent={() => (
                <>
                  <Button onClick={() => setOpen(!open)}>Cancel</Button>
                  <Button color="danger" onClick={confirmHandle}>
                    Ok
                  </Button>
                </>
              )}
            />
          )}
        </>
      ) : (
        'No Record available'
      )}
    </>
  );
};

export default IndexPage;
