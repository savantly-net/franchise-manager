import { publishSuccessNotification } from '@savantly/sprout-api';
import _ from 'lodash';
import { AppModuleRootState } from 'plugin/types';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Alert, Spinner } from 'reactstrap';
import { locationService } from '../locationService';
import { loadLocations } from '../state/actions';
import { FranchiseLocation } from '../types';
import { LocationEditor } from './LocationEditor';

const EditLocation = ({ location }: { location?: FranchiseLocation }) => {
  const dispatch = useDispatch();
  const locationState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.franchiseLocationState);
  const params = useParams();
  const [locationDto, setLocationDto] = useState(location);
  const [error, setError] = useState('');

  useMemo(() => {
    const locationId = params['id'];
    if (!locationDto) {
      const found = locationState.locations.filter(l => l.id === locationId);
      if (found.length > 0) {
        setLocationDto(_.cloneDeep(found[0]));
      }
    }
  }, [params, locationState, locationDto]);

  const orLoading = () => {
    if (locationDto) {
      return (
        <>
          {error && <Alert color="danger">{error}</Alert>}
          <LocationEditor
            location={locationDto}
            onSubmit={(values, helpers) => {
              console.log(values);
              locationService
                .createLocation(values)
                .then(response => {
                  helpers.setSubmitting(false);
                  locationService.updateLocationMembers(response.data.id, values.members).then(membersSaveResponse => {
                    publishSuccessNotification('Saved', 'Location updated');
                    dispatch(loadLocations());
                  });
                })
                .catch(err => {
                  console.error(err);
                  helpers.setSubmitting(false);
                  setError(err.message || err.detail || JSON.stringify(err));
                });
            }}
          />
        </>
      );
    } else {
      return <Spinner />;
    }
  };

  return orLoading();
};

export default EditLocation;
