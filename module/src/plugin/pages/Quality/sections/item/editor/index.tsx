import { AddIcon, DeleteIcon, DragHandleIcon } from '@chakra-ui/icons';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { confirm, FormField, ItemEditorProps } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';
import FormikTextInput from 'plugin/component/FormikTextInput';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { QAQuestionCategory, qaQuestionCategoryStateProvider } from '../../../categories/entity';
import {
  QASection as EntityClass,
  QASection,
  qaSectionService as service,
  qaSectionStateProvider as stateProvider,
} from '../../entity';
import './styles.scss';

const QuestionEditor = (props: FormikProps<QASection>) => {
  const dispatch = useDispatch();
  const categoryState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.qaQuestionCategories);

  useMemo(() => {
    if (!categoryState.isFetched && !categoryState.isFetching) {
      dispatch(qaQuestionCategoryStateProvider.loadState());
    }
  }, [categoryState, dispatch]);

  const onDragEnd = (result: any, provided: any, move: any) => {
    const { source, destination } = result;
    move(source.index, destination.index);
  };

  return (
    <FieldArray name="questions">
      {({ insert, remove, push, move }) => (
        <Box p={4}>
          <div>
            <Text fontSize="l">Inspection Questions</Text>
          </div>
          <div>
            <DragDropContext onDragEnd={(result: any, provided: any) => onDragEnd(result, provided, move)}>
              <Table>
                <TableCaption>
                  Add a new inspection question{' '}
                  <IconButton
                    aria-label="Add Inspection Question"
                    icon={<AddIcon />}
                    onClick={() => {
                      push({
                        order: 0,
                        text: '',
                        categoryId: '',
                        points: 2,
                      });
                    }}
                  />
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Order</Th>
                    <Th>Question Text</Th>
                    <Th className="QAI__table__col__category">Category</Th>
                    <Th className="QAI__table__col__tags">Tags</Th>
                    <Th className="QAI__table__col__points">Points</Th>
                    <Th className="QAI__table__col__actions">Actions</Th>
                  </Tr>
                </Thead>
                <Droppable droppableId="droppable-questions" type="QUESTION">
                  {(provided, snapshot) => (
                    <Tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {props.values.questions &&
                        props.values.questions.length > 0 &&
                        props.values.questions.map((question, index) => (
                          <Draggable key={`${index}`} draggableId={`${index}`} index={index}>
                            {(provided, snapshot) => (
                              <Tr hover tabIndex={-1} key={index} ref={provided.innerRef} {...provided.draggableProps}>
                                <Td {...provided.dragHandleProps}>
                                  <DragHandleIcon />
                                </Td>
                                <Td className="col-1">
                                  <Field
                                    name={`questions.${index}.order`}
                                    value={index + 1}
                                    p={1}
                                    disabled
                                    className={cx(
                                      'form-control',
                                      css`
                                        text-align: center;
                                        padding: 0;
                                      `
                                    )}
                                  />
                                </Td>
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
                                  <FormField
                                    className={cx(
                                      'form-group',
                                      css`
                                        padding: 0;
                                      `
                                    )}
                                    as="select"
                                    required
                                    name={`questions.${index}.categoryId`}
                                  >
                                    <Fragment>
                                      <option></option>
                                      {categoryState.response?.content &&
                                        categoryState.response.content.map((t: QAQuestionCategory, index: number) => (
                                          <option key={index} value={t.id?.itemId}>
                                            {t.name}
                                          </option>
                                        ))}
                                    </Fragment>
                                  </FormField>
                                </Td>
                                <Td>
                                  <Field name={`questions.${index}.tags`} p={1} component={FormikTextInput} />
                                </Td>
                                <Td>
                                  <Field name={`questions.${index}.points`} p={1} component={FormikTextInput} />
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
                            )}
                          </Draggable>
                        ))}
                    </Tbody>
                  )}
                </Droppable>
              </Table>
            </DragDropContext>
          </div>
        </Box>
      )}
    </FieldArray>
  );
};

const GuestQuestionEditor = (props: FormikProps<QASection>) => {
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

export const QASectionEditor = ({ item, afterSave }: ItemEditorProps<EntityClass>) => {
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
          values.questions.map((q, idx) => {
            q.order = idx + 1;
          });
          values.guestQuestions.map((q, idx) => {
            q.order = idx + 1;
          });
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
            <FormField name="order" label="Order" wrapperProps={wrapperProps} />
            <FormField name="name" label="Name" wrapperProps={wrapperProps} />
            <FormField
              name="requireStaffAttendance"
              label="Require Staff Attendance Log"
              wrapperProps={wrapperProps}
              as="select"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
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
