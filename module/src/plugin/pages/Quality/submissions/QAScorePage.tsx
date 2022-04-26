import { Box } from '@chakra-ui/react';
import { Icon, LoadingIcon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import React, { Fragment, ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { QAQuestion, QASection } from '../sections/entity';
import { useQASections } from '../sections/hooks';
import { QAAScoresByTag, QASectionScore, QASectionSubmission } from './entity';
import { useQAASubmissionScore, useQASubmission } from './hooks';

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
interface Props {
  children?: ReactNode;
  email: any;
  subject: string;
  body?: ReactNode;
}
const Mailto = (props: Props) => {
  const { children, email, subject, body } = props;
  let param = subject || body ? '?' : '';
  if (subject) {
    param += `subject=${encodeURIComponent(subject)}`;
  }
  if (body) {
    param += `${subject ? '&' : ''}body=${body}`;
  }

  return (
    <a href={`mailto:${email}${param}`} style={{ textDecoration: 'underline' }}>
      {children}
    </a>
  );
};

const QAAScorePage = () => {
  const params = useParams();
  const submissionId = params['itemId'];

  const qaSubmission = useQASubmission(submissionId);
  const qaSections = useQASections();
  const qaScore = useQAASubmissionScore(submissionId);

  const showLoading = !qaSections || !qaSubmission || !qaScore || !params;

  const [activeTab, setActiveTab] = useState('score');
  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const getSectionName = (sectionId: string) => {
    const searchSection: QASection | undefined = qaSections?.find((temp: any) => temp.itemId === sectionId);
    return searchSection?.name || 'Unknown Section';
  };
  const getQuestionText = (questionId: string) => {
    const searchQuestion: QAQuestion | undefined = qaSections
      ?.flatMap(s => s.questions)
      .find((temp: any) => temp.itemId === questionId);
    return searchQuestion?.text || 'NA';
  };

  return (
    <div>
      <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
      {!showLoading ? (
        <Fragment>
          <Nav tabs>
            <TabEntry tabId="score" tabText="Score" activeTab={activeTab} toggle={toggle} />
            <TabEntry tabId="actionPlan" tabText="Action Plan" activeTab={activeTab} toggle={toggle} />
          </Nav>
          <TabContent
            activeTab={activeTab}
            className={cx(
              'pt-5',
              'pl-3',
              css`
                border-top: #ddd solid 1px;
              `
            )}
          >
            <TabPane tabId="score">
              <Fragment>
                <Row>
                  {qaScore &&
                    qaScore.sections.length > 0 &&
                    qaScore.sections.map((sectionObj: QASectionScore, index: number) => (
                      <>
                        <Col className="mb-3 col-4">
                          <h1 className="section-name">
                            Section {index + 1}: {getSectionName(sectionObj.sectionId)}
                          </h1>
                          <hr className="mb-2 mt-2" />
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
                                  <td className="col-2">{sectionObj.rating * 100}%</td>
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
                                            <td className="col-1">{question.rating * 100}%</td>
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
                            {qaScore && (
                              <tr className="trCls">
                                <td className="col-2">Overall</td>
                                <td className="col-1">{qaScore.overallAvailable}</td>
                                <td className="col-1">{qaScore.overallNA}</td>
                                <td className="col-1">{qaScore.overallRequired}</td>
                                <td className="col-1">{qaScore.overallScore}</td>
                                <td className="col-1">{qaScore.overallRating * 100}%</td>
                                {qaScore.overallRating > 0.8 ? (
                                  <td className="col-1" style={{ color: 'green', fontWeight: 'bold' }}>{`PASS`}</td>
                                ) : (
                                  <td className="col-1" style={{ color: 'red', fontWeight: 'bold' }}>{`FAIL`}</td>
                                )}
                              </tr>
                            )}
                          </Fragment>
                          <Fragment>
                            {qaScore &&
                              qaScore.scoresByTag.length > 0 &&
                              qaScore.scoresByTag.map((tagObj: QAAScoresByTag, index: number) => (
                                <tr className="trCls">
                                  <td className="col-2">{tagObj.tag}</td>
                                  <td className="col-1">{tagObj.available}</td>
                                  <td className="col-1">{tagObj.na}</td>
                                  <td className="col-1">{tagObj.required}</td>
                                  <td className="col-1">{tagObj.score}</td>
                                  <td className="col-1">{tagObj.rating * 100}%</td>
                                  {tagObj.rating > 0.8 ? (
                                    <td className="col-1" style={{ color: 'green', fontWeight: 'bold' }}>{`Ok`}</td>
                                  ) : (
                                    <td className="col-1" style={{ color: 'red', fontWeight: 'bold' }}>{`Improve`}</td>
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
                    <Col>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1 className="category-name" style={{ fontWeight: 'bold' }}>
                          Question
                        </h1>
                        <>
                          <Mailto
                            email="franchisemanager@gmail.com"
                            subject="QAA Action Plan"
                            body={window.location.href}
                          >
                            Send Email
                          </Mailto>
                        </>
                      </Box>
                      <Fragment>
                        <table
                          style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }}
                          className="table-count tableRowSizeManageActionPlan"
                        >
                          <thead style={{ backgroundColor: '#9e9e9e', color: '#fff' }}>
                            <tr className="trCls">
                              <th className="col-2">Order</th>
                              <th className="col-3">Question</th>
                              <th className="col-3">Notes</th>
                              <th className="col-4">Image</th>
                            </tr>
                          </thead>

                          <>
                            <tbody>
                              <Fragment>
                                {qaSubmission &&
                                  qaSubmission.sections.length > 0 &&
                                  qaSubmission.sections
                                    .sort((next: any, prev: any) => next.order - prev.order)
                                    .map(
                                      (section: QASectionSubmission) =>
                                        section?.answers &&
                                        section?.answers.map(
                                          (answer: any, idxa: number) =>
                                            answer.value === 'NO' && (
                                              <tr className="trCls">
                                                <td>
                                                  {section.order}.{idxa + 1}
                                                </td>
                                                <td>{getQuestionText(answer.questionId)}</td>
                                                <td>{answer['notes']}</td>
                                                <td>
                                                  {answer.attachments && answer.attachments.length > 0 ? (
                                                    <img
                                                      src={
                                                        answer.attachments[answer.attachments.length - 1]['downloadUrl']
                                                      }
                                                    />
                                                  ) : (
                                                    <Icon
                                                      name="image"
                                                      style={{ fontSize: '2.875em', color: '#acb2b9' }}
                                                    />
                                                  )}
                                                </td>
                                              </tr>
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
