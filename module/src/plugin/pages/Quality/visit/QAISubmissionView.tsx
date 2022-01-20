import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { dateTime } from '@savantly/sprout-api';
import { css } from 'emotion';
import { Icon } from '@sprout-platform/ui';
import { Button, ButtonGroup } from 'reactstrap';
import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import React, { Fragment, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { useQAISection } from '../sections/hooks';
import { QAISectionSubmission, qaiSubmissionService } from '../submissions/entity';
import StoreVisitTabs from './StoreVisitTabs';
import '../../storevisittabs.css';

type InternalState = QAISectionSubmission | undefined;
export const QAISubmissionView = () => {
  const navigate = useNavigate();
  const storeId = useParams().storeId;
  const itemId = useParams().itemId;
  const [items, setItem] = useState(undefined as InternalState);
  const [error, setError] = useState('');
  const fmLocation = useFMLocation(items?.locationId);
  const qaiSection = useQAISection(items?.sectionId);
  if (!itemId) {
    const message = 'An itemId was not provided';
    console.error(message);
    setError(message);
  }

  useMemo(() => {
    if (!items) {
      qaiSubmissionService
        .getById(itemId)
        .then(response => {
          setItem(response.data);
        })
        .catch(err => {
          console.error(err);
          setError(err.message || 'There was a problem retrieving the submission');
        });
    }
  }, [itemId, items]);

  const getQuestionText = (questionId?: string) => {
    if (qaiSection && questionId) {
      if (qaiSection) {
        const list = qaiSection.questions.filter(q => q.itemId === questionId);
        if (list && list.length > 0) {
          return list[0].text;
        }
      }
    }
    return 'text unavailable';
  };

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
      <StoreVisitTabs
        item={tabData}
        isVisit={false}
        isTitle={`${fmLocation?.name} / ${qaiSection?.name} / ${dateTime(items?.dateScored).format('YYYY-MM-DD')}`}
      />
      {error && <Alert color="warning">{error}</Alert>}
      {items && qaiSection && (
        <div className="questionAnswerpadding">
          <h4>Location: {fmLocation?.name}</h4>
          <h4>Section: {qaiSection.name}</h4>
          <h4>Date Scored: {dateTime(items.dateScored).format('dd YYYY-MM-DD hh:mm A')}</h4>
          <hr />
          <div className="mb-2">
            <h5>Details</h5>
            {items.staffAttendance && (
              <div>
                <label className="mr-2">Staff Attendance Log: </label>
                <span>
                  {Object.keys(items.staffAttendance).map(o => (
                    <Fragment>
                      <i>{o}</i>
                      {items.staffAttendance && items.staffAttendance[o]}
                    </Fragment>
                  ))}
                </span>
              </div>
            )}

            <div>
              <label className="mr-2">Questions: </label>
              <table className="table table-sm">
                <tbody>
                  {items.answers &&
                    items.answers.map(c => (
                      <Fragment>
                        <tr className="d-flex">
                          <td className="col-5">{getQuestionText(c.questionId)}</td>
                          <td className="col-2">{c.value}</td>
                          <td className="col-5">{c.notes}</td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-12 d-flex">
                            {c.attachments.map(attachment => (
                              <div className="col-4">
                                <div
                                  className={css`
                                    text-align: center;
                                  `}
                                >
                                  <a href={attachment.downloadUrl}>Download</a>
                                </div>
                                <img src={attachment.downloadUrl} width="100%" />
                              </div>
                            ))}
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                </tbody>
              </table>
            </div>
            <div>
              <label className="mr-2">Guest Questions: </label>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Question</Th>
                    {items.guestAnswers && items.guestAnswers.map((_, index) => <Th>Guest {index + 1}</Th>)}
                  </Tr>
                </Thead>
                <Tbody>
                  {qaiSection.guestQuestions.map(q => (
                    <Tr>
                      <Td>{q.text}</Td>
                      {items.guestAnswers &&
                        items.guestAnswers.map(({ answers }) => (
                          <Td>{answers.find(({ guestQuestionId }) => guestQuestionId === q.itemId)?.value}</Td>
                        ))}
                    </Tr>
                  ))}
                  <Tr>
                    <Td>Notes</Td>
                    {items.guestAnswers && items.guestAnswers.map(({ notes }) => <Td>{notes}</Td>)}
                  </Tr>
                </Tbody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

// export default QAISubmissionView;
