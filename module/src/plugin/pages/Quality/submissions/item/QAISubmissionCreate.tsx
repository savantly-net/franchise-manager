import { Form, FileUploadButton, FormField, Icon, LoadingIcon } from '@sprout-platform/ui';
import { FileMetaData } from '@savantly/sprout-api';
// import { FileMetaData, dateTime } from '@savantly/sprout-api';
import { LocationSelector } from 'plugin/pages/Locations/Stores/component/LocationSelector';
import React, { useMemo, useState, useEffect, Fragment } from 'react';
import { getUserContextService } from '@savantly/sprout-runtime';
// import React, { useMemo, useEffect, useState, Fragment } from 'react';
// import React, { useMemo, useEffect, useState, Fragment } from 'react';
import { AppModuleRootState, FileItem } from 'plugin/types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { qaiSectionStateProvider } from '../../sections/entity';
import { getFileService } from '@savantly/sprout-runtime';
import { AxiosResponse } from 'axios';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
// import {
//   //   // QAASectionSubmission,
//   //   qaaSubmissionService,
//   qaaSubmissionStateProvider,
// } from '../qaaentity';

import {
  QAISectionSubmission,
  qaiSubmissionService,
  qaiSubmissionStateProvider,
  // QAIGuestQuestionAnswerGroup,
} from '../entity';
//  import { QAISectionSubmissionEditModel } from '../entity';

