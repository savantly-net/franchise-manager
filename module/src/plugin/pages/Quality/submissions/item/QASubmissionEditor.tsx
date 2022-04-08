import { dateTimeForTimeZone, FileMetaData } from '@savantly/sprout-api';
import { getFileService, getUserContextService } from '@savantly/sprout-runtime';
import { FileUploadButton, Form, FormField, Icon, LoadingIcon } from '@sprout-platform/ui';
import { AxiosResponse } from 'axios';
import { FormikProps } from 'formik';
import { useFMConfig } from 'plugin/config/useFmConfig';
import { LocationSelector } from 'plugin/pages/Locations/Stores/component/LocationSelector';
import { FileItem } from 'plugin/types';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { QAQuestionCategory } from '../../categories/entity';
import { useQAQuestionCategories } from '../../categories/hooks';
import { QAQuestion, QASection, qaSectionStateProvider } from '../../sections/entity';
import { useQASections } from '../../sections/hooks';
import { cx } from 'emotion';
import {
  QAGuestQuestionAnswer,
  QAGuestQuestionAnswerGroup,
  QAQuestionAnswer,
  QASectionSubmission,
  qaService,
  QASubmission,
  qaSubmissionStateProvider,
} from '../entity';

export interface QASubmissionEditorProps {
  draftSubmission: QASubmission;
  onChange: (values: QASubmission) => void;
  beforeSubmit?: (values: QASubmission) => boolean;
  afterSubmit?: () => void;
  formDataReset: (value: any) => void;
}
const QASubmissionEditor = (props: QASubmissionEditorProps) => {
  const { draftSubmission, formDataReset } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submissionId = useParams().itemId;
  const allQASections = useQASections();
  const allQAQuestionCategories = useQAQuestionCategories();
  const [selectedLocation, setSelectedLocation] = useState(
    draftSubmission.locationId ? draftSubmission.locationId : ''
  );
  const [error, setError] = useState('');
  const fileService = getFileService();
  const userContext = getUserContextService().getUserContext();
  const [attachmentFolder, setAttachmentFolder] = useState(undefined as FileMetaData | undefined);
  const fmConfig = useFMConfig();

  const showLoading = !allQASections || !allQAQuestionCategories || !userContext;

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

  const checkFolderCreated = (itemId?: string) => {
    if (itemId && fmConfig && fmConfig?.rootFolder) {
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

  const removeImage = (props: any, sectionidx: number, idx: number, sectionId: any) => {
    let images = imagePreviewUrl;
    if (images[sectionId]) {
      delete images[sectionId];
      setImagePreviewUrl({
        ...images,
      });
    }
    props.setFieldValue(`sections.${sectionidx}.answers.${idx}.attachments`, []);
    draftSubmission.sections[sectionidx].answers[idx].attachments = [];
  };

  if (draftSubmission.dateScored) {
    draftSubmission.dateScored = new Date(`${draftSubmission.dateScored}`).toLocaleDateString('fr-CA');
  }

  return (
    <div>
      {draftSubmission ? (
        <Fragment>
          <Form
            initialValues={draftSubmission}
            validate={values => {
              props.onChange(values);
            }}
            onSubmit={async (values: QASubmission, { resetForm }) => {
              if (props.beforeSubmit && !props.beforeSubmit(values)) {
                console.info('cancelled submit');
              } else {
                setError('');
                values.locationId = selectedLocation;
                values.dateScored = dateTimeForTimeZone(values.dateScored).toISOString();
                values.sections?.map((submitData: any = {}) => {
                  submitData.dateScored = values.dateScored;
                  submitData.locationId = values.locationId;
                  submitData.managerOnDuty = values.managerOnDuty;
                });

                qaService
                  .create(values)
                  .then(response => {
                    dispatch(qaSectionStateProvider.loadState());
                    dispatch(qaSubmissionStateProvider.loadState());
                    navigate(`../${response.data.id}/score`);
                    resetForm();
                  })
                  .catch((err: { message: any }) => {
                    setError(err.message || 'There was a problem saving the content. Check the logs.');
                  })
                  .finally(props.afterSubmit);
              }
            }}
            onCancel={() => {
              console.log('Click on Cancel Button');
              navigate(`../list`);
            }}
          >
            {(props: FormikProps<QASubmission>) => (
              <>
                <Fragment>
                  <div className="d-flex mb-3">
                    <div className="col-3 location-select">
                      <label>Select Location</label>
                      <LocationSelector
                        initialValue={selectedLocation}
                        onChange={value => {
                          setSelectedLocation(value);
                        }}
                      />
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
                                      {idx === 0 && (
                                        <h1 className="category-name">{getCategoryName(question.categoryId)}</h1>
                                      )}
                                      <table style={{ marginTop: '5px', border: '1px solid #D0D7DE', width: '100%' }}>
                                        <tbody>
                                          <Fragment>
                                            <tr>
                                              <td className="col-1">
                                                <p>
                                                  {index + 1}.{question.order}
                                                </p>
                                                <p>{question.tags}</p>
                                              </td>
                                              <td className="col-3">{question.text}</td>
                                              <td className="col-1">{question.points}</td>
                                              <td className="col-2 ">
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
                                                      <Icon
                                                        onClick={value => {
                                                          checkFolderCreated(answer.itemId);
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
                                                        [answer.itemId]: {
                                                          image: reader.result,
                                                          type: file.type.split('/')[0],
                                                        },
                                                      });
                                                    };
                                                    reader.readAsDataURL(file);
                                                    setTimeout(function() {
                                                      fileUpload(props, value, index, idx, answer.itemId);
                                                    }, 1000);
                                                  }}
                                                  accept={['image/*']}
                                                />
                                              </td>
                                              <td className="col-2">
                                                {imagePreviewUrl[answer.itemId] &&
                                                imagePreviewUrl[answer.itemId].type === 'image' ? (
                                                  <img
                                                    src={imagePreviewUrl[answer.itemId].image}
                                                    height="40px"
                                                    width="50px"
                                                  />
                                                ) : answer.attachments.length > 0 &&
                                                  answer.attachments[answer.attachments.length - 1][
                                                    'contentType'
                                                  ].split('/')[0] === 'image' ? (
                                                  <img
                                                    src={`${window.location.origin}${
                                                      answer.attachments[answer.attachments.length - 1]['downloadUrl']
                                                    }`}
                                                    height="40px"
                                                    width="50px"
                                                  />
                                                ) : (
                                                  <Icon
                                                    name="image"
                                                    style={{ fontSize: '2.875em', color: '#acb2b9' }}
                                                  />
                                                )}
                                              </td>
                                              <td className="col-1">
                                                <Icon
                                                  name="trash-alt"
                                                  className={cx('text-danger', 'mr-4')}
                                                  color="danger"
                                                  onClick={() => {
                                                    removeImage(props, index, idx, answer.itemId);
                                                  }}
                                                  style={{ fontSize: '20px' }}
                                                ></Icon>
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
                      <>
                        {!submissionId && (
                          <div className="d-flex">
                            <div className="col-12 p-0 mb-3">
                              <Button
                                onClick={() => {
                                  setImagePreviewUrl({});
                                  formDataReset(props);
                                }}
                                color={`info`}
                              >
                                Reset
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
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
      {error && (
        <Alert color="warning" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default QASubmissionEditor;
