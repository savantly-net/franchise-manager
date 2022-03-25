import { Table, Td, Tr } from '@chakra-ui/react';
import { dateTimeForTimeZone, FileMetaData } from '@savantly/sprout-api';
import { getFileService, getUserContextService } from '@savantly/sprout-runtime';
import { FileUploadButton, Form, FormField, Icon, LoadingIcon } from '@sprout-platform/ui';
import { AxiosResponse } from 'axios';
import { useFMConfig } from 'plugin/config/useFmConfig';
import { LocationSelector } from 'plugin/pages/Locations/Stores/component/LocationSelector';
import { AppModuleRootState, FileItem } from 'plugin/types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
import { qaiSectionStateProvider } from '../../sections/entity';
import { QAISectionSubmission, qaiSubmissionService, qaiSubmissionStateProvider } from '../entity';

const QAISubmissionCreate = () => {
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [error, setError] = useState('');
  const fileService = getFileService();
  const userContext = getUserContextService().getUserContext();
  const [attachmentFolder, setAttachmentFolder] = useState(undefined as FileMetaData | undefined);
  const fmConfig = useFMConfig();

  const [categoryList, setCategoryList] = useState<any>();
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
      dispatch(qaiSubmissionStateProvider.loadState());
      // qaiQuestionCategoryStateProvider.props.entityService
      //   .load()
      //   .then((response: any) => {
      //     setCategoryList(response?.data.content);
      //   })
      //   .catch(err => {
      //     setError('Could not create attachment folder');
      //   });
      if (!sectionState.isFetched && !sectionState.isFetching) {
        dispatch(qaiSectionStateProvider.loadState());
      }
    }
    if (categoryState?.response) {
      setCategoryList(categoryState?.response?.content);
    }
  }, [sectionState, categoryState, dispatch]);

  const showLoading = sectionState.isFetching || categoryState.isFetching || submissionState.isFetching;

  const getCategory = (categoryId: string) => {
    let searchCategory: any;
    if (categoryList) {
      searchCategory = categoryList.find((temp: any) => temp.itemId === categoryId);
    }
    return searchCategory?.name ? searchCategory?.name : 'Unknown Category';
  };

  const checkFolderCreated = (itemId: string) => {
    if (fmConfig && fmConfig?.rootFolder) {
      fileService
        .getFilesByPath(fmConfig.rootFolder.id)
        .then(response => {
          const found = response.data.children.filter(f => f.name === itemId);
          if (found && found.length > 0) {
            setAttachmentFolder(found[0]);
          } else {
            fileService
              .createFile({
                name: itemId,
                isDir: true,
                parent: fmConfig.rootFolder.id,
              })
              .then(response => {
                setAttachmentFolder(response.data);
              })
              .catch(err => {
                setError(err.message || 'Could not create attachment folder');
              });
          }
        })
        .catch(err => {
          setError(err.message || 'Could not retrieve attachment folders');
        });
    }
  };

  const fileUpload = async (props: any, value: any, sectionidx: number, idx: number, sectionId: string) => {
    if (value.files) {
      const fileUploads: Array<Promise<AxiosResponse<FileMetaData>>> = [];
      for (let index = 0; index < value.files.length; index++) {
        const file = value.files[index];
        try {
          await fileUploads.push(
            fileService.uploadFile(
              {
                name: file.name,
                isDir:
                  attachmentFolder !== undefined && Object.keys(attachmentFolder).length > 0
                    ? attachmentFolder.isDir
                    : false,
                parent:
                  attachmentFolder !== undefined &&
                  Object.keys(attachmentFolder).length > 0 &&
                  attachmentFolder !== undefined
                    ? attachmentFolder.name
                    : sectionId,
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
          const attachments = [...draftSubmission.sections[sectionidx]['answers'][idx]['attachments'], ...newFiles];
          props.setFieldValue(`sections.${sectionidx}.answers.${idx}.attachments`, attachments);
        });
      }
    }
  };

  useEffect(() => {
    if (sectionState?.response) {
      let sections: any = [];
      sectionState?.response.map((item: any, i: number) => {
        sections[i] = {};
        sections[i].sectionId = item.itemId;
        sections[i].locationId = selectedLocation;
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
        locationId: selectedLocation,
        dateScored: '',
        managerOnDuty: '',
        fsc: userContext?.user?.name ? userContext?.user?.name : '',
        responsibleAlcoholCert: '',
        sections: sections,
      });
    }
  }, [sectionState, selectedLocation, userContext]);

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

  return (
    <div>
      {error && <Alert color="warning">{error}</Alert>}
      {draftSubmission.sections.length > 0 ? (
        <Fragment>
          <Form
            initialValues={draftSubmission}
            onSubmit={async (values: QAISectionSubmission, { resetForm }) => {
              setError('');
              values.locationId = selectedLocation;
              values.dateScored = dateTimeForTimeZone(values.dateScored).toISOString();
              values.sections?.map((submitData: any = {}) => {
                submitData.dateScored = values.dateScored;
                submitData.locationId = values.locationId;
                submitData.managerOnDuty = values.managerOnDuty;
              });

              qaiSubmissionService
                .create(values)
                .then(response => {
                  dispatch(qaiSectionStateProvider.loadState());
                  dispatch(qaiSubmissionStateProvider.loadState());
                  navigate(`../item/${response.data.id}`);
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
                <Fragment>
                  <div className="d-flex mb-3">
                    <div className="col-4 location-select">
                      <label>Select Location</label>
                      <LocationSelector
                        initialValue={selectedLocation}
                        onChange={value => {
                          setSelectedLocation(value);
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
                  draftSubmission?.sections.map((sectionObj: any, index: number) => (
                    <>
                      <div className="mb-3 col-12">
                        <h1 className="section-name">
                          Section {index + 1}: {sectionObj?.name}
                        </h1>
                        <hr className="mb-2 mt-2" />
                        <Fragment>
                          {sectionObj?.answers &&
                            sectionObj?.answers
                              .sort((next: any, prev: any) => next.order - prev.order)
                              .map((question: any, idx: number) => (
                                <>
                                  {idx === 0 && <h1 className="category-name">{getCategory(question.categoryId)}</h1>}
                                  <table
                                    style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }}
                                    className="table-count"
                                  >
                                    <tbody>
                                      <Fragment>
                                        <tr>
                                          <td className="col-1">
                                            {index + 1}.{question.order}
                                          </td>
                                          <td className="col-4">{question.text}</td>
                                          <td className="col-1">{question.points}</td>
                                          <td className="col-2 ">
                                            <Fragment>
                                              <FormField
                                                name={`sections.${index}.answers.${idx}.value`}
                                                className="mb-1"
                                                as="select"
                                              >
                                                <option></option>
                                                <option value="YES">Yes</option>
                                                <option value="NO">No</option>
                                                <option value="NA">N/A</option>
                                              </FormField>
                                            </Fragment>
                                          </td>

                                          <td className="col-2">
                                            <FileUploadButton
                                              buttonContent={
                                                <Fragment>
                                                  <Icon
                                                    onClick={value => {
                                                      checkFolderCreated(sectionObj.sectionId);
                                                    }}
                                                    name="paperclip"
                                                  ></Icon>
                                                  <span>Attach</span>
                                                </Fragment>
                                              }
                                              onCancel={() => {}}
                                              onConfirm={async value => {
                                                setTimeout(function() {
                                                  fileUpload(props, value, index, idx, sectionObj.sectionId);
                                                }, 5000);
                                              }}
                                              accept={['image/*']}
                                            />
                                          </td>
                                        </tr>

                                        {props.values.sections[index]['answers'][idx]['value'] === 'NO' && (
                                          <tr>
                                            <td colSpan={2}>Notes</td>
                                            <td colSpan={3}>
                                              <FormField
                                                placeholder="notes"
                                                name={`sections.${index}.answers.${idx}.notes`}
                                              />
                                            </td>
                                          </tr>
                                        )}
                                      </Fragment>
                                    </tbody>
                                  </table>
                                </>
                              ))}
                        </Fragment>
                        {sectionObj?.guestAnswers && Object.keys(sectionObj?.guestAnswers).length > 0 && (
                          <>
                            <h1 className="category-name">Guest Question</h1>
                            <table style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }} className="table-count">
                              <thead>
                                <tr className="trCls">
                                  <th className="col-4">Question</th>
                                  <th className="col-2">Guest 1</th>
                                  <th className="col-2">Guest 2</th>
                                  <th className="col-2">Guest 3</th>
                                </tr>
                              </thead>
                              <tbody>
                                <Fragment>
                                  {sectionObj?.guestAnswers &&
                                    sectionObj?.guestAnswers.map((Qanswer: any, idGusts: number) => (
                                      <>
                                        <Fragment>
                                          <tr>
                                            <td className="col-3">{Qanswer.notes}</td>
                                            {Qanswer?.answers &&
                                              Qanswer.answers.map((Questquestion: any, idGust: number) => (
                                                <>
                                                  <td className="col-2 ">
                                                    <Fragment>
                                                      <FormField
                                                        name={`sections.${index}.guestAnswers.${idGusts}.answers.${idGust}.value`}
                                                        className="mb-1"
                                                        as="select"
                                                      >
                                                        <option></option>
                                                        <option value="YES">Yes</option>
                                                        <option value="NO">No</option>
                                                        <option value="NA">N/A</option>
                                                      </FormField>
                                                    </Fragment>
                                                  </td>
                                                </>
                                              ))}
                                          </tr>
                                        </Fragment>
                                      </>
                                    ))}
                                </Fragment>
                              </tbody>
                            </table>
                          </>
                        )}
                      </div>
                      {sectionObj?.requireStaffAttendance && sectionObj.requireStaffAttendance === true && (
                        <>
                          <p className="ml-3">Staff Attendance</p>
                          <div className="d-flex mb-3">
                            <div className="col-4">
                              <FormField placeholder="Cashiers" name={`sections.${index}.staffAttendance.Cashiers`} />
                            </div>
                            <div className="col-4">
                              <FormField
                                placeholder="Bartenders"
                                name={`sections.${index}.staffAttendance.Bartenders`}
                              />
                            </div>
                            <div className="col-4">
                              <FormField
                                placeholder="Line Cooks"
                                name={`sections.${index}.staffAttendance.Line Cooks`}
                              />
                            </div>
                          </div>
                          <div className="d-flex ">
                            <div className="col-4">
                              <FormField placeholder="Prep" name={`sections.${index}.staffAttendance.Prep`} />
                            </div>
                            <div className="col-4">
                              <FormField
                                placeholder="Dish/Busser"
                                name={`sections.${index}.staffAttendance.Dish/Busser`}
                              />
                            </div>
                            <div className="col-4">
                              <FormField placeholder="Expo" name={`sections.${index}.staffAttendance.Expo`} />
                            </div>
                          </div>
                        </>
                      )}
                      <br />
                    </>
                  ))}
                <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
              </>
            )}
          </Form>
          {scoreDisplay(draftSubmission.sections)}
        </Fragment>
      ) : (
        'No Record available'
      )}
    </div>
  );
};

export default QAISubmissionCreate;
