import { getApiService } from '@savantly/sprout-runtime';
import { FormField } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikHelpers } from 'formik';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import React, { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'reactstrap';
import { FranchiseGroup, franchiseGroupsStateProvider, groupService, groupMemberService } from './entity';
import { GroupMembersEditor } from './GroupMembersEditor';

export interface FranchiseGroupEditorProps {
  item: FranchiseGroup;
  afterSave: (values: any, helpers: FormikHelpers<any>) => void;
}

export const FranchiseGroupEditor = ({ item, afterSave }: FranchiseGroupEditorProps) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || franchiseGroupsStateProvider.props.initialState.example);
  const [error, setError] = useState('');
  useMemo(() => {
    if (item.itemId) {
      getApiService()
        .get(`${API_URL}/group-members/`)
        .then(response => {
          const found = response?.data?.content.filter((l: any) => l.franchiseGroupId === item.itemId);
          item.members = found;
        })
        .catch(err => {
          console.error(err.message || err.detail || 'An error occurred while saving.');
        });
    }
  }, [item]);
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
                <GroupMembersEditor groupMember={values} />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
