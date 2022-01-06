import { getApiService } from '@savantly/sprout-runtime';
import { FormField, Icon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { FieldArray, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import TypeAheadSelectField from 'plugin/components/TypeAheadSelectField';
import { UserPicker } from 'plugin/components/UserPicker';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { useAppUsers } from 'plugin/services/userService';
import React, { Fragment, useMemo, useState } from 'react';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'reactstrap';
import { FranchiseGroup, franchiseGroupsStateProvider, groupService, FranchiseGroupMember } from './entity';

export interface FranchiseGroupEditorProps {
  item: FranchiseGroup;
  afterSave: (values: any, helpers: FormikHelpers<any>) => void;
}

export const FranchiseGroupEditor = ({ item, afterSave }: FranchiseGroupEditorProps) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || franchiseGroupsStateProvider.props.initialState.example);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<any>();
  const users = useAppUsers();
  useMemo(() => {
    getApiService()
      .get<FranchiseGroupMember[]>(`${API_URL}/group-members`)
      .then(response => {
        setMembers(response.data);
      })
      .catch(err => {
        setError(err.message || err.detail || 'An error occurred while saving.');
      });
  }, []);

  const RemoveItemButton = ({ remove, index }: { remove: (index: number) => void; index: number }) => {
    return (
      <Icon
        name="trash-alt"
        size={'2x'}
        className={cx('text-danger', 'mb-2')}
        color="danger"
        onClick={() => {
          remove(index);
        }}
      />
    );
  };
  return (
    <Fragment>
      {error && <Alert color="danger">{error}</Alert>}
      <Formik
        initialValues={itemState}
        validate={values => {
          const errors: any = {};
          if (!values.name) {
            errors['name'] = {
              required: 'A name is required',
            };
          }
        }}
        onSubmit={(values, helpers) => {
          const promiseToSave = values.itemId
            ? groupService.update(values.itemId, values)
            : groupService.create(values);
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
        {(props: FormikProps<FranchiseGroup>) => (
          (
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
              <Row>
                <Col>
                  <FormField name="name" label="Name" />
                  <FormField name="address1" label="Address1" />
                  <FormField name="address2" label="Address2" />
                  <FormField name="city" label="City" />
                  <FormField name="state" label="State" />
                  <FormField name="zip" label="Zip" />
                </Col>
                <Col>
                  {itemState && users && (
                    <Fragment>
                      <FieldArray name="members">
                        {({ insert, remove, push }) => (
                          <Fragment>
                            <Row>
                              <Col
                                className={css`
                                  direction: rtl;
                                `}
                              >
                                <Button
                                  className={css`
                                    display: block;
                                    margin: 2em 0;
                                  `}
                                  color="info"
                                  onClick={() => {
                                    push({
                                      itemId: itemState.itemId ? itemState.itemId : '',
                                    });
                                  }}
                                >
                                  Add Member
                                </Button>
                              </Col>
                            </Row>
                            <div className="form-inline p-0">
                              {props?.values?.members && props?.values?.members.length > 0 && (
                                <Row
                                  className={css`
                                    margin-bottom: 1em;
                                    width: 100%;
                                  `}
                                >
                                  <Col>
                                    <label>User</label>
                                  </Col>
                                  <Col>
                                    <label>Role</label>
                                  </Col>
                                  <div
                                    className={css`
                                      width: 0;
                                    `}
                                  >
                                    <label>Delete</label>
                                  </div>
                                </Row>
                              )}
                              {props?.values?.members &&
                                props?.values?.members.length > 0 &&
                                props?.values?.members.map((index: any) => (
                                  <Row
                                    key={`member-${index}`}
                                    className={css`
                                      margin-bottom: 2em;
                                    `}
                                  >
                                    <Col>
                                      <UserPicker name={`members.${index}.userId`} users={users ? users : []} />
                                    </Col>
                                    <Col>
                                      <TypeAheadSelectField
                                        name={`members.${index}.role`}
                                        label=""
                                        items={[
                                          { value: 'PRIMARY_CONTACT' },
                                          { value: 'GNERAL_MANAGER' },
                                          { value: 'FSC' },
                                          { value: 'FAC' },
                                          { value: 'FRANCHISE_OWNER' },
                                          { value: 'FRANCHISE_PARTNER' },
                                          { value: 'DISTRICT_MANAGER' },
                                          { value: 'OTHER' },
                                        ]}
                                      />
                                    </Col>
                                    <Col
                                      className={css`
                                        text-align: center;
                                        padding: 0;
                                      `}
                                    >
                                      <RemoveItemButton index={index} remove={remove} />
                                    </Col>
                                  </Row>
                                ))}
                            </div>
                          </Fragment>
                        )}
                      </FieldArray>
                    </Fragment>
                  )}
                </Col>
              </Row>
            </Form>
          )
        )}
      </Formik>
    </Fragment>
  );
};
