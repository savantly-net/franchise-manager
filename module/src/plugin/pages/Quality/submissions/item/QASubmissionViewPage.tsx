import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { dateTime } from '@savantly/sprout-api';
import { LoadingIcon } from '@sprout-platform/ui';
import { css } from 'emotion';
import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { QASection, qaSectionStateProvider } from '../../sections/entity';
import {
  QAGuestQuestionAnswer,
  QAGuestQuestionAnswerGroup,
  QAQuestionAnswer,
  QASectionSubmission,
  qaService,
  QASubmission,
} from '../entity';
import '../styles.css';

type InternalState = QASubmission | undefined;
const QAISubmissionViewPage = () => {
  const dispatch = useDispatch();

  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaSections);

  const itemId = useParams().itemId;
  const [item, setItem] = useState(undefined as InternalState);
  const [error, setError] = useState('');
  let [yesCount, setYesCount] = useState(0);
  let [noCount, setNoCount] = useState(0);
  let [questionYesCount, setQuestionYesCount] = useState(0);
  let [questionNoCount, setQuestionNoCount] = useState(0);
  let [sectionList, setSectionList] = useState<QASection[]>();

  const fmLocation = useFMLocation(item?.locationId);

  if (!itemId) {
    const message = 'An itemId was not provided';
    console.error(message);
    setError(message);
  }

  useMemo(() => {
    if (!sectionState.isFetched && !sectionState.isFetching) {
      dispatch(qaSectionStateProvider.loadState());
    }

    if (!item) {
      qaService
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

  const getSectionName = (sectionId?: string): string => {
    if (!sectionId) {
      return 'No Section Id';
    }
    const searchSection = sectionList?.find((temp: any) => temp.itemId === sectionId);
    return searchSection?.name ? searchSection?.name : 'Unknown Section';
  };

  const getQuestionText = (questionId?: string, sectionId?: string) => {
    if (!questionId || !sectionId) {
      return 'Missing question id or section id';
    }
    const searchSection = sectionList?.find((temp: any) => temp.itemId === sectionId);
    const searchQuestion = searchSection?.questions.find((temp: any) => temp.itemId === questionId);
    return searchQuestion?.text ? searchQuestion?.text : 'NA';
  };

  /*
  const getGuestQuestionBySectionIdAndGQId = (sectionId: string, gquestionId: string) => {
    let searchSection;
    if (sectionList) {
      searchSection = sectionList?.find((temp: any) => temp.itemId === sectionId);
    }
    let gquestion;
    if (searchSection) {
      gquestion = searchSection.guestQuestions.find((temp: any) => temp.itemId === gquestionId);
    }
    return gquestion ? gquestion.text : '';
  };
  */

  useMemo(() => {
    if (item?.sections) {
      let staticNo = 0;
      let statcYes = 0;
      let gqNo = 0;
      let gqYes = 0;
      item?.sections.map((s: QASectionSubmission) => {
        s?.guestAnswers.map((Qanswer: QAGuestQuestionAnswerGroup) => {
          Qanswer.answers.map((Questquestion: QAGuestQuestionAnswer) => {
            if (Questquestion.value === 'YES') {
              gqYes = gqYes + 1;
            } else {
              gqNo = gqNo + 1;
            }
          });
        });
        s?.answers.map((question: QAQuestionAnswer) => {
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
          <Table style={{ marginTop: '5px', border: '1px solid #D0D7DE' }} className="table-count">
            <Thead>
              <Tr className="trCls">
                <Th className="col-3">Location</Th>
                <Th className="col-3">Fsc</Th>
                <Th className="col-3">Manager On Duty</Th>
                <Th className="col-3">Date Scored</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td className="col-3">{fmLocation?.name} </Td>
                <Td className="col-3">{item?.fsc}</Td>
                <Td className="col-3">{item?.managerOnDuty}</Td>
                <Td className="col-3">{dateTime(item.dateScored).format('dd YYYY-MM-DD hh:mm A')}</Td>
              </Tr>
            </Tbody>
          </Table>
          <Table style={{ marginTop: '15px', border: '1px solid #D0D7DE' }} className="table-count">
            <Thead>
              <Tr className="trCls">
                <Th className="col-3">Start Time</Th>
                <Th className="col-3">End Time</Th>
                <Th className="col-6">Reponsibility Alcohol Certificate for Mgr/Bar staff</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td className="col-3">{item.startTime}</Td>
                <Td className="col-3">{item.endTime}</Td>
                <Td className="col-6">{item?.responsibleAlcoholCert}</Td>
              </Tr>
            </Tbody>
          </Table>
          <hr />
          <div className="mb-2" style={{ marginTop: '15px' }}>
            <h5 className="mb-2">Details</h5>
            <div>
              {item?.sections &&
                item?.sections.map((s: QASectionSubmission, index: number) => (
                  <>
                    <div className="mb-3 col-12">
                      <h1 className="section-name">
                        Section {index + 1}: {getSectionName(s.sectionId)}
                      </h1>
                      {s.staffAttendance && (
                        <div>
                          {Object.values(s.staffAttendance).length > 0 && (
                            <>
                              <label className="mt-2">Staff Attendance Log: </label>
                              <span>
                                <Table
                                  style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }}
                                  className="table-count"
                                >
                                  <Tbody>
                                    <Fragment>
                                      <Tr>
                                        <Th className="col-2">Bartenders</Th>
                                        <Th className="col-2">Cashiers</Th>
                                        <Th className="col-2">Expo</Th>
                                        <Th className="col-2">Dish/Busser</Th>
                                        <Th className="col-2">Line Cooks</Th>
                                        <Th className="col-2">Prep</Th>
                                      </Tr>
                                      <Tr>
                                        <Td className="col-2">{Object.values(s.staffAttendance)[0]}</Td>
                                        <Td className="col-2">{Object.values(s.staffAttendance)[1]}</Td>
                                        <Td className="col-2">{Object.values(s.staffAttendance)[2]}</Td>
                                        <Td className="col-2">{Object.values(s.staffAttendance)[3]}</Td>
                                        <Td className="col-2">{Object.values(s.staffAttendance)[4]}</Td>
                                        <Td className="col-2">{Object.values(s.staffAttendance)[5]}</Td>
                                      </Tr>
                                    </Fragment>
                                  </Tbody>
                                </Table>
                              </span>
                            </>
                          )}
                        </div>
                      )}
                      <Fragment>
                        {s?.answers &&
                          s?.answers.map((question: QAQuestionAnswer, idx: number) => (
                            <>
                              <Table
                                style={{ marginTop: '15px', border: '1px solid #D0D7DE;' }}
                                className="table-count"
                              >
                                <Tbody>
                                  <Fragment>
                                    <Tr>
                                      <Td className="col-4">{getQuestionText(question.questionId, s.sectionId)} </Td>
                                      <Td className="col-4">{question.notes}</Td>
                                      <Td className="col-1 ">
                                        <Fragment>{question.value}</Fragment>
                                      </Td>
                                      <Td className="col-3">
                                        {question.attachments.map(attachment => (
                                          <div>
                                            <div
                                              className={css`
                                                text-align: center;
                                              `}
                                            >
                                              <a href={attachment.downloadUrl}>Download</a>
                                            </div>
                                            <img
                                              src={`${window.location.origin}${attachment.downloadUrl}`}
                                              width="100%"
                                            />
                                          </div>
                                        ))}
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
                              s?.guestAnswers.map((Qanswer: QAGuestQuestionAnswerGroup, idGusts: number) => (
                                <>
                                  <Fragment>
                                    <Tr>
                                      <Td className="col-3">
                                        {Qanswer.notes}
                                        {/*  This doesn't work as expected, because idGusts is the group id, not the question id.
                                        // we may need to regroup this data in another object to make it easier to display here
                                        {getGuestQuestionBySectionIdAndGQId(
                                          s.sectionId!,
                                          Qanswer.answers[idGusts].guestQuestionId!
                                        )}*/}
                                      </Td>
                                      {Qanswer?.answers &&
                                        Qanswer.answers.map((Questquestion: QAGuestQuestionAnswer, idGust: number) => (
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
                          </Fragment>
                        </Tbody>
                      </Table>
                    </div>
                    <br />
                  </>
                ))}
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
