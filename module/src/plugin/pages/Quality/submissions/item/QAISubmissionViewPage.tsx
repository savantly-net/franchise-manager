import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { dateTime } from '@savantly/sprout-api';
import { css } from 'emotion';
import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import React, { Fragment, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { QAISectionSubmission, qaiSubmissionService } from '../entity';
import '../styles.css';
import { AppModuleRootState } from 'plugin/types';
import { useDispatch, useSelector } from 'react-redux';
import { qaiSectionStateProvider } from '../../sections/entity';
import { LoadingIcon } from '@sprout-platform/ui';

type InternalState = QAISectionSubmission | undefined;
const QAISubmissionViewPage = () => {
  const dispatch = useDispatch();

  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);

  const itemId = useParams().itemId;
  const [item, setItem] = useState(undefined as InternalState);
  const [error, setError] = useState('');
  let [yesCount, setYesCount] = useState(0);
  let [noCount, setNoCount] = useState(0);
  let [questionYesCount, setQuestionYesCount] = useState(0);
  let [questionNoCount, setQuestionNoCount] = useState(0);
  let [sectionList, setSectionList] = useState<any>();

  const fmLocation = useFMLocation(item?.locationId);

  if (!itemId) {
    const message = 'An itemId was not provided';
    console.error(message);
    setError(message);
  }

  useMemo(() => {
    if (!sectionState.isFetched && !sectionState.isFetching) {
      dispatch(qaiSectionStateProvider.loadState());
    }

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
    }
    if (sectionState?.response) {
      setSectionList(sectionState?.response);
    }
  }, [itemId, dispatch, item, sectionState]);

  const showLoading = sectionState.isFetching;

  const getSection = (sectionId: string) => {
    const searchSection: any = sectionList.find((temp: any) => temp.itemId === sectionId);
    return searchSection?.name ? searchSection?.name : 'Unknown Section';
  };

  const getQuestionText = (questionId: string, sectionId: string) => {
    const searchSection: any = sectionList.find((temp: any) => temp.itemId === sectionId);
    const searchQuestion: any = searchSection.questions.find((temp: any) => temp.itemId === questionId);
    return searchQuestion?.text ? searchQuestion?.text : 'NA';
  };

  useMemo(() => {
    if (item?.sections) {
      let staticNo = 0;
      let statcYes = 0;
      let gqNo = 0;
      let gqYes = 0;
      item?.sections.map((s: any) => {
        s?.guestAnswers.map((Qanswer: any) => {
          Qanswer.answers.map((Questquestion: any) => {
            if (Questquestion.value === 'YES') {
              gqYes = gqYes + 1;
            } else {
              gqNo = gqNo + 1;
            }
          });
        });
        s?.answers.map((question: any) => {
          if (question.value === 'YES') {
            statcYes = statcYes + 1;
          } else {
            staticNo = staticNo + 1;
          }
        });
        setYesCount(gqYes);
        setNoCount(gqNo);
        setQuestionYesCount(statcYes);
        setQuestionNoCount(staticNo);
      });
    }
  }, [item]);

  return (
    <Fragment>
      <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
      {error && <Alert color="warning">{error}</Alert>}
      {item && sectionList && (
        <div>
          <h4 className="mb-3">Location: {fmLocation?.name}</h4>
          <h4 className="mb-3">fsc: {item?.fsc}</h4>
          <h4 className="mb-3">Manager On Duty: {item?.managerOnDuty}</h4>
          <h4 className="mb-3">Reponsibility Alcohol Certificate for Mgr/Bar staff: {item?.responsibleAlcoholCert}</h4>
          <h4 className="mb-3">Date Scored: {dateTime(item.dateScored).format('dd YYYY-MM-DD hh:mm A')}</h4>
          <hr />
          <div className="mb-2">
            <h5 className="mb-2">Details</h5>
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
              {item?.sections &&
                item?.sections.map((s: any, index: number) => (
                  <>
                    <div className="mb-3 col-12">
                      <h1 className="section-name">
                        Section {index + 1}: {getSection(s?.sectionId)}
                        {s?.name}
                      </h1>
                      <Fragment>
                        {s?.answers &&
                          s?.answers.map((question: any, idx: number) => (
                            <>
                              <Table style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }} className="table-count">
                                <Tbody>
                                  <Fragment>
                                    <Tr>
                                      <Td className="col-5">{getQuestionText(question.questionId, s.sectionId)} </Td>
                                      <Td className="col-4">{question.notes}</Td>
                                      <Td className="col-2 ">
                                        <Fragment>{question.value}</Fragment>
                                      </Td>
                                    </Tr>
                                  </Fragment>
                                </Tbody>
                              </Table>
                            </>
                          ))}
                      </Fragment>

                      <h1 className="category-name">Guest Question</h1>
                      <Table style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }} className="table-count">
                        {s?.guestAnswers && Object.keys(s?.guestAnswers).length > 0 && (
                          <Thead>
                            <Tr className="trCls">
                              <Th className="col-4">Question</Th>
                              <Th className="col-2">Quest 1</Th>
                              <Th className="col-2">Quest 2</Th>
                              <Th className="col-2">Quest 3</Th>
                            </Tr>
                          </Thead>
                        )}
                        <Tbody>
                          <Fragment>
                            {s?.guestAnswers &&
                              s?.guestAnswers.map((Qanswer: any, idGusts: number) => (
                                <>
                                  <Fragment>
                                    <Tr>
                                      <Td className="col-3">{Qanswer.notes}</Td>
                                      {Qanswer?.answers &&
                                        Qanswer.answers.map((Questquestion: any, idGust: number) => (
                                          <>
                                            <Td className="col-2 ">
                                              <Fragment>{Questquestion.value}</Fragment>
                                            </Td>
                                          </>
                                        ))}
                                    </Tr>
                                  </Fragment>
                                </>
                              ))}
                            {s?.guestAnswers && Object.keys(s?.guestAnswers).length === 0 && (
                              <Tr className="trCls">
                                <Td className="col-12">Not available</Td>
                              </Tr>
                            )}
                          </Fragment>
                        </Tbody>
                      </Table>
                    </div>
                    <br />
                  </>
                ))}
            </div>
            <div>
              <label className="mr-2">Questions: </label>
              <Table className="table table-sm">
                <Tbody>
                  {item.answers &&
                    item.answers.map(c => (
                      <Fragment>
                        <Tr className="d-flex">
                          <Td className="col-2">{c.value}</Td>
                          <Td className="col-5">{c.notes}</Td>
                        </Tr>
                        <Tr className="d-flex">
                          <Td className="col-12 d-flex">
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
                          </Td>
                        </Tr>
                      </Fragment>
                    ))}
                </Tbody>
              </Table>
            </div>
            {/* <div>
              <label className="mr-2">Guest Questions: </label>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Question</Th>
                    {item.guestAnswers && item.guestAnswers.map((_, index) => <Th>Guest {index + 1}</Th>)}
                  </Tr>
                </Thead>
                <Tbody>
                  {{qaiSection.guestQuestions.map(q => (
                    <Tr>
                      <Td>{q.text}</Td>
                      {item.guestAnswers &&
                        item.guestAnswers.map(({ answers }) => (
                          <Td>{answers.find(({ guestQuestionId }) => guestQuestionId === q.itemId)?.value}</Td>
                        ))}
                    </Tr>
                  ))} 
                  <Tr>
                    <Td>Notes</Td>
                    {item.guestAnswers && item.guestAnswers.map(({ notes }) => <Td>{notes}</Td>)}
                  </Tr>
                </Tbody>
              </Table>
            </div> */}
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
