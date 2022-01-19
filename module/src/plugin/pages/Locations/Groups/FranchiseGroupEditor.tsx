import { getApiService } from '@savantly/sprout-runtime';
import { FormField, Icon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import TypeAheadSelectField from 'plugin/components/TypeAheadSelectField';
import { UserPicker } from 'plugin/components/UserPicker';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { useAppUsers } from 'plugin/services/userService';
import React, { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'reactstrap';
import { FranchiseGroup, franchiseGroupsStateProvider, groupService, groupMemberService } from './entity';

export interface FranchiseGroupEditorProps {
  item: FranchiseGroup;
  afterSave: (values: any, helpers: FormikHelpers<any>) => void;
}

export const FranchiseGroupEditor = ({ item, afterSave }: FranchiseGroupEditorProps) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || franchiseGroupsStateProvider.props.initialState.example);
  const [error, setError] = useState('');

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
              values.members.map((member: any) => {
                let groupMemberToSave;
                if (member.itemId) {
                  groupMemberToSave = groupMemberService.update(member.itemId, member);
                } else {
                  member.franchiseGroupId = response?.data.itemId;
                  groupMemberToSave = groupMemberService.create(member);
                }
                groupMemberToSave
                  .then(resp => {
                    console.log('resp', resp);
                  })
                  .catch(err => {
                    setError(err.message || err.detail || 'An error occurred while saving.');
                  });
              });
              helpers.setSubmitting(false);
              helpers.resetForm();
              afterSave(response.data, helpers);
            })
            .catch(err => {
              setError(err.message || err.detail || 'An error occurred while saving.');
            });
        }}
      >
        {({ values }) => (
          <Form>
            {/* <Prompt message="You have unsaved changes. Are you sure?" when={props.dirty} /> */}
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
                <FranchiseGroupMemberEditor memberItem={values} />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export interface FranchiseGroupMemberEditorProps {
  memberItem: FranchiseGroup;
}
const FranchiseGroupMemberEditor = ({ memberItem }: FranchiseGroupMemberEditorProps) => {
  const users = useAppUsers();

  useMemo(() => {
    getApiService()
      .get(`${API_URL}/group-members/`)
      .then(response => {
        const found = response?.data?.content.filter((l: any) => l.franchiseGroupId === memberItem.itemId);
        memberItem.members = found;
      })
      .catch(err => {
        console.error(err.message || err.detail || 'An error occurred while saving.');
      });
  }, [memberItem]);
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
    <div>
      {memberItem && users && (
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
                          franchiseGroupId: memberItem.itemId ? memberItem.itemId : '',
                        });
                      }}
                    >
                      Add Member
                    </Button>
                  </Col>
                </Row>
                <div className="form-inline p-0">
                  {memberItem?.members && memberItem?.members.length > 0 && (
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
                  {memberItem?.members &&
                    memberItem?.members.length > 0 &&
                    memberItem?.members.map((bar: any, index: any) => (
                      <Row
                        key={`member-${index}`}
                        className={css`
                          margin-bottom: 2em;
                        `}
                      >
                        <Col>
                          <UserPicker name={`members.${index}.userId`} users={users} />
                        </Col>
                        <Col>
                          <TypeAheadSelectField
                            name={`members.${index}.role`}
                            label=""
                            items={[
                              { value: 'PRIMARY_CONTACT', displayText: 'PRIMARY CONTACT' },
                              { value: 'GNERAL_MANAGER', displayText: 'GNERAL MANAGER' },
                              { value: 'FSC', displayText: 'FSC' },
                              { value: 'FAC', displayText: 'FAC' },
                              { value: 'FRANCHISE_OWNER', displayText: 'FRANCHISE OWNER' },
                              { value: 'FRANCHISE_PARTNER', displayText: 'FRANCHISE PARTNER' },
                              { value: 'DISTRICT_MANAGER', displayText: 'DISTRICT MANAGER' },
                              { value: 'OTHER', displayText: 'OTHER' },
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
    </div>
  );
};
