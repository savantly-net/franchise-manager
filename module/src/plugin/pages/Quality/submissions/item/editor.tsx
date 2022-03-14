import { FileMetaData } from '@savantly/sprout-api';
import { getFileService } from '@savantly/sprout-runtime';
import { confirm, FileUploadButton, Form, FormField, Icon, LoadingIcon } from '@sprout-platform/ui';
import { AxiosResponse } from 'axios';
import { css, cx } from 'emotion';
import { Field, FieldArray, FormikHelpers, FormikProps } from 'formik';
import { useFMConfig } from 'plugin/config/useFmConfig';
import { AppModuleRootState, FileItem } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { Alert, Button, ButtonGroup } from 'reactstrap';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
import { QAISection, qaiSectionService } from '../../sections/entity';
import { QAISectionSubmissionEditModel } from '../entity';

const AttachmentList = ({ items, onRemove }: { items: FileItem[]; onRemove: (index: number) => void }) => {
  return (
    <div className="d-flex">
      {items.map((attachment, index) => (
        <div
          className={cx(
            'col-4',
            css`
              text-align: center;
            `
          )}
        >
          <img
            src={attachment.downloadUrl}
            className={css`
              width: 100%;
            `}
          />
          <ButtonGroup>
            <Button onClick={() => window.open(attachment.downloadUrl)}>
              <Icon name="download" />
            </Button>
            <Button
              onClick={() => {
                onRemove(index);
              }}
            >
              <Icon name="times" />
            </Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  );
};

const AnswerGroupsComponent = ({
  formProps,
  onAddAttachments,
}: {
  formProps: FormikProps<QAISectionSubmissionEditModel>;
  onAddAttachments: (files: FileList, groupIndex: number, index: number) => void;
}) => {
  const fileService = getFileService();
  return (
    <FieldArray name="answerGroups">
      {answerGroupFieldArrayProps => (
        <Fragment>
          {formProps.values.answerGroups &&
            formProps.values.answerGroups.map((g, groupIndex) => (
              <div className="mb-2">
                <h5>{g.groupName}</h5>
                <table className="table table-hover">
                  <tbody>
                    <FieldArray name={`answerGroups.${groupIndex}.answers`}>
                      {answerFieldArrayProps => (
                        <Fragment>
                          {g.answers.map((q, index) => (
                            <Fragment>
                              <tr className="d-flex">
                                <td className="col-1">{index + 1}.</td>
                                <td className="col-1">{q.points}pts.</td>
                                <td className="col-6">
                                  <input
                                    hidden={true}
                                    readOnly={true}
                                    name={`answerGroups.${groupIndex}.answers.${index}.questionId`}
                                    value={q.questionId}
                                  />
                                  <span>{q.questionText}</span>
                                </td>
                                <td className="col-2">
                                  <Field
                                    className="form-control"
                                    name={`answerGroups.${groupIndex}.answers.${index}.value`}
                                    as="select"
                                  >
                                    <option></option>
                                    <option value="NA">N/A</option>
                                    <option value="YES">Yes</option>
                                    <option value="NO">No</option>
                                  </Field>
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
                                        onAddAttachments(value.files, groupIndex, index);
                                      }
                                    }}
                                    accept={['image/*']}
                                  />
                                </td>
                              </tr>
                              {q.attachments.length > 0 && (
                                <tr className="d-flex">
                                  <td className="col-12">
                                    <FieldArray name={`answerGroups.${groupIndex}.answers.${index}.attachments`}>
                                      {attachmentFieldArrayProps => (
                                        <AttachmentList
                                          items={q.attachments}
                                          onRemove={attIndex => {
                                            confirm({
                                              message: 'Remove this attachment?',
                                            }).then(result => {
                                              if (result) {
                                                console.log(`removing attachment ${attIndex}`);
                                                fileService
                                                  .deleteFileByPath(q.attachments[attIndex].id)
                                                  .then(response => {
                                                    attachmentFieldArrayProps.remove(attIndex);
                                                  });
                                              }
                                            });
                                          }}
                                        />
                                      )}
                                    </FieldArray>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          ))}
                        </Fragment>
                      )}
                    </FieldArray>
                  </tbody>
                </table>
              </div>
            ))}
        </Fragment>
      )}
    </FieldArray>
  );
};

export interface QAISubmissionEditorProps {
  initialValue: QAISectionSubmissionEditModel;
  onSubmit: (value: QAISectionSubmissionEditModel, helpers: FormikHelpers<QAISectionSubmissionEditModel>) => void;
  onCancel: () => void;
  sectionData: any;
}
type SectionStateType = QAISection | undefined;
export const QAISubmissionEditor = ({ initialValue, onSubmit, onCancel, sectionData }: QAISubmissionEditorProps) => {
  const submissionState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiSubmissions);
  const [sectionState, setSectionState] = useState(undefined as SectionStateType);
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const [draftSubmission] = useState(initialValue);

  const [attachmentFolder, setAttachmentFolder] = useState(undefined as FileMetaData | undefined);
  const [creatingAttachmentFolder, setCreatingAttachmentFolder] = useState(false);

  const fileService = getFileService();
  const fmConfig = useFMConfig();

  useMemo(() => {
    if (!attachmentFolder && !creatingAttachmentFolder && fmConfig) {
      setCreatingAttachmentFolder(true);
      fileService
        .getFilesByPath(fmConfig.rootFolder.id)
        .then(response => {
          const found = response.data.children.filter(f => f.name === draftSubmission.itemId);
          if (found && found.length > 0) {
            setAttachmentFolder(found[0]);
            setCreatingAttachmentFolder(false);
          } else {
            fileService
              .createFile({
                name: draftSubmission.itemId,
                isDir: true,
                parent: fmConfig.rootFolder.id,
              })
              .then(response => {
                setAttachmentFolder(response.data);
                setCreatingAttachmentFolder(false);
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
  }, [attachmentFolder, creatingAttachmentFolder, draftSubmission.itemId, fileService, fmConfig]);

  useMemo(() => {
    if (!sectionState && initialValue.sectionId) {
      qaiSectionService
        .getById(initialValue.sectionId)
        .then(response => {
          setSectionState(response.data);
        })
        .catch(err => {
          console.error(err);
          setError('There was a problem retrieving the Section Definition. Check the logs');
        });
    }
    if (!categoryState.isFetched && !categoryState.isFetching) {
      dispatch(qaiQuestionCategoryStateProvider.loadState());
    }
  }, [initialValue, sectionState, categoryState, dispatch]);

  const showLoading = categoryState.isFetching || submissionState.isFetching;

  return (
    <div>
      {error && <Alert color="warning">{error}</Alert>}
      <div>{showLoading && <LoadingIcon className="m-auto" />}</div>
      <div className="mb-2">
        {sectionState && draftSubmission && (
          <Fragment>
            <h5>Details</h5>
            <Form initialValues={draftSubmission} onSubmit={onSubmit} onCancel={onCancel}>
              {props => (
                <Fragment>
                  <Prompt message="Are you sure to want to leave without saving?" when={props.dirty} />
                  {sectionState && sectionState.requireStaffAttendance && (
                    <FormField name="staffAttendance.one" label="Staff Attendance" />
                  )}
                  <FormField name="managerOnDuty" label="Manager on Duty" />
                  <AnswerGroupsComponent
                    formProps={props}
                    onAddAttachments={(files, groupIndex, answerIndex) => {
                      if (attachmentFolder && files) {
                        const fileUploads: Array<Promise<AxiosResponse<FileMetaData>>> = [];
                        for (let index = 0; index < files.length; index++) {
                          const file = files[index];
                          fileUploads.push(
                            fileService.uploadFile(
                              {
                                name: file.name,
                                isDir: false,
                                parent: props.values.itemId,
                              },
                              file
                            )
                          );
                        }
                      }
                    }}
                  />
                </Fragment>
              )}
            </Form>
          </Fragment>
        )}
      </div>
    </div>
  );
};
