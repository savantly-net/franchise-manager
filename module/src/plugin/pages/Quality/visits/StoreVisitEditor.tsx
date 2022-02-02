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
import { useQAISections } from '../sections/hooks';
import { QAISectionSubmission, qaiSubmissionService } from '../submissions/entity';
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
  const [sectionSubmissions, setSectionSubmissions] = useState(undefined as QAISectionSubmission[] | undefined);
  const appPluginSettings = getAppPluginSettingsService().getSettings;
  const qaiSectionList = useQAISections();

  const getSectionNameById = (sectionId: string | undefined): string => {
    console.log(`matching section id: ${sectionId} in ${qaiSectionList}`);
    const matches = qaiSectionList.filter(s => s.itemId === sectionId);
    if (matches.length > 0) {
      return matches[0].name;
    } else {
      return '';
    }
  };

  const updateSelectedLocation = (locationId?: string, props?: FormikProps<StoreVisit>) => {
    if (locationId && selectedLocationId !== locationId && props) {
      const formData = props.values.formData || {
        data: {},
      };
      formData.data.locationId = locationId;
      props.setFieldValue('formData', formData);

      setSelectedLocationId(locationId);
      qaiSubmissionService.findByLocation(locationId).then(response => {
        setSectionSubmissions(response.data);
      });
    } else if (item?.locationId) {
      qaiSubmissionService.findByLocation(item?.locationId).then(response => {
        setSectionSubmissions(response.data);
      });
    }
  };
  updateSelectedLocation(item?.locationId, item?.formData?.data);

  // When the section submission changes, we'll update specific form values with data from the section submission, or calculated data
  const updatedSelectedSection = (sectionSubmissionId?: string, formikProps?: FormikProps<StoreVisit>) => {
    let sectionSubmissionData = {};
    sectionSubmissions &&
      sectionSubmissions.forEach(s => {
        if (s.itemId === sectionSubmissionId) {
          sectionSubmissionData = s;
        }
      });
    if (formikProps?.values) {
      const formData = formikProps.values.formData || {};
      // This is the embedded formio form data
      const formDataData = formData.data || {};
      const updated = {
        ...formData,
        data: {
          ...formDataData,
          sectionSubmissionData: sectionSubmissionData,
        },
      };
      formikProps.setFieldValue('formData', updated);
    }
  };

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
                    locations.sort((a, b) => a.name > b.name ? 1:-1).map(l => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                </Fragment>
              </FormField>
              <div>
                <FormField
                  name="sectionSubmissionId"
                  label="Section Submission"
                  wrapperProps={wrapperProps}
                  as="select"
                  onChange={(e: React.SyntheticEvent<HTMLSelectElement>) => {
                    const target = e.target as HTMLSelectElement;
                    props.setFieldValue('sectionSubmissionId', target.value);
                    updatedSelectedSection(target.value, props);
                  }}
                >
                  <option></option>
                  <Fragment>
                    {sectionSubmissions &&
                      sectionSubmissions.map(s => (
                        <option key={s.itemId} value={s.itemId}>
                          {getSectionNameById(s.sectionId)} {s.dateScored}
                        </option>
                      ))}
                  </Fragment>
                </FormField>
              </div>
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
