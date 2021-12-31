import { IconButton, Text, Box } from '@chakra-ui/react';
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { confirm, FormField, ItemEditorProps } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';
import FormikTextInput from 'plugin/component/FormikTextInput';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { qaiQuestionCategoryStateProvider } from '../../../categories/entity';
import {
  QAISection as EntityClass,
  QAISection,
  qaiSectionService as service,
  qaiSectionStateProvider as stateProvider,
} from '../../entity';

import './styles.scss';

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
        <Box p={4}>
          <div>
            <Text fontSize="l">Inspection Questions</Text>
          </div>
          <div>
            <Table>
              <TableCaption>
                Add a new inspection question{' '}
                <IconButton
                  aria-label="Add Inspection Question"
                  icon={<AddIcon />}
                  onClick={() => {
                    push({
                      text: '',
                      points: 2,
                    });
                  }}
                />
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Question Text</Th>
                  <Th className="QAI__table__col__category">Category</Th>
                  <Th className="QAI__table__col__points">Points</Th>
                  <Th className="QAI__table__col__actions">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.values.questions &&
                  props.values.questions.length > 0 &&
                  props.values.questions.map((question, index) => (
                    <Tr key={`questions.${index}.text`}>
                      <Td>
                        <Field
                          className={cx(
                            'form-control',
                            css`
                              width: 100%;
                            `
                          )}
                          name={`questions.${index}.text`}
                          as="textarea"
                          rows="2"
                        />
                      </Td>
                      <Td>
                        <FormField className="form-group col-9" as="select" name={`questions.${index}.categoryId`}>
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
                      </Td>
                      <Td>
                        <Field name={`questions.${index}.points`} component={FormikTextInput} />
                      </Td>
                      <Td isNumeric>
                        <IconButton
                          colorScheme="red"
                          aria-label="Delete Question"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            confirm({
                              message: 'Delete this question?',
                            }).then(result => {
                              if (result) {
                                remove(index);
                              }
                            });
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </div>
        </Box>
      )}
    </FieldArray>
  );
};

const GuestQuestionEditor = (props: FormikProps<QAISection>) => {
  return (
    <FieldArray name="guestQuestions">
      {({ insert, remove, push }) => (
        <Box p={4}>
          <div>
            <Text fontSize="l">Guest Questions</Text>
          </div>
          <div>
            <Table>
              <TableCaption>
                Add a new guest question{' '}
                <IconButton
                  aria-label="Add Guest Question"
                  icon={<AddIcon />}
                  onClick={() => {
                    push({
                      text: '',
                      points: 2,
                    });
                  }}
                />
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Question Text</Th>
                  <Th className="QAI__table__col__points">Points</Th>
                  <Th className="QAI__table__col__actions">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.values.guestQuestions &&
                  props.values.guestQuestions.length > 0 &&
                  props.values.guestQuestions.map((question, index) => (
                    <Tr key={`guestQuestions.${index}.text`}>
                      <Td>
                        <Field
                          className={cx(
                            'form-control',
                            css`
                              width: 100%;
                            `
                          )}
                          name={`guestQuestions.${index}.text`}
                          as="textarea"
                          rows="2"
                        />
                      </Td>
                      <Td>
                        <Field name={`guestQuestions.${index}.points`} component={FormikTextInput} />
                      </Td>
                      <Td isNumeric>
                        <IconButton
                          colorScheme="red"
                          aria-label="Delete Question"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            confirm({
                              message: 'Delete this question?',
                            }).then(result => {
                              if (result) {
                                remove(index);
                              }
                            });
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </div>
        </Box>
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
