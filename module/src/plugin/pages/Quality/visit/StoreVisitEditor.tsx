import { FormField, ItemEditorProps } from '@sprout-platform/ui';
import { css } from 'emotion';
import { FieldAttributes, Form, Formik, FormikHelpers, FormikProps, useField } from 'formik';
import /* webpackChunkName: "formioCss" */ 'formiojs/dist/formio.full.min.css';
import _ from 'lodash';
import { useFMLocations } from 'plugin/pages/Locations/Stores/hooks';
import { AppFormSubmissionDto } from 'plugin/services/forms';
import { useKpisByLocationId } from 'plugin/services/kpiService';
import { getAppPluginSettingsService } from 'plugin/services/pluginSettings';
import React, { Fragment, useMemo, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { Alert } from 'reactstrap';
import {
  StoreVisit as EntityClass,
  StoreVisit,
  storeVisitService as service,
  storeVisitStateProvider as stateProvider,
  useStoreVisitDynamicFieldsByLocationId,
} from './entity';
import { StoreVisitFormEdit } from './storeVisitForms/StoreVisitFormEdit';

const wrapperProps = {
  className: css`
    padding: 0;
  `,
};

const StoreVisitFormEditProxy = ({
  formDefinitionId,
  onSubmit,
  formData,
}: {
  formDefinitionId: string;
  onSubmit: (value: AppFormSubmissionDto) => void;
  formData: AppFormSubmissionDto;
}) => {
  return <StoreVisitFormEdit formDefinitionId={formDefinitionId} onSubmit={onSubmit} formData={formData} />;
};

const StoreVisitFormField = ({
  locationId,
  formDefinitionId,
  submitForm,
  ...rest
}: {
  locationId: string;
  formDefinitionId: string;
  submitForm: (value: AppFormSubmissionDto) => void;
} & FieldAttributes<AppFormSubmissionDto>) => {
  const kpis = useKpisByLocationId(locationId);
  const storeVisitDynamicFields = useStoreVisitDynamicFieldsByLocationId(locationId);
  // @ts-ignore
  const [fieldInputProps, meta, helpers] = useField(rest.name);

  useMemo(() => {
    const updatedValue = _.clone(meta.value || {});
    updatedValue.data = updatedValue.data || {};
    if (locationId && kpis) {
      for (let k in kpis) {
        for (let existing in updatedValue.data) {
          if (k === existing && !updatedValue.data[existing]) {
            updatedValue.data[existing] = kpis[k];
          }
        }
      }
    }
    if (locationId && storeVisitDynamicFields) {
      for (let k in storeVisitDynamicFields) {
        for (let existing in updatedValue.data) {
          if (k === existing && !updatedValue.data[existing]) {
            updatedValue.data[existing] = storeVisitDynamicFields[k];
          }
        }
      }
    }
    // don't call unless it's present and changed
    if (meta.value && updatedValue && !_.isEqual(meta.value, updatedValue)) {
      helpers.setValue(updatedValue);
    }
  }, [locationId, meta.value, helpers, kpis, storeVisitDynamicFields]);

  const formData = fieldInputProps.value || {
    data: { locationId },
  };

  return (
    <Fragment>
      <StoreVisitFormEditProxy
        formDefinitionId={formDefinitionId}
        onSubmit={value => {
          helpers.setValue(value);
          submitForm(value);
        }}
        formData={formData}
      />
    </Fragment>
  );
};

export const StoreVisitEditor = ({ item, afterSave }: ItemEditorProps<EntityClass>) => {
  const [itemState] = useState(item || stateProvider.props.initialState.example);
  const [error, setError] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(item?.locationId);
  const locations = useFMLocations();
  const appPluginSettings = getAppPluginSettingsService().getSettings;

  const updateSelectedLocation = (locationId?: string, props?: FormikProps<StoreVisit>) => {
    if (locationId && selectedLocationId !== locationId && props) {
      const formData = props.values.formData || {
        data: {},
      };
      formData.data.locationId = locationId;
      props.setFieldValue('formData', formData);

      setSelectedLocationId(locationId);
    } else if (item?.locationId) {
    }
  };
  updateSelectedLocation(item?.locationId, item?.formData?.data);

  const submitAll = (values: EntityClass, helpers: FormikHelpers<EntityClass>): Promise<EntityClass> => {
    return new Promise((resolve, reject) => {
      if (values.formData) {
        let promiseToSave = null;
        if (values.itemId) {
          promiseToSave = service.update(values.itemId, values);
        } else {
          values.formData.formId = appPluginSettings.jsonData?.storeVisitFormId;
          promiseToSave = service.create(values);
        }
        promiseToSave
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            console.error(err);
            reject('failed to save');
          });
      } else {
        reject('missing form data');
      }
    });
  };

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
          submitAll(values, helpers)
            .then(response => {
              helpers.resetForm();
              afterSave(response, helpers);
            })
            .catch(err => {
              console.error(err);
              setError(err);
            })
            .finally(() => {
              helpers.setSubmitting(false);
            });
        }}
      >
        {(props: FormikProps<EntityClass>) => {
          return (
            <Form
              onChange={event => {
                console.log(event);
              }}
            >
              <Prompt message="You have unsaved changes. Are you sure?" when={props.dirty} />
              <FormField
                name="locationId"
                label="Location"
                wrapperProps={wrapperProps}
                as="select"
                onChange={(e: React.SyntheticEvent<HTMLSelectElement>) => {
                  const target = e.target as HTMLSelectElement;
                  updateSelectedLocation(target.value, props);
                  props.setFieldValue('locationId', target.value);
                }}
                disabled={!!selectedLocationId}
              >
                <option></option>
                <Fragment>
                  {locations &&
                    locations
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                </Fragment>
              </FormField>
              {appPluginSettings.jsonData?.storeVisitFormId && selectedLocationId && (
                <StoreVisitFormField
                  name="formData"
                  locationId={selectedLocationId}
                  formDefinitionId={appPluginSettings.jsonData?.storeVisitFormId}
                  submitForm={val => {
                    props.submitForm();
                  }}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};
