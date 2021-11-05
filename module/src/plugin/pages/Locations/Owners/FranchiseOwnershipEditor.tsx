import { DateField, FormField } from '@sprout-platform/ui';
import { css } from 'emotion';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { sortByKey } from 'plugin/services/arrays';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { FranchiseGroup, franchiseGroupsStateProvider } from '../Groups/entity';
import { loadLocations } from '../state/actions';
import { FranchiseOwnership, franchiseOwnershipService, franchiseOwnershipStateProvider } from './entity';

export interface FranchiseOwnershipEditorProps {
  item: FranchiseOwnership;
  afterSave: (values: any, helpers: FormikHelpers<any>) => void;
}

export const FranchiseOwnershipEditor = ({ item, afterSave }: FranchiseOwnershipEditorProps) => {
  const navigate = useNavigate();
  const [itemState] = useState(item || franchiseOwnershipStateProvider.props.initialState.example);
  const groupState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.groupState);
  const locationState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.franchiseLocationState);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useMemo(() => {
    if (!groupState.isFetched && !groupState.isFetching) {
      dispatch(franchiseGroupsStateProvider.loadState());
    }
    if (!locationState.isFetched && !locationState.isFetching) {
      dispatch(loadLocations());
    }
  }, [groupState, locationState, dispatch]);

  return (
    <Fragment>
      {error && <Alert color="danger">{error}</Alert>}
      <Formik
        initialValues={itemState}
        validate={values => {
          const errors: any = {};
          if (!values.incorporatedName) {
            errors['incorporatedName'] = {
              required: 'Incorporated name is required',
            };
          }
          if (!values.groupId) {
            errors['groupId'] = {
              required: 'A groupId is required',
            };
          }
          if (!values.storeId) {
            errors['storeId'] = {
              required: 'A storeId is required',
            };
          }
          if (!values.locationId) {
            errors['locationId'] = {
              required: 'A locationId is required',
            };
          }
          if (!values.startDate) {
            errors['startDate'] = {
              required: 'A startDate is required',
            };
          }
        }}
        onSubmit={(values, helpers) => {
          console.log(values);
          const promiseToSave = values.itemId
            ? franchiseOwnershipService.update(values.itemId, values)
            : franchiseOwnershipService.create(values);
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
        {(props: FormikProps<FranchiseOwnership>) => (
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
            <FormField name="incorporatedName" label="Incorporated Name" />
            <FormField as="select" name="groupId" label="Group">
              <Fragment>
                {groupState.response &&
                  (groupState.response.content as FranchiseGroup[]).sort(sortByKey('name')).map((t, index) => (
                    <option key={index} value={t.id?.itemId}>
                      {t.name}
                    </option>
                  ))}
              </Fragment>
              <option></option>
            </FormField>
            <FormField as="select" name="locationId" label="Location">
              <Fragment>
                <option></option>
                {locationState.locations &&
                  locationState.locations.sort(sortByKey('name')).map((t, index) => (
                    <option key={index} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </Fragment>
            </FormField>
            <FormField name="storeId" label="Store ID" />
            <DateField name="startDate" label="startDate" />
            <DateField name="endDate" label="endDate" />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
