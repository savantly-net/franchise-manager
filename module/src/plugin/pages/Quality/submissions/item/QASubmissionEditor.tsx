/* eslint-disable no-console */
import { FileMetaData, publishErrorNotification, publishSuccessNotification } from '@savantly/sprout-api';
import { getUserContextService } from '@savantly/sprout-runtime';
import { FileUploadButton, Form, FormField, Icon, LoadingIcon } from '@sprout-platform/ui';
import { cx } from 'emotion';
import { FormikProps } from 'formik';
import { LocationSelectorField } from 'plugin/component/LocationSelector/LocationSelectorField';
import { useFMConfig } from 'plugin/config/useFmConfig';
import { fmFileService, PostDataResponse } from 'plugin/services/fmFileService';
import { FileItem } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { QAQuestionCategory } from '../../categories/entity';
import { useQAQuestionCategories } from '../../categories/hooks';
import { QAQuestion, QASection, qaSectionStateProvider } from '../../sections/entity';
import { useQASections } from '../../sections/hooks';
import {
  QAGuestQuestionAnswer,
  QAGuestQuestionAnswerGroup,
  QAQuestionAnswer,
  QASectionSubmission,
  qaService,
  QASubmission,
  qaSubmissionStateProvider,
} from '../entity';

interface ImagePreviewUrlItem {
  image: string | ArrayBuffer | null;
  type: string;
}
type ImagePreviewUrls = Record<string, ImagePreviewUrlItem>;

