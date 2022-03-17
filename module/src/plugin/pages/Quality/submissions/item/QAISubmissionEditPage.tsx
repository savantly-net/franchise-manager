import { Form, FileUploadButton, FormField, Icon, LoadingIcon } from '@sprout-platform/ui';
import React, { useMemo, useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { useQAISectionSubmission } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { FileMetaData } from '@savantly/sprout-api';
import { AppModuleRootState, FileItem } from 'plugin/types';
import { QAISectionSubmission, qaiSubmissionService, qaiSubmissionStateProvider } from '../entity';
import { qaiSectionStateProvider } from '../../sections/entity';
import { getFileService } from '@savantly/sprout-runtime';
import { AxiosResponse } from 'axios';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
import { useFMConfig } from 'plugin/config/useFmConfig';

const QAISubmissionEditPage = () => {
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const submissionId = useParams().itemId;
  const qaiSectionSubmission = useQAISectionSubmission(submissionId);
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);
  const fileService = getFileService();
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const [sectionList, setSectionList] = useState<any>();
  const [checkData, setCheckData] = useState(false);

  const [attachmentFolder, setAttachmentFolder] = useState(undefined as FileMetaData | undefined);
  const fmConfig = useFMConfig();

  const [draftSubmission, setDraftSubmission] = useState({
    id: '',
    itemId: '',
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
    }
  }, [categoryState, dispatch]);

  useMemo(() => {
    if (!sectionState.isFetched && !sectionState.isFetching) {
      dispatch(qaiSectionStateProvider.loadState());
    }
    if (!categoryState.isFetched && !categoryState.isFetching) {
      dispatch(qaiQuestionCategoryStateProvider.loadState());
      dispatch(qaiSubmissionStateProvider.loadState());
      qaiQuestionCategoryStateProvider.props.entityService
        .load()
        .then((response: any) => {
          setCategoryList(response?.data.content);
        })
        .catch(err => {
          setError('Could not create attachment folder');
        });
    }
    if (sectionState?.response) {
      setSectionList(sectionState?.response);
    }
  }, [sectionState, categoryState, dispatch]);

  const getCategory = (categoryId: string) => {
    const searchCategory: any = categoryList.find((temp: any) => temp.itemId === categoryId);
    return searchCategory?.name ? searchCategory?.name : 'Unknown Category';
  };

  useEffect(() => {
    if (
      qaiSectionSubmission !== undefined &&
      qaiSectionSubmission?.sections !== undefined &&
      Object.keys(qaiSectionSubmission?.sections).length > 0 &&
      checkData === false
    ) {
      setCheckData(true);
      setDraftSubmission({
        id: submissionId,
        itemId: submissionId,
        locationId: qaiSectionSubmission.locationId,
        dateScored: qaiSectionSubmission.dateScored,
        managerOnDuty: qaiSectionSubmission.managerOnDuty,
        fsc: qaiSectionSubmission.fsc,
        responsibleAlcoholCert: qaiSectionSubmission.responsibleAlcoholCert,
        sections: qaiSectionSubmission.sections,
      });
    }
  }, [qaiSectionSubmission, submissionId, checkData]);

  const showLoading = sectionState.isFetching || submissionState.isFetching;

  const getSection = (sectionId: string) => {
    const searchSection: any = sectionList.find((temp: any) => temp.itemId === sectionId);
    return searchSection?.name ? searchSection?.name : 'Unknown Section';
  };
  const getSectionRequireStaffAttendance = (sectionId: string) => {
    const searchSection: any = sectionList.find((temp: any) => temp.itemId === sectionId);
    return searchSection?.requireStaffAttendance ? searchSection?.requireStaffAttendance : false;
  };
  const getQuestions = (questionId: string, dataTt: string) => {
    var questionText: any;
    sectionList.map((temp: any) => {
      temp.questions.map((q: any) => {
        if (q.itemId === questionId) {
          return (questionText = q);
        }
      });
    });
    if (dataTt === 'order') {
      return questionText?.order;
    } else if (dataTt === 'points') {
      return questionText?.points;
    } else {
      return questionText?.text;
    }
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
                console.error(err);
                setError('Could not create attachment folder');
              });
          }
        })
        .catch(err => {
          console.error(err);
          setError('Could not retrieve attachment folders');
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

  return (
    <div>
      {error && <Alert color="warning">{error}</Alert>}
      <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
      <div className="mb-2">
        {draftSubmission.sections && sectionList && Object.keys(draftSubmission?.sections).length > 0 ? (
          <Fragment>
            <Form
              initialValues={draftSubmission}
              onSubmit={async (values: QAISectionSubmission, { resetForm }) => {
                if (values?.itemId !== undefined) {
                  qaiSubmissionService
                    .create(values)
                    .then((response: any) => {
                      dispatch(qaiSubmissionStateProvider.loadState());
                      navigate(-1);
                      resetForm();
                    })
                    .catch((err: any) => {
                      setError(err.message || 'There was a problem saving the content. Check the logs.');
                    });
                }
              }}
              onCancel={() => {
                console.log('Click on Cancel Button');
              }}
            >
              {props => (
                <>
                  {draftSubmission?.sections &&
                    draftSubmission?.sections.map((sectionObj: any, index: number) => (
                      <>
                        <div className="mb-3 col-12">
                          <h1 className="section-name">
                            Section {index + 1}: {getSection(sectionObj.sectionId)}
                          </h1>
                          <hr className="mb-2 mt-2" />
                          <Fragment>
                            {sectionObj?.answers &&
                              sectionObj?.answers.map((question: any, idx: number) => (
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
                                            {sectionObj.order}
                                            {getQuestions(question.questionId, 'order') + '.0'}
                                          </td>
                                          <td className="col-4">{getQuestions(question.questionId, 'text')}</td>
                                          <td className="col-1">{getQuestions(question.questionId, 'points')}</td>
                                          <td className="col-2 ">
                                            <Fragment>
                                              <FormField
                                                name={`sections.${index}.answers.${idx}.value`}
                                                className="mb-1"
                                                as="select"
                                              >
                                                <option value="YES">Yes</option>
                                                <option value="NO">No</option>
                                              </FormField>
                                            </Fragment>
                                          </td>

                                          <td
                                            className="col-2"
                                            onClick={value => {
                                              checkFolderCreated(sectionObj.sectionId);
                                            }}
                                          >
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
                                        {question.value === 'NO' && (
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

                          <h1 className="category-name">Guest Question</h1>
                          <table style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }} className="table-count">
                            {sectionObj?.guestAnswers && Object.keys(sectionObj?.guestAnswers).length > 0 && (
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
                                                      <option value="YES">Yes</option>
                                                      <option value="NO">No</option>
                                                    </FormField>
                                                  </Fragment>
                                                </td>
                                              </>
                                            ))}
                                        </tr>
                                      </Fragment>
                                    </>
                                  ))}
                                {sectionObj?.guestAnswers && Object.keys(sectionObj?.guestAnswers).length === 0 && (
                                  <tr className="trCls">
                                    <td className="col-12">Not available</td>
                                  </tr>
                                )}
                              </Fragment>
                            </tbody>
                          </table>
                        </div>
                        {sectionObj?.staffAttendance &&
                          getSectionRequireStaffAttendance(sectionObj.sectionId) === true && (
                            <>
                              <p className="ml-3">Staff Attendance</p>
                              <FormField placeholder="Cashiers" name={`sections.${index}.staffAttendance.Cashiers`} />
                              <FormField
                                placeholder="Bartenders"
                                name={`sections.${index}.staffAttendance.Bartenders`}
                              />
                              <FormField
                                placeholder="Line Cooks"
                                name={`sections.${index}.staffAttendance.Line Cooks`}
                              />
                              <FormField placeholder="Prep" name={`sections.${index}.staffAttendance.Prep`} />
                              <FormField
                                placeholder="Dish/Busser"
                                name={`sections.${index}.staffAttendance.Dish/Busser`}
                              />
                              <FormField placeholder="Expo" name={`sections.${index}.staffAttendance.Expo`} />
                            </>
                          )}
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
    </div>
  );
};

export default QAISubmissionEditPage;
