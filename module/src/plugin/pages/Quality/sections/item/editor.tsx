import { confirm, FormField, Icon, ItemEditorProps } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardBody, Row } from 'reactstrap';
import { qaiQuestionCategoryStateProvider } from '../../categories/entity';
import {
  QAISection as EntityClass,
  QAISection,
  qaiSectionService as service,
  qaiSectionStateProvider as stateProvider,
} from '../entity';

const QuestionEditor = (props: FormikProps<QAISection>) => {
  const dispatch = useDispatch();
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaiQuestionCategories);

  useMemo(() => {
    if (!categoryState.isFetched && !categoryState.isFetching) {
      dispatch(qaiQuestionCategoryStateProvider.loadState());
    }
  }, [categoryState, dispatch]);

  return (
    <FieldArray name="questions">
      {({ insert, remove, push }) => (
        <Fragment>
          <div
            className={cx(
              'mb-2',
              css`
                display: flex;
              `
            )}
          >
            <h4>Inspection Questions</h4>
            <Button
              className="ml-1"
              color="info"
              onClick={() => {
                push({
                  text: '',
                  points: 2,
                });
              }}
            >
              <Icon name="plus" size="1x" />
            </Button>
          </div>
          <div>
            {props.values.questions &&
              props.values.questions.length > 0 &&
              props.values.questions.map((question, index) => (
                <Card className="card mb-1" key={`questions-${index}`}>
                  <CardBody>
                    <Row>
                      <div className=" form-group col-1 d-flex align-items-end">
                        <Button
                          outline={false}
                          color="danger"
                          onClick={() => {
                            confirm({
                              message: 'Delete this question?',
                            }).then(result => {
                              if (result) {
                                remove(index);
                              }
                            });
                          }}
                        >
                          <Icon name="trash" size="1x" />
                        </Button>
                      </div>
                      <div className="form-group col-11">
                        <label htmlFor={`questions.${index}.text`} className="mr-2">
                          Text
                        </label>
                        <Field name={`questions.${index}.text`} className="form-control" />
                      </div>
                    </Row>
                    <Row>
                      <FormField
                        className="form-group col-9"
                        as="select"
                        name={`questions.${index}.categoryId`}
                        label="Category"
                      >
                        <Fragment>
                          <option></option>
                          {categoryState.response?.content &&
                            categoryState.response.content.map((t, index) => (
                              <option key={index} value={t.id?.itemId}>
                                {t.name}
                              </option>
                            ))}
                        </Fragment>
                      </FormField>
                      <div className="form-group col-3">
                        <label htmlFor={`questions.${index}.points`} className="mr-2">
                          Points
                        </label>
                        <Field name={`questions.${index}.points`} className="form-control" type="number" />
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              ))}
          </div>
        </Fragment>
      )}
    </FieldArray>
  );
};

const GuestQuestionEditor = (props: FormikProps<QAISection>) => {
  return (
    <FieldArray name="guestQuestions">
      {({ insert, remove, push }) => (
        <Fragment>
          <div
            className={cx(
              'mb-2',
              css`
                display: flex;
              `
            )}
          >
            <h4>Guest Questions</h4>
            <Button
              className="ml-1"
              color="info"
              onClick={() => {
                push({
                  text: '',
                  points: 2,
                });
              }}
            >
              <Icon name="plus" size="1x" />
            </Button>
          </div>
          <div>
            {props.values.guestQuestions &&
              props.values.guestQuestions.length > 0 &&
              props.values.guestQuestions.map((question, index) => (
                <Card className="card mb-1" key={`guestQuestions-${index}`}>
                  <CardBody>
                    <Row>
                      <div className=" form-group col-1 d-flex align-items-end">
                        <Button
                          outline={false}
                          color="danger"
                          onClick={() => {
                            confirm({
                              message: 'Delete this question?',
                            }).then(result => {
                              if (result) {
                                remove(index);
                              }
                            });
                          }}
                        >
                          <Icon name="trash" size="1x" />
                        </Button>
                      </div>
                      <div className="form-group col-9">
                        <label htmlFor={`guestQuestions.${index}.text`} className="mr-2">
                          Text
                        </label>
                        <Field name={`guestQuestions.${index}.text`} className="form-control" />
                      </div>

                      <div className="form-group col-2">
                        <label htmlFor={`guestQuestions.${index}.points`} className="mr-2">
                          Points
                        </label>
                        <Field name={`guestQuestions.${index}.points`} className="form-control" type="number" />
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              ))}
          </div>
        </Fragment>
      )}
    </FieldArray>
  );
};

export const QAISectionEditor = ({ item, afterSave }: ItemEditorProps<EntityClass>) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || stateProvider.props.initialState.example);
  const [error, setError] = useState('');

  return (
    <Fragment>
      {error && <Alert color="danger">{error}</Alert>}
      <Formik
        initialValues={itemState}
        validate={values => {
          const errors: any = {};
          return errors;
        }}
        validateOnBlur={true}
        onSubmit={(values, helpers) => {
          const promiseToSave = values.itemId ? service.update(values.itemId, values) : service.create(values);
          promiseToSave
            .then(response => {
              helpers.setSubmitting(false);
              helpers.resetForm();
              afterSave(response.data, helpers);
            })
            .catch(err => {
              setError(err.message || err.detail || 'An error occurred while saving.');
            });
        }}
      >
        {(props: FormikProps<EntityClass>) => (
          <Form>
            <Prompt message="You have unsaved changes. Are you sure?" when={props.dirty} />
            <div
              className={css`
                display: flex;
              `}
            >
              <Button className="ml-auto" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button className="ml-2" color="primary" type="submit">
                Save
              </Button>
            </div>
            <FormField name="name" label="Name" wrapperProps={wrapperProps} />
            <FormField
              name="requireStaffAttendance"
              label="Require Staff Attendance Log"
              wrapperProps={wrapperProps}
              as="select"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </FormField>
            <hr />
            <GuestQuestionEditor {...props} />
            <hr />
            <QuestionEditor {...props} />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

const wrapperProps = {
  className: css`
    padding: 0;
  `,
};
