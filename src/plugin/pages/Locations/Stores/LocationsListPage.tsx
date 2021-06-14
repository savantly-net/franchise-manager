import React, { FC, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { Alert, Button, Nav, Navbar, NavItem } from 'reactstrap';
import { AppModuleRootState } from '../../../types';
import { loadLocations } from '../state/actions';
import EditLocation from './EditLocationPage';
import BootstrapTable from 'react-bootstrap-table-next';
import { FranchiseLocation } from '../types';
import { ColumnDescription, Icon, LoadingIcon } from '@sprout-platform/ui';

const columns: ColumnDescription[] = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
  },
  {
    dataField: 'address1',
    text: 'Address',
  },
  {
    dataField: 'city',
    text: 'City',
    sort: true,
  },
  {
    dataField: 'state',
    text: 'State',
    sort: true,
  },
  {
    dataField: 'zip',
    text: 'Zipcode',
    sort: true,
  },
  {
    dataField: 'actions',
    isDummyField: true,
    text: 'Actions',
    formatter: (cellContent: any, row: FranchiseLocation) => {
      return (
        <NavLink to={`./edit/${row.id}`}>
          <Icon name="pen" />
        </NavLink>
      );
    },
  },
];

const LocationsListPage: FC<any> = () => {
  const dispatch = useDispatch();
  const locationState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.franchiseLocationState);

  // @ts-ignore
  useMemo(() => {
    if (!locationState.isFetched && !locationState.isFetching) {
      dispatch(loadLocations());
    }
  }, [locationState, dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/edit/:id" element={<EditLocation />} />
        <Route path="/new" element={<EditLocation location={new FranchiseLocation()} />} />
        <Route
          path="/"
          element={
            <Fragment>
              <h4>Location list and details</h4>
              {locationState.isFetching && <LoadingIcon />}
              {locationState.error && <Alert color="danger">{locationState.error}</Alert>}
              <Navbar color="light" light>
                <Nav className="ml-auto">
                  <NavItem>
                    <Button color="secondary">
                      <NavLink to="./new" className="nav-link primary">
                        Create Location
                      </NavLink>
                    </Button>
                  </NavItem>
                </Nav>
              </Navbar>
              <BootstrapTable keyField="id" data={locationState.locations} columns={columns} striped hover condensed />
            </Fragment>
          }
        />
      </Routes>
      <Outlet />
    </div>
  );
};

export default LocationsListPage;