export interface QASubmissionEditorProps {
  draftSubmission: QASubmission;
  onChange: (values: QASubmission) => void;
  beforeSubmit?: (values: QASubmission) => boolean;
  afterSubmit?: (submissionId?: string) => void;
  formDataReset: (value: any) => void;
}
const QASubmissionEditor = (props: QASubmissionEditorProps) => {
  const { draftSubmission, formDataReset } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allQASections = useQASections();
  const allQAQuestionCategories = useQAQuestionCategories();
  const [error, setError] = useState('');
  const fileService = fmFileService;
  const userContext = getUserContextService().getUserContext();
  const [attachmentFolder, setAttachmentFolder] = useState<FileMetaData | undefined>();
  const fmConfig = useFMConfig();
  const [showLoading, setShowLoading] = useState(true);

  useMemo(() => {
    const isLoading = !allQASections || !allQAQuestionCategories || !userContext;
    setShowLoading(isLoading);
  }, [allQASections, allQAQuestionCategories, userContext]);

  useMemo(() => {
    const draftSubmissionId = draftSubmission.id;
    if (draftSubmissionId && fmConfig && fmConfig.qaiFolder && !attachmentFolder) {
      const parentFolderId = fmConfig.qaiFolder.id;
      fileService
        .getFilesByPath(parentFolderId)
        .then(response => {
          const found = response.data.children.filter(f => f.name === draftSubmissionId);
          if (found && found.length > 0) {
            setAttachmentFolder(found[0]);
          } else {
            fileService
              .createFile({
                name: draftSubmissionId,
                isDir: true,
                parent: parentFolderId,
              })
              .then(response => {
                setAttachmentFolder(response.json);
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
  }, [draftSubmission, fmConfig, attachmentFolder, fileService]);

  const getQuestionBySectionIdAndQuestionId = (sectionId: string, questionId: string): QAQuestion | undefined => {
    let searchSection: QASection | undefined;
    if (allQAQuestionCategories) {
      searchSection = allQASections?.find((temp: QASection) => temp.itemId === sectionId);
    }
    let question: QAQuestion | undefined;
    if (searchSection) {
      question = searchSection.questions.find((temp: QAQuestion) => temp.itemId === questionId);
    }
    return question;
  };

  const getCategoryName = (categoryId: string) => {
    let searchCategory: QAQuestionCategory | undefined;
    if (allQAQuestionCategories) {
      searchCategory = allQAQuestionCategories.find((temp: QAQuestionCategory) => temp.itemId === categoryId);
    }
    return searchCategory?.name || 'Unknown Category';
  };

  const getSectionName = (sectionId: string) => {
    let searchSection: QASection | undefined;
    if (allQASections) {
      searchSection = allQASections.find((temp: QASection) => temp.itemId === sectionId);
    }
    return searchSection?.name || 'Unknown Section';
  };

  const sectionRequiresStaffAttendance = (sectionId?: string): boolean => {
    let searchSection: QASection | undefined;
    if (allQASections) {
      searchSection = allQASections?.find((temp: any) => temp.itemId === sectionId);
    }
    return searchSection?.requireStaffAttendance || false;
  };

  const fileUpload = async (
    props: FormikProps<QASubmission>,
    value: {
      files: FileList;
    },
    sectionidx: number,
    answerIndex: number,
    answerItemId: any,
    readerResult: any,
    fileType: any,
    sectionOrder: number,
    questionOrder: number
  ) => {
    console.info('checking for files to upload', value);
    if (value.files) {
      const fileUploads: Array<Promise<PostDataResponse>> = [];
      for (let index = 0; index < value.files.length; index++) {
        const file = value.files[index];
        try {
          await fileUploads.push(
            fileService.uploadFile(
              {
                name: `${sectionOrder}.${questionOrder}-${file.name}`,
                isDir: false,
                parent: attachmentFolder?.id || 'unknown-qa',
              },
              file
            )
          );
        } catch (e) {
          setError('error' + e);
        }
        Promise.all(fileUploads)
          .then(responses => {
            const successFiles = responses.filter(r => r.status >= 200 && r.status < 300);
            if (successFiles.length === 0) {
              publishErrorNotification('Error while uploading files');
            } else {
              const newFiles: FileItem[] = successFiles.map(f => {
                return {
                  id: f.json.id,
                  name: f.json.name,
                  contentType: `image/${f.json.ext}`,
                  downloadUrl: `${f.json.downloadUrl}`,
                };
              });
              const attachments = [
                ...draftSubmission.sections[sectionidx]['answers'][answerIndex]['attachments'],
                ...newFiles,
              ];

              setImagePreviewState({
                ...imagePreviewState,
                [answerItemId]: {
                  image: readerResult,
                  type: fileType,
                },
              });
              publishSuccessNotification('Saved', 'Image saved successfully');
              props.setFieldValue(`sections.${sectionidx}.answers.${answerIndex}.attachments`, attachments);
            }
          })
          .catch(e => {
            publishErrorNotification('Failed', 'Image upload failed');
          });
      }
    }
  };

  const [imagePreviewState, setImagePreviewState] = useState<ImagePreviewUrls>({});

  const removeImage = (props: any, sectionidx: number, idx: number, sectionId: any) => {
    let images = imagePreviewState;
    if (images[sectionId]) {
      delete images[sectionId];
      setImagePreviewState({
        ...images,
      });
    }
    props.setFieldValue(`sections.${sectionidx}.answers.${idx}.attachments`, []);
    draftSubmission.sections[sectionidx].answers[idx].attachments = [];
  };

  const attachmentIsAnImage = (attachment: FileItem): boolean => {
    if (attachment.contentType && attachment.contentType.split('/')[0] === 'image') {
      return true;
    }
    return false;
  };

  const formatTags = (tags: string): string => {
    if (!tags || tags === '') {
      return tags;
    }
    const pairs = tags.split(',');
    const identifiers = pairs.map(p => {
      if (p) {
        const parts = p.split('|');
        return parts[0];
      } else {
        return '';
      }
    });
    return identifiers.join(',');
  };

  let categoryManage = '';
  return (
    <div>
      {draftSubmission! && !showLoading ? (
        <Fragment>
          <Form
            initialValues={draftSubmission}
            enableReinitialize
            validate={values => {
              props.onChange(values);
              return validateSubmission(values);
            }}
            onSubmit={async (values: QASubmission, { resetForm }) => {
              if (props.beforeSubmit && !props.beforeSubmit(values)) {
                console.info('cancelled submit');
              } else {
                setError('');
                values.sections?.map((submitData: QASectionSubmission) => {
                  submitData.dateScored = values.dateScored;
                  submitData.locationId = values.locationId;
                  submitData.managerOnDuty = values.managerOnDuty;
                });
                console.info('logging payload in case of failure');
                console.debug(values);
                qaService
                  .createWithoutFollow(values)
                  .then(response => {
                    if (response && response.id) {
                      dispatch(qaSectionStateProvider.loadState());
                      dispatch(qaSubmissionStateProvider.loadState());
                      resetForm();
                      props.afterSubmit && props.afterSubmit(values.id);
                    }
                  })
                  .catch((err: { message: any }) => {
                    setError(err.message || err || 'There was a problem saving the content. Check the logs.');
                  });
              }
            }}
            onCancel={() => {
              console.log('Click on Cancel Button');
              navigate(-1);
            }}
          >
            {(props: FormikProps<QASubmission>) => (
              <>
                <Fragment>
                  <div className="d-flex mb-3">
                    <div className="col-3 location-select">
                      <LocationSelectorField name="locationId" />
                    </div>
                    <div className="col-3">
                      <FormField name={`dateScored`} type="date" label="Audit Date" required="required" />
                    </div>
                    <div className="col-3">
                      <FormField name={`startTime`} label="Start" type="time" className="" required="required" />
                    </div>
                    <div className="col-3">
                      <FormField name={`endTime`} label="End" type="time" className="" required="required" />
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div className="col-3 p-0">
                      <FormField
                        name="managerOnDuty"
                        type="text"
                        label="Manager On Duty"
                        className=""
                        required="required"
                      />
                    </div>
                    <div className="col-3">
                      <FormField name="fsc" type="text" label="FSC Conducting" required="required" />
                    </div>
                    <div className="col-3">
                      <FormField name="fsm" type="text" label="Food safety manager on duty" required="required" />
                    </div>
                    <div className="col-3">
                      <FormField
                        name="responsibleAlcoholCert"
                        type="text"
                        label="Reponsibility Alcohol Certificate"
                        placeholder="Name of certificate holder on duty"
                        required="required"
                      />
                    </div>
                  </div>
                </Fragment>
                {draftSubmission &&
                  draftSubmission?.sections.map((sectionObj: QASectionSubmission, index: number) => (
                    <>
                      <div className="mb-3 col-12">
                        <h1 className="section-name">
                          Section {index + 1}: {getSectionName(sectionObj.sectionId!)}
                        </h1>
                        <hr className="mb-2 mt-2" />
                        <Fragment>
                          {sectionObj.answers &&
                            sectionObj.answers
                              .sort((next: any, prev: any) => next.order - prev.order)
                              .sort((next: any, prev: any) => {
                                const cat1 = getQuestionBySectionIdAndQuestionId(
                                  sectionObj.sectionId!,
                                  next.questionId!
                                );
                                const cat2 = getQuestionBySectionIdAndQuestionId(
                                  sectionObj.sectionId!,
                                  prev.questionId!
                                );
                                var nameA = cat1?.categoryId.toLowerCase(),
                                  nameB = cat2?.categoryId.toLowerCase();
                                if (nameA! < nameB!) {
                                  return -1;
                                }
                                if (nameA! > nameB!) {
                                  return 1;
                                }
                                return 0;
                              })
                              .map((answer: QAQuestionAnswer, idx: number) => {
                                const question = getQuestionBySectionIdAndQuestionId(
                                  sectionObj.sectionId!,
                                  answer.questionId!
                                );
                                if (!question) {
                                  return <></>;
                                } else {
                                  return (
                                    <>
                                      {categoryManage !== question.categoryId &&
                                        ((categoryManage = question.categoryId),
                                        (<h1 className="category-name">{getCategoryName(question.categoryId)}</h1>))}
                                      <table
                                        className="hideAttatchThumbRemoveIcon"
                                        style={{
                                          marginTop: '5px',
                                          border: '1px solid #D0D7DE',
                                          width: '100%',
                                          tableLayout: 'fixed',
                                        }}
                                      >
                                        <tbody>
                                          <Fragment>
                                            <tr>
                                              <td className="col-1">
                                                <p>
                                                  {index + 1}.{idx + 1} {formatTags(question.tags)}
                                                </p>
                                              </td>
                                              <td className="col-4">{question.text}</td>
                                              <td className="col-1">{question.points}</td>
                                              <td className="col-2">
                                                <Fragment>
                                                  <FormField
                                                    name={`sections.${index}.answers.${idx}.value`}
                                                    className="mb-1"
                                                    as="select"
                                                    required="required"
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
                                                      <Icon name="paperclip"></Icon>
                                                      <span>Attach</span>
                                                    </Fragment>
                                                  }
                                                  onCancel={() => {}}
                                                  onConfirm={async value => {
                                                    let reader = new FileReader();
                                                    let file = value.files[0];
                                                    reader.onloadend = () => {
                                                      console.log('Image preview');
                                                    };
                                                    reader.readAsDataURL(file);
                                                    setTimeout(function() {
                                                      fileUpload(
                                                        props,
                                                        value,
                                                        index,
                                                        idx,
                                                        answer.itemId,
                                                        reader.result,
                                                        file.type.split('/')[0],
                                                        sectionObj?.order,
                                                        question?.order
                                                      );
                                                    }, 1000);
                                                  }}
                                                  accept={['image/*']}
                                                />
                                              </td>
                                              <td className="col-2" rowSpan={2}>
                                                {imagePreviewState[answer.itemId] &&
                                                imagePreviewState[answer.itemId].type === 'image' ? (
                                                  <img
                                                    src={imagePreviewState[answer.itemId].image as string}
                                                    height="40px"
                                                    width="100%"
                                                  />
                                                ) : answer.attachments.length > 0 &&
                                                  attachmentIsAnImage(answer.attachments[0]) ? (
                                                  <img
                                                    src={`${window.location.origin}${answer.attachments[0].downloadUrl}`}
                                                    height="40px"
                                                    width="100%"
                                                  />
                                                ) : (
                                                  <Icon name="image" style={{ fontSize: '2.875em', color: '#eee' }} />
                                                )}
                                              </td>
                                              <td className="col-1">
                                                {imagePreviewState[answer.itemId] &&
                                                imagePreviewState[answer.itemId].type === 'image' ? (
                                                  <Icon
                                                    name="trash-alt"
                                                    className={cx('text-danger', 'mr-4')}
                                                    color="danger"
                                                    onClick={() => {
                                                      removeImage(props, index, idx, answer.itemId);
                                                    }}
                                                    style={{ fontSize: '20px' }}
                                                  ></Icon>
                                                ) : (
                                                  answer.attachments.length > 0 &&
                                                  attachmentIsAnImage(answer.attachments[0]) && (
                                                    <Icon
                                                      name="trash-alt"
                                                      className={cx('text-danger', 'mr-4')}
                                                      color="danger"
                                                      onClick={() => {
                                                        removeImage(props, index, idx, answer.itemId);
                                                      }}
                                                      style={{ fontSize: '20px' }}
                                                    ></Icon>
                                                  )
                                                )}
                                              </td>
                                            </tr>
                                            {(props.values.sections[index].answers[idx]?.value === 'NO' ||
                                              props.values.sections[index].answers[idx]?.value === 'NA') && (
                                              <tr>
                                                <td className="col-1" colSpan={1}>
                                                  Notes
                                                </td>
                                                <td colSpan={4}>
                                                  <FormField
                                                    rows="1"
                                                    as="textarea"
                                                    placeholder="notes"
                                                    required="required"
                                                    name={`sections.${index}.answers.${idx}.notes`}
                                                  />
                                                </td>
                                              </tr>
                                            )}
                                          </Fragment>
                                        </tbody>
                                      </table>
                                    </>
                                  );
                                }
                              })}
                        </Fragment>
                        {sectionObj?.guestAnswers && Object.keys(sectionObj?.guestAnswers).length > 0 && (
                          <>
                            <h1 className="category-name">Guest Question</h1>
                            <table
                              style={{ marginTop: '5px', border: '1px solid #D0D7DE', tableLayout: 'fixed' }}
                              className="table-count tableRowSizeManageGuestQue"
                            >
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
                                    sectionObj?.guestAnswers.map(
                                      (Qanswer: QAGuestQuestionAnswerGroup, idGusts: number) => (
                                        <>
                                          <Fragment>
                                            <tr>
                                              <td className="col-3">{Qanswer.notes}</td>
                                              {Qanswer?.answers &&
                                                Qanswer.answers.map(
                                                  (Questquestion: QAGuestQuestionAnswer, idGust: number) => (
                                                    <>
                                                      <td className="col-2 ">
                                                        <Fragment>
                                                          <FormField
                                                            name={`sections.${index}.guestAnswers.${idGusts}.answers.${idGust}.value`}
                                                            className="mb-1"
                                                            as="select"
                                                            required="required"
                                                          >
                                                            <option></option>
                                                            <option value="YES">Yes</option>
                                                            <option value="NO">No</option>
                                                            <option value="NA">N/A</option>
                                                          </FormField>
                                                        </Fragment>
                                                      </td>
                                                    </>
                                                  )
                                                )}
                                            </tr>
                                          </Fragment>
                                        </>
                                      )
                                    )}
                                </Fragment>
                              </tbody>
                            </table>
                          </>
                        )}
                      </div>
                      {sectionRequiresStaffAttendance(sectionObj.sectionId) === true && (
                        <>
                          <p className="ml-3">Staff Attendance</p>
                          <div className="d-flex mb-3">
                            <div className="col-4">
                              <FormField
                                placeholder="Cashiers"
                                name={`sections.${index}.staffAttendance.Cashiers`}
                                required="required"
                              />
                            </div>
                            <div className="col-4">
                              <FormField
                                placeholder="Bartenders"
                                name={`sections.${index}.staffAttendance.Bartenders`}
                                required="required"
                              />
                            </div>
                            <div className="col-4">
                              <FormField
                                placeholder="Line Cooks"
                                name={`sections.${index}.staffAttendance.Line Cooks`}
                                required="required"
                              />
                            </div>
                          </div>
                          <div className="d-flex ">
                            <div className="col-4">
                              <FormField
                                placeholder="Prep"
                                name={`sections.${index}.staffAttendance.Prep`}
                                required="required"
                              />
                            </div>
                            <div className="col-4">
                              <FormField
                                placeholder="Dish/Busser"
                                name={`sections.${index}.staffAttendance.Dish/Busser`}
                                required="required"
                              />
                            </div>
                            <div className="col-4">
                              <FormField
                                placeholder="Expo"
                                name={`sections.${index}.staffAttendance.Expo`}
                                required="required"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <br />
                    </>
                  ))}
                <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
                <>
                  <div className="d-flex">
                    <div className="col-12 p-0 mb-3">
                      <Button
                        onClick={() => {
                          setImagePreviewState({});
                          formDataReset(props);
                        }}
                        color={`info`}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </>
              </>
            )}
          </Form>
        </Fragment>
      ) : (
        'No Record available'
      )}
      {error && (
        <Alert color="warning" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
};

function validateSubmission(values: QASubmission) {
  const required = 'required';
  const errors: any = {};
  if (values.locationId) {
  } else {
    errors.locationId = required;
  }
  return errors;
}

export default QASubmissionEditor;
