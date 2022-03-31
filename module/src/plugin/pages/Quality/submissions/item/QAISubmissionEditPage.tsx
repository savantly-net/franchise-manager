import { FileMetaData } from '@savantly/sprout-api';
import { getFileService } from '@savantly/sprout-runtime';
import { FileUploadButton, Form, FormField, Icon, LoadingIcon } from '@sprout-platform/ui';
import { AxiosResponse } from 'axios';
import { useFMConfig } from 'plugin/config/useFmConfig';
import { AppModuleRootState, FileItem } from 'plugin/types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
import { qaiSectionStateProvider } from '../../sections/entity';
import { QAISectionSubmission, qaiSubmissionService, qaiSubmissionStateProvider } from '../entity';
import { useQAISectionSubmission } from '../hooks';

const QAISubmissionEditPage = () => {
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const submissionId = useParams().itemId;
  const qaiSectionSubmission = useQAISectionSubmission(submissionId);
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const sectionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSections);
  const fileService = getFileService();
  const [categoryList, setCategoryList] = useState<any>();
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
    }
    if (sectionState?.response) {
      setSectionList(sectionState?.response);
    }
    if (categoryState?.response) {
      setCategoryList(categoryState?.response?.content);
    }
  }, [sectionState, categoryState, dispatch]);

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

  const showLoading = sectionState.isFetching || categoryState.isFetching || submissionState.isFetching;

  const getCategory = (questionId: string) => {
    var categoryText: any;
    sectionList.map((temp: any) => {
      temp.questions.map((q: any) => {
        if (q.itemId === questionId && categoryList) {
          categoryList.map((category: any) => {
            if (category.itemId === q.categoryId) {
              return (categoryText = category);
            }
          });
        }
      });
    });
    return categoryText?.name;
  };
  const getSection = (sectionId: string) => {
    const searchSection: any = sectionList.find((temp: any) => temp.itemId === sectionId);
    return searchSection?.name ? searchSection?.name : 'Unknown Section';
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
  const getSectionRequireStaffAttendance = (sectionId: string) => {
    const searchSection: any = sectionList.find((temp: any) => temp.itemId === sectionId);
    return searchSection?.requireStaffAttendance ? searchSection?.requireStaffAttendance : false;
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

  const [imagePreviewUrl, setImagePreviewUrl] = useState<any>({});

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
                setError('');
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
              {(props: any) => (
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
                                  <h1 className="category-name">{getCategory(question.questionId)}</h1>
                                  <table
                                    style={{ marginTop: '5px', border: '1px solid #D0D7DE;' }}
                                    className="table-count"
                                  >
                                    <tbody>
                                      <Fragment>
                                        <tr>
                                          <td className="col-1">
                                            {index + 1}.{getQuestions(question.questionId, 'order')}
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
                                              checkFolderCreated(question.questionId);
                                            }}
                                          >
                                            <FileUploadButton
                                              buttonContent={
                                                <Fragment>
                                                  <Icon
                                                    onClick={value => {
                                                      checkFolderCreated(question.questionId);
                                                    }}
                                                    name="paperclip"
                                                  ></Icon>
                                                  <span>Attach</span>
                                                </Fragment>
                                              }
                                              onCancel={() => {}}
                                              onConfirm={async value => {
                                                let reader = new FileReader();
                                                let file = value.files[0];
                                                reader.onloadend = () => {
                                                  setImagePreviewUrl({
                                                    ...imagePreviewUrl,
                                                    [question.questionId]: reader.result,
                                                  });
                                                };
                                                reader.readAsDataURL(file);
                                                setTimeout(function() {
                                                  fileUpload(props, value, index, idx, question.questionId);
                                                }, 5000);
                                              }}
                                              accept={['image/*']}
                                            />
                                          </td>
                                          <td className="col-2">
                                            <img
                                              src={
                                                imagePreviewUrl[question.questionId]
                                                  ? imagePreviewUrl[question.questionId]
                                                  : question.attachments.length > 0
                                                  ? `${window.location.origin}${question.attachments[0]['downloadUrl']}`
                                                  : ''
                                              }
                                              height="40px"
                                              width="50px"
                                            />
                                          </td>
                                        </tr>
                                        {(props.values.sections[index]['answers'][idx]['value'] === 'NO' ||
                                          question.value === 'NO') && (
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
                                    <td className="col-4">Question</td>
                                    <td className="col-2">Guest 1</td>
                                    <td className="col-2">Guest 2</td>
                                    <td className="col-2">Guest 3</td>
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
                                                          <option value="NA">N/A</option>
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
                                  </Fragment>
                                </tbody>
                              </table>
                            </>
                          )}
                        </div>
                        {sectionObj?.staffAttendance &&
                          getSectionRequireStaffAttendance(sectionObj.sectionId) === true && (
                            <>
                              <p className="ml-3">Staff Attendance</p>
                              <div className="d-flex mb-3">
                                <div className="col-4">
                                  <FormField
                                    placeholder="Cashiers"
                                    name={`sections.${index}.staffAttendance.Cashiers`}
                                  />
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
          </Fragment>
        ) : (
          'No Record available'
        )}
      </div>
    </div>
  );
};

export default QAISubmissionEditPage;
