import { LoadingIcon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { qaiSectionStateProvider } from '../../sections/entity';
import { qaiSubmissionStateProvider } from '../entity';
import { useQAASubmissionScore } from '../hooks';
const TabEntry = ({
  activeTab,
  toggle,
  tabId,
  tabText,
}: {
  activeTab: string;
  toggle: (tabId: string) => void;
  tabId: string;
  tabText: string;
}) => {
  return (
    <NavItem>
      <NavLink
        className={cx({ active: activeTab === tabId })}
        onClick={() => {
          toggle(tabId);
        }}
      >
        {tabText}
      </NavLink>
    </NavItem>
  );
};
const QAAScorePage = () => {
  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const dispatch = useDispatch();
  const params = useParams();
  const submissionId = params['itemId'];

  const [qaaSubmScore, setQaaSubmScore] = useState<any>();
  const [qaaSubmission, setqaaSubmission] = useState<any>();
  const [loadData, setLoadData] = useState(true);

  const [sectionList, setSectionList] = useState<any>();

  useMemo(() => {
    if (!sectionState.isFetched && !sectionState.isFetching) {
      dispatch(qaiSectionStateProvider.loadState());
    }
    if (!submissionState.isFetched && !submissionState.isFetching) {
      dispatch(qaiSubmissionStateProvider.loadState());
    }
    if (sectionState?.response) {
      setSectionList(sectionState?.response);
    }
    if (submissionState?.response) {
      setqaaSubmission(submissionState?.response);
    }
  }, [sectionState, submissionState, dispatch]);

  const showLoading = sectionState.isFetching || submissionState.isFetching;

  const fmQaaScore = useQAASubmissionScore(submissionId);

  const [activeTab, setActiveTab] = useState('score');
  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

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
    if (fmQaaScore) {
      setQaaSubmScore(fmQaaScore);
      setLoadData(false);
    }
  }, [fmQaaScore]);

  return (
    <div>
      <div>{loadData && <LoadingIcon className="m-auto" />}</div>
      {qaaSubmScore ? (
        <Fragment>
          <Nav tabs>
            <TabEntry tabId="score" tabText="Score" activeTab={activeTab} toggle={toggle} />
            <TabEntry tabId="actionPlan" tabText="Action Plan" activeTab={activeTab} toggle={toggle} />
          </Nav>
          <TabContent
            activeTab={activeTab}
            className={cx(
              'pt-2',
              css`
                border-top: #ddd solid 1px;
              `
            )}
          >
            <TabPane tabId="score">
              <Fragment>
                <Row>
                  {qaaSubmScore &&
                    qaaSubmScore.sections.length > 0 &&
                    qaaSubmScore?.sections.map((sectionObj: any, index: number) => (
                      <>
                        <Col className="mb-3 col-4">
                          <h1 className="section-name">Section {index + 1}</h1>
                          <hr className="mb-2 mt-2" />
                          <h1 className="category-name">{getSection(sectionObj.sectionId)}</h1>
                          <Fragment>
                            <table style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }} className="table-count">
                              <thead style={{ backgroundColor: '#9e9e9e', color: '#fff' }}>
                                <tr className="trCls">
                                  <th className="col-4">Question Category</th>
                                  <th className="col-2">Rating</th>
                                </tr>
                              </thead>
                              <tfoot>
                                <tr className="trCls">
                                  <td className="col-4">Total</td>
                                  <td className="col-2">100%</td>
                                </tr>
                              </tfoot>
                              {sectionObj?.categoryScores &&
                                sectionObj?.categoryScores
                                  .sort((next: any, prev: any) => next.order - prev.order)
                                  .map((question: any, idx: number) => (
                                    <>
                                      <tbody>
                                        <Fragment>
                                          <tr className="trCls">
                                            <td className="col-4">{question.categoryName}</td>
                                            <td className="col-1">{question.rating}%</td>
                                          </tr>
                                        </Fragment>
                                      </tbody>
                                    </>
                                  ))}
                            </table>
                          </Fragment>
                        </Col>
                      </>
                    ))}
                  <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
                </Row>
                <Row>
                  <div className="mb-3 col-12">
                    <hr className="mb-2 mt-2" />
                    <h1 className="section-name" style={{ fontWeight: 'bold' }}>
                      Totals
                    </h1>
                    <Fragment>
                      <table style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }} className="table-count">
                        <thead style={{ backgroundColor: '#9e9e9e', color: '#fff' }}>
                          <tr className="trCls">
                            <th className="col-2"></th>
                            <th className="col-1">Available</th>
                            <th className="col-1">Not Applicable</th>
                            <th className="col-1">Required</th>
                            <th className="col-1">Score</th>
                            <th className="col-1">Rating</th>
                            <th className="col-1"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <Fragment>
                            {qaaSubmScore &&
                              qaaSubmScore.scoresByTag.length > 0 &&
                              qaaSubmScore?.scoresByTag.map((tagObj: any, index: number) => (
                                <tr className="trCls">
                                  <td className="col-2">{tagObj.tag}</td>
                                  <td className="col-1">{tagObj.available}</td>
                                  <td className="col-1">{tagObj.na}</td>
                                  <td className="col-1">{((tagObj.available - tagObj.na) * 0.8).toFixed(1)}</td>
                                  <td className="col-1">{tagObj.score}</td>
                                  <td className="col-1">{tagObj.rating}%</td>
                                  {tagObj.score > (tagObj.available - tagObj.na) * 0.8 ? (
                                    <td className="col-1" style={{ color: 'green', fontWeight: 'bold' }}>{`PASS`}</td>
                                  ) : (
                                    <td className="col-1" style={{ color: 'red', fontWeight: 'bold' }}>{`FAIL`}</td>
                                  )}
                                </tr>
                              ))}
                          </Fragment>
                        </tbody>
                      </table>
                    </Fragment>
                  </div>
                </Row>
              </Fragment>
            </TabPane>
            <TabPane tabId="actionPlan">
              <Fragment>
                <Row>
                  <>
                    <Col className="mb-3 col-4">
                      <h1 className="category-name" style={{ fontWeight: 'bold' }}>
                        Question
                      </h1>
                      <Fragment>
                        <table style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }} className="table-count">
                          <thead style={{ backgroundColor: '#9e9e9e', color: '#fff' }}>
                            <tr className="trCls">
                              <th className="col-4">Question</th>
                              <th className="col-2">Notes</th>
                            </tr>
                          </thead>

                          <>
                            <tbody>
                              <Fragment>
                                {qaaSubmission &&
                                  qaaSubmission.content.length > 0 &&
                                  qaaSubmission?.content.map(
                                    (submissionObj: any, index: number) =>
                                      submissionObj?.id === submissionId &&
                                      submissionObj?.sections &&
                                      submissionObj?.sections
                                        .sort((next: any, prev: any) => next.order - prev.order)
                                        .map(
                                          (question: any, idx: number) =>
                                            question?.answers &&
                                            question?.answers.map(
                                              (answer: any, idxa: number) =>
                                                answer.value === 'NO' && (
                                                  <tr className="trCls">
                                                    <td className="col-4">
                                                      {getQuestionText(answer.questionId, question.sectionId)}
                                                    </td>
                                                    <td className="col-1">{answer['notes']}</td>
                                                  </tr>
                                                )
                                            )
                                        )
                                  )}
                              </Fragment>
                            </tbody>
                          </>
                        </table>
                      </Fragment>
                    </Col>
                  </>
                  <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
                </Row>
              </Fragment>
            </TabPane>
          </TabContent>
        </Fragment>
      ) : (
        'No Record available'
      )}
    </div>
  );
};

export default QAAScorePage;
