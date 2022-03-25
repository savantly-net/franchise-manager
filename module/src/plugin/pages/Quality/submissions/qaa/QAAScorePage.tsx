import { Table, Td, Tr } from '@chakra-ui/react';
import { getUserContextService } from '@savantly/sprout-runtime';
import { LoadingIcon } from '@sprout-platform/ui';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
import { qaiSectionStateProvider } from '../../sections/entity';
import { QAISectionSubmission, qaiSubmissionStateProvider } from '../entity';
import { useQAASubmissionScore } from '../hooks';

const QAAScorePage = () => {
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();
  const userContext = getUserContextService().getUserContext();

  const [draftSubmission, setDraftSubmission] = useState({
    locationId: '',
    dateScored: '',
    managerOnDuty: '',
    fsc: '',
    responsibleAlcoholCert: '',
    sections: [],
  });

  useMemo(() => {
    if (!categoryState.isFetched && !categoryState.isFetching) {
      dispatch(qaiQuestionCategoryStateProvider.loadState());
      dispatch(qaiSubmissionStateProvider.loadState());
      if (!sectionState.isFetched && !sectionState.isFetching) {
        dispatch(qaiSectionStateProvider.loadState());
      }
    }
  }, [sectionState, categoryState, dispatch]);

  useEffect(() => {
    if (sectionState?.response) {
      let sections: any = [];
      sectionState?.response.map((item: any, i: number) => {
        sections[i] = {};
        sections[i].sectionId = item.itemId;
        sections[i].name = item.name;
        sections[i].order = item.order;
        sections[i].managerOnDuty = '';
        sections[i].dateScored = '';
        sections[i].status = 'DRAFT';
        sections[i].requireStaffAttendance = item.requireStaffAttendance;
        sections[i].staffAttendance = {};

        let answers: any = [];

        item.questions.map((item1: any, i1: number) => {
          let test: any = {};
          test.questionId = item1.itemId;
          test.sectionId = item1.sectionId;
          test.categoryId = item1.categoryId;
          test.order = item1.order;
          test.points = item1.points;
          test.value = '';
          test.text = item1.text;
          test.notes = item1.notes;
          test.attachments = [];
          answers.push(test);
        });
        sections[i].answers = answers;

        let guestanswers: any = [];
        item.guestQuestions.map((item1: any = {}, i1: number) => {
          if (item1.text) {
            let tests: any = {};
            tests.notes = item1.text;
            tests.attachments = [];
            tests.answers = [
              { guestQuestionId: item1.itemId, notes: item1.text, value: '' },
              { guestQuestionId: item1.itemId, notes: item1.text, value: '' },
              { guestQuestionId: item1.itemId, notes: item1.text, value: '' },
            ];
            guestanswers.push(tests);
          }
        });
        sections[i].guestAnswers = guestanswers;
      });
      setDraftSubmission({
        locationId: '',
        dateScored: '',
        managerOnDuty: '',
        fsc: userContext?.user?.name ? userContext?.user?.name : '',
        responsibleAlcoholCert: '',
        sections: sections,
      });
    }
  }, [sectionState, userContext]);

  const showLoading = sectionState.isFetching || submissionState.isFetching;

  const scoreDisplay = (sections: QAISectionSubmission[]) => {
    return (
      <Table>
        <Tr>
          <Td>
            {sections.map(s => {
              {
                <p>{s}</p>;
              }
            })}
          </Td>
        </Tr>
      </Table>
    );
  };
  const fmQaaScore = useQAASubmissionScore(`f23fdfdb-8bf8-4b62-999d-1aa4f549453d`);
  console.log("fmQaaScore===",fmQaaScore);

  return (
    <div>
      {draftSubmission.sections.length > 0 ? (
        <Fragment>
          <form>
            <>
              <Row>
                {draftSubmission &&
                  draftSubmission?.sections.map((sectionObj: any, index: number) => (
                    <>
                      <Col className="mb-3 col-4">
                        <h1 className="section-name">Section {index + 1}</h1>
                        <hr className="mb-2 mt-2" />
                        <h1 className="category-name">{sectionObj?.name}</h1>
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
                            {sectionObj?.answers &&
                              sectionObj?.answers
                                .sort((next: any, prev: any) => next.order - prev.order)
                                .map((question: any, idx: number) => (
                                  <>
                                    <tbody>
                                      <Fragment>
                                        <tr className="trCls">
                                          <td className="col-4">{question.text}</td>
                                          <td className="col-1">{question.points}%</td>
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
                          <tr className="trCls">
                            <td className="col-2">{`Overall`}</td>
                            <td className="col-1">{`529`}</td>
                            <td className="col-1">{`0`}</td>
                            <td className="col-1">{`397.75`}</td>
                            <td className="col-1">{`529`}</td>
                            <td className="col-1">{`100`}%</td>
                            <td className="col-1" style={{ color: 'green', fontWeight: 'bold' }}>{`PASS`}</td>
                          </tr>
                          <tr className="trCls">
                            <td className="col-2">{`Cleanliness`}</td>
                            <td className="col-1">{`239`}</td>
                            <td className="col-1">{`0`}</td>
                            <td className="col-1">{`179.25`}</td>
                            <td className="col-1">{`178`}</td>
                            <td className="col-1">{`78`}%</td>
                            <td className="col-1" style={{ color: 'red', fontWeight: 'bold' }}>{`FAIL`}</td>
                          </tr>
                          <tr className="trCls">
                            <td className="col-2">{`Q-Cat-X`}</td>
                            <td className="col-1">{`244`}</td>
                            <td className="col-1">{`0`}</td>
                            <td className="col-1">{`181`}</td>
                            <td className="col-1">{`183`}</td>
                            <td className="col-1">{`82`}%</td>
                            <td className="col-1" style={{ color: 'green', fontWeight: 'bold' }}>{`PASS`}</td>
                          </tr>
                        </Fragment>
                      </tbody>
                    </table>
                  </Fragment>
                </div>
              </Row>
            </>
          </form>
          {scoreDisplay(draftSubmission.sections)}
        </Fragment>
      ) : (
        'No Record available'
      )}
    </div>
  );
};

export default QAAScorePage;
