import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { dateTime } from '@savantly/sprout-api';
import { css } from 'emotion';
import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import React, { Fragment, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { useQAISection } from '../../sections/hooks';
import { QAISectionSubmission, qaiSubmissionService } from '../entity';
import '../styles.css';

type InternalState = QAISectionSubmission | undefined;
const QAISubmissionViewPage = () => {
  const itemId = useParams().itemId;
  const [item, setItem] = useState(undefined as InternalState);
  const [error, setError] = useState('');
  let [yesCount, setYesCount] = useState(0);
  let [noCount, setNoCount] = useState(0);
  let [questionYesCount, setQuestionYesCount] = useState(0);
  let [questionNoCount, setQuestionNoCount] = useState(0);

  const fmLocation = useFMLocation(item?.locationId);
  const qaiSection = useQAISection(item?.sectionId);

  if (!itemId) {
    const message = 'An itemId was not provided';
    console.error(message);
    setError(message);
  }

  useMemo(() => {
    if (!item) {
      qaiSubmissionService
        .getById(itemId)
        .then(response => {
          setItem(response.data);
        })
        .catch(err => {
          console.error(err);
          setError(err.message || 'There was a problem retrieving the submission');
        });
    } else {
      // if (Object.keys(item?.guestAnswers).length > 0) {
      //   let gqNo = 0;
      //   let gqYes = 0;
      //   for (const guestMainAns of item?.guestAnswers) {
      //     for (const subAnswer of guestMainAns.answers) {
      //       if (subAnswer.value === 'YES') {
      //         gqYes = gqYes + 1;
      //       } else {
      //         gqNo = gqNo + 1;
      //       }
      //     }
      //   }
      //   setYesCount(gqYes);
      //   setNoCount(gqNo);
      // }
      // if (Object.keys(item?.answers).length > 0) {
      //   let answersValue: any = item?.answers.map(x => x.value);
      //   if (answersValue !== undefined) {
      //     let staticNo = 0;
      //     let statcYes = 0;
      //     for (const guestAns of answersValue) {
      //       if (guestAns === 'YES') {
      //         statcYes = statcYes + 1;
      //       } else {
      //         staticNo = staticNo + 1;
      //       }
      //     }
      //     setQuestionYesCount(statcYes);
      //     setQuestionNoCount(staticNo);
      //   }
      // }

      setYesCount(0);
      setNoCount(0);
      setQuestionYesCount(0);
      setQuestionNoCount(0);
      console.log('item.guestAnswers', item);
    }
  }, [itemId, item]);

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
  return (
    <Fragment>
      {error && <Alert color="warning">{error}</Alert>}
      {item && qaiSection && (
        <div>
          <h4>Location: {fmLocation?.name}</h4>
          <h4>Section: {qaiSection.name}</h4>
          <h4>Date Scored: {dateTime(item.dateScored).format('dd YYYY-MM-DD hh:mm A')}</h4>
          <hr />
          <div className="mb-2">
            <h5>Details</h5>
            {item.staffAttendance && (
              <div>
                <label className="mr-2">Staff Attendance Log: </label>
                <span>
                  {Object.keys(item.staffAttendance).map(o => (
                    <Fragment>
                      <i>{o}</i>
                      {item.staffAttendance && item.staffAttendance[o]}
                    </Fragment>
                  ))}
                </span>
              </div>
            )}

            <div>
              <label className="mr-2">Questions: </label>
              <table className="table table-sm">
                <tbody>
                  {item.answers &&
                    item.answers.map(c => (
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
                    {item.guestAnswers && item.guestAnswers.map((_, index) => <Th>Guest {index + 1}</Th>)}
                  </Tr>
                </Thead>
                <Tbody>
                  {/* {qaiSection.guestQuestions.map(q => (
                    <Tr>
                      <Td>{q.text}</Td>
                      {item.guestAnswers &&
                        item.guestAnswers.map(({ answers }) => (
                          <Td>{answers.find(({ guestQuestionId }) => guestQuestionId === q.itemId)?.value}</Td>
                        ))}
                    </Tr>
                  ))} */}
                  <Tr>
                    <Td>Notes</Td>
                    {item.guestAnswers && item.guestAnswers.map(({ notes }) => <Td>{notes}</Td>)}
                  </Tr>
                </Tbody>
              </Table>
            </div>
            <div className="mt-1">
              <Table style={{ marginTop: '50px', border: '1px solid #D0D7DE;' }} mt="4" className="table-count">
                <Thead>
                  <Tr className="Tr-cusTom">
                    <Th>QuesTion</Th>
                    <Th>Yes</Th>
                    <Th>No</Th>
                  </Tr>
                </Thead>
                <Tbody
                  className={css`
                    border: 1px solid #d0d7de;
                  `}
                >
                  <Tr>
                    <Td>Questions</Td>
                    <Td>{questionYesCount}</Td>
                    <Td>{questionNoCount}</Td>
                  </Tr>
                  <Tr>
                    <Td>Guest Questions</Td>
                    <Td>{yesCount}</Td>
                    <Td>{noCount}</Td>
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

export default QAISubmissionViewPage;
