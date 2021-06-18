import { Form, FormField } from '@sprout-platform/ui';
import { ConfigPageProps } from 'plugin/types';
import React, { Fragment, useMemo, useState } from 'react';
import axios from 'axios';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { publishErrorNotification } from '@savantly/sprout-api';

interface AppFormSelection {
  _id: string;
  name: string;
}
const QAISettingsPage = ({ plugin }: ConfigPageProps) => {
  const data = plugin.meta.jsonData || {};
  const [availableForms, setAvailableForms] = useState(undefined as AppFormSelection[] | undefined);
  const [fetching, setFetching] = useState(false);

  useMemo(() => {
    if (!fetching && !availableForms) {
      setFetching(true);
      axios
        .get(`${API_URL}/../savantly-forms/form`)
        .then(response => {
          setAvailableForms(response.data);
        })
        .catch(err => {
          publishErrorNotification('Error', 'Unable to retrieve forms');
        });
    }
  }, [availableForms, fetching]);

  return (
    <div>
      <h1>QAI Settings</h1>
      <Form
        initialValues={data}
        showCancelButton={false}
        onSubmit={(values, helpers) => {
          plugin.meta.updateJsonData(values);
        }}
      >
        <FormField name="storeVisitFormId" as="select" label="Store Visit Form">
          <option></option>
          <Fragment>
            {availableForms &&
              availableForms.map(f => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
          </Fragment>
        </FormField>
      </Form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default QAISettingsPage;