const QAISubmissionCreate = () => {
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [error, setError] = useState('');
  const fileService = getFileService();
  const userContext = getUserContextService().getUserContext();

  // type InternalState = QAISectionSubmissionEditModel | undefined;
  // const [draftSubmission, setDraftSubmission] = useState(undefined as InternalState);
  const [categoryList, setCategoryList] = useState([]);
  const [draftSubmission, setDraftSubmission] = useState({
    locationId: '',
    dateScored: '',
    managerOnDuty: '',
    fsc: '',
    responsibleAlcoholCert: '',
    sections: [],
  });

  const navigate = useNavigate();
  useMemo(() => {
    if (!categoryState.isFetched && !categoryState.isFetching) {
      dispatch(qaiQuestionCategoryStateProvider.loadState());
      // dispatch(qaaSubmissionStateProvider.loadState());
      qaiQuestionCategoryStateProvider.props.entityService
        .load()
        .then((response: any) => {
          setCategoryList(response?.data.content);
        })
        .catch(err => {
          setError('Could not create attachment folder');
        });
      if (!sectionState.isFetched && !sectionState.isFetching) {
        dispatch(qaiSectionStateProvider.loadState());
      }
    }
  }, [sectionState, categoryState, dispatch]);

  const getCategory = (categoryId: string) => {
    const searchCategory: any = categoryList.find((temp: any) => temp.itemId === categoryId);
    return searchCategory?.name ? searchCategory?.name : 'Unknown Category';
  };

  useEffect(() => {
    // getInitialData();
    if (sectionState?.response) {
      // getInitialData();
      // console.log(sectionState?.response, " sectionState?.response")
      let sections: any = [];
      sectionState?.response.map((item: any, i: number) => {
        sections[i] = {};
        sections[i].itemId = item.itemId;
        sections[i].sectionId = item.itemId;
        sections[i].locationId = selectedLocation;
        sections[i].name = item.name;
        sections[i].order = item.order;
        sections[i].managerOnDuty = item.name;
        sections[i].dateScored = '';
        sections[i].status = 'DRAFT';

        let answers: any = [];

        item.questions.map((item1: any, i1: number) => {
          let test: any = {};
          // test.itemId = item1.itemId;
          test.questionId = item1.itemId;
          test.sectionId = item1.sectionId;
          test.categoryId = item1.categoryId;
          test.order = item1.order;
          test.points = item1.points;
          test.value = 'NA';
          test.notes = item1.text;
          test.attachments = [];
          answers.push(test);
        });
        sections[i].answers = answers;

        let guestanswers: any = [];
        // guestanswers.answers = [];

        item.guestQuestions.map((item1: any = {}, i1: number) => {
          let tests: any = {};
          tests.itemId = null;
          // tests.itemId = item1.itemId;
          tests.notes = item1.text;
          tests.attachments = [];
          tests.answers = [{ itemId: '', guestQuestionId: item1.itemId, notes: item1.text, value: 'NA' }];
          guestanswers.push(tests);
        });
        sections[i].guestAnswers = guestanswers;
      });
      console.log(sections, ' sectionssections');
      setDraftSubmission({
        locationId: selectedLocation,
        dateScored: '',
        managerOnDuty: '',
        fsc: userContext?.user?.name ? userContext?.user?.name : '',
        responsibleAlcoholCert: '',
        sections: sections,
      });
    }
  }, [sectionState, selectedLocation, userContext]);

  console.log(draftSubmission, ' draftSubmission');

  const showLoading = sectionState.isFetching || submissionState.isFetching;

  return (
    <div>
      {error && <Alert color="warning">{error}</Alert>}
      {draftSubmission.sections.length > 0 ? (
        <Fragment>
          <Form
            initialValues={draftSubmission}
            onSubmit={async (values: QAISectionSubmission, { resetForm }) => {
              values.locationId = selectedLocation;
              console.log(draftSubmission.sections, 'draftSubmission.sections');
              values.dateScored = '2022-03-10T13:38:42.631Z';
              // values.dateScored = dateTime(values.dateScored).format('YYYY-MM-DDTHH:mm:ss');
              console.log(values.sections, 'values.sections');
              console.log(values, 'valuesvaluesvalues');
              // return;
              qaiSubmissionService
                .create(values)
                .then(response => {
                  dispatch(qaiSectionStateProvider.loadState());
                  dispatch(qaiSubmissionStateProvider.loadState());
                  navigate(`../item/${response.data.itemId}`);
                  resetForm();
                })
                .catch(err => {
                  setError(err.message || 'There was a problem saving the content. Check the logs.');
                });
            }}
            onCancel={() => {
              console.log('Click on Cancel Button');
            }}
          >
            {props => (
              <>
                {/* {console.log(props.initialValues.sections, "propsprops")} */}
                <Fragment>
                  <div className="d-flex mb-3">
                    <div className="col-4 location-select">
                      <label>Select Location</label>
                      <LocationSelector
                        initialValue={selectedLocation}
                        onChange={value => {
                          setSelectedLocation(value);
                          // getInitialData();
                        }}
                      />
                    </div>

                    <div className="col-4">
                      <FormField name="dateScored" type="date" label="Audit Date" />
                    </div>

                    <div className="col-4">
                      <FormField name="managerOnDuty" type="text" label="Manager On Duty" />
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div className="col-4">
                      <FormField name="fsc" disabled type="text" label="FSC Conducting" />
                    </div>
                    <div className="col-4">
                      <FormField name="fsm" type="text" label="Food safety manager on duty" />
                    </div>
                    <div className="col-4">
                      <FormField
                        name="responsibleAlcoholCert"
                        type="text"
                        label="Reponsibility Alcohol Certificate for Mgr/Bar staff"
                      />
                    </div>
                  </div>
                </Fragment>
                {draftSubmission &&
                  draftSubmission?.sections.map((s: any, index: number) => (
                    <>
                      <div className="mb-3 col-12">
                        <h1 className="section-name">
                          Section {index + 1}: {s?.name}
                        </h1>
                        <hr className="mb-2 mt-2" />
                        <Fragment>
                          {s?.answers &&
                            s?.answers.map((question: any, idx: number) => (
                              <>
                                <h1 className="category-name">{getCategory(question.categoryId)}</h1>
                                <table
                                  style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }}
                                  className="table-count"
                                >
                                  <tbody>
                                    <Fragment>
                                      <tr>
                                        <td className="col-1">
                                          {s.order}.{question.order}
                                        </td>
                                        <td className="col-4">{question.notes}</td>
                                        <td className="col-1">{question.points}</td>
                                        <td className="col-2 ">
                                          <Fragment>
                                            <FormField
                                              name={`sections.${index}.answers.${idx}.value`}
                                              className="mb-1"
                                              as="select"
                                            >
                                              <option value="NA">N/A</option>
                                              <option value="YES">Yes</option>
                                              <option value="NO">No</option>
                                            </FormField>
                                          </Fragment>
                                        </td>

                                        <td className="col-2">
                                          <FileUploadButton
                                            buttonContent={
                                              <Fragment>
                                                <Icon name="paperclip"></Icon>
                                                <span>Attach</span>
                                              </Fragment>
                                            }
                                            onCancel={() => {}}
                                            onConfirm={value => {
                                              if (value.files) {
                                                // onAddAttachments(
                                                //   value.files,
                                                //   index,
                                                //   idx,
                                                //   draftSubmission.sections[index]['sectionId']
                                                //   // draftSubmission.sections[index].sectionId
                                                // );

                                                const fileUploads: Array<Promise<AxiosResponse<FileMetaData>>> = [];
                                                for (let index = 0; index < value.files.length; index++) {
                                                  const file = value.files[index];

                                                  try {
                                                    fileUploads.push(
                                                      fileService.uploadFile(
                                                        {
                                                          name: file.name,
                                                          isDir: false,
                                                          parent: draftSubmission.sections[index]['sectionId'],
                                                        },
                                                        file
                                                      )
                                                    );
                                                  } catch (e) {
                                                    setError('error' + e);
                                                  }
                                                  Promise.all(fileUploads).then(responses => {
                                                    const newFiles = responses.map(f => {
                                                      return f.data as FileItem;
                                                    });
                                                    const attachments = [
                                                      ...draftSubmission.sections[index]['answers'][idx]['attachments'],
                                                      ...newFiles,
                                                    ];
                                                    console.log(attachments, 'attachmentsattachments');
                                                    // (draftSubmission.sections[index]['answers'][idx]['attachments'] as FileItem = attachments);
                                                    // draftSubmission.sections[index]['answers'][idx]['attachments'] = FileItem;
                                                    props.setFieldValue(
                                                      `sections.${index}.answers.${idx}.attachments`,
                                                      attachments
                                                    );
                                                  });
                                                }
                                              }
                                            }}
                                            accept={['image/*']}
                                          />
                                        </td>
                                      </tr>
                                    </Fragment>
                                  </tbody>
                                </table>
                              </>
                            ))}
                        </Fragment>

                        <h1 className="category-name">Guest Question</h1>
                        <table style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }} className="table-count">
                          {s?.guestAnswers && Object.keys(s?.guestAnswers).length > 0 && (
                            <thead>
                              <tr className="trCls">
                                <td className="col-4">Question</td>
                                <td className="col-2">Quest 1</td>
                                <td className="col-2">Quest 2</td>
                                <td className="col-2">Quest 3</td>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            <Fragment>
                              {s?.guestAnswers &&
                                s?.guestAnswers.map((Qanswer: any, idGusts: number) => (
                                  <>
                                    {Qanswer?.answers &&
                                      Qanswer.answers.map((Questquestion: any, idGust: number) => (
                                        <>
                                          <Fragment>
                                            <tr>
                                              <td className="col-3">{Questquestion.notes}</td>

                                              <td className="col-2 ">
                                                <Fragment>
                                                  <FormField
                                                    name={`sections.${index}.guestAnswers.${idGusts}.answers.${idGust}.value`}
                                                    className="mb-1"
                                                    as="select"
                                                  >
                                                    <option value="NA">N/A</option>
                                                    <option value="YES">Yes</option>
                                                    <option value="NO">No</option>
                                                  </FormField>
                                                </Fragment>
                                              </td>

                                              <td className="col-2 ">
                                                <Fragment>
                                                  <FormField
                                                    name={`sections.${index}.guestAnswers.${idGusts}.answers.${idGust}.value`}
                                                    className="mb-1"
                                                    as="select"
                                                  >
                                                    <option value="NA">N/A</option>
                                                    <option value="YES">Yes</option>
                                                    <option value="NO">No</option>
                                                  </FormField>
                                                </Fragment>
                                              </td>

                                              <td className="col-2 ">
                                                <Fragment>
                                                  <FormField
                                                    name={`sections.${index}.guestAnswers.${idGusts}.answers.${idGust}.value`}
                                                    className="mb-1"
                                                    as="select"
                                                  >
                                                    <option value="NA">N/A</option>
                                                    <option value="YES">Yes</option>
                                                    <option value="NO">No</option>
                                                  </FormField>
                                                </Fragment>
                                              </td>

                                              {/* <td className="col-2">
                                                <FileUploadButton
                                                  buttonContent={
                                                    <Fragment>
                                                      <Icon name="paperclip"></Icon>
                                                      <span>Attach</span>
                                                    </Fragment>
                                                  }
                                                  onCancel={() => {}}
                                                  onConfirm={value => {
                                                    if (value.files) {
                                                      onAddAttachments(
                                                        value.files,
                                                        index,
                                                        idGust,
                                                        draftSubmission.sections[index]['sectionId']
                                                      );
                                                    }
                                                  }}
                                                  accept={['image/*']}
                                                />
                                              </td> */}
                                            </tr>
                                          </Fragment>
                                        </>
                                      ))}
                                  </>
                                ))}
                              {s?.guestAnswers && Object.keys(s?.guestAnswers).length == 0 && (
                                <tr className="trCls">
                                  <td className="col-12">Not available</td>
                                </tr>
                              )}
                            </Fragment>
                          </tbody>
                        </table>
                      </div>
                      <br />
                    </>
                  ))}
                <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
              </>
            )}
          </Form>
        </Fragment>
      ) : (
        'No Record available'
      )}
    </div>
  );
};

export default QAISubmissionCreate;
