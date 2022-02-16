import { AddIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import { DateField, Form, FormField, Icon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { Field, FieldArray, FormikHelpers } from 'formik';
import { useAppUsers } from 'plugin/services/userService';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, ReactElement, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Nav, NavItem, NavLink, Row, TabContent, Navbar, TabPane } from 'reactstrap';
import { franchiseGroupsStateProvider } from '../Groups/entity';
import { franchiseMarketStateProvider } from '../Market/entity';
import { FranchiseLocation } from '../types';
import { FranchiseLocationFeeEditor } from './component/FranchiseLocationFeeEditor';
import { FranchiseLocationMemberEditor } from './component/LocationMembersEditor';
import { useFMLocationFees, useFMLocationMembers } from './hooks';
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';

const RemoveItemButton = ({ remove, index }: { remove: (index: number) => void; index: number }) => {
  return (
    <Icon
      style={{ margin: '2px 0px 0px 10px' }}
      name="trash-alt"
      size={'2x'}
      className={cx('text-danger', 'mb-2 mr-4')}
      color="danger"
      onClick={() => {
        remove(index);
      }}
    />
  );
};

const FieldArrayWrapper = ({ children, header }: { children: ReactElement; header: string }) => {
  return (
    <Row>
      <Col>
        <div
          className={cx(
            'justify-content-between',
            css`
              display: flex;
            `
          )}
        >
          <h5>{header}</h5>
        </div>
        {children}
      </Col>
    </Row>
  );
};

const BuildingEditControl = () => {
  return (
    <div>
      <h5>Building</h5>
      <Row>
        <div className="col">
          <div className="form-group">
            <label>Total sq ft.</label>
            <Field className="form-control" name="building.totalSquareFeet" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>FOH sq. ft.</label>
            <Field className="form-control" name="building.fohSquareFeet" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>BOH sq. ft.</label>
            <Field className="form-control" name="building.bohSquareFeet" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Max Occupancy</label>
            <Field className="form-control" name="building.maxOccupancy" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Max Seating</label>
            <Field className="form-control" name="building.maxSeating" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Lease Sign Date</label>
            <Field className="form-control" name="building.leaseSignDate" as="input" type="date" />
          </div>
        </div>
      </Row>
    </div>
  );
};

const FranchiseDayHoursEditor = ({ openInterval, dayName }: { openInterval: any; dayName: any }) => {
  return (
    <FieldArray name={`hours.${dayName}.openIntervals`}>
      {({ insert, remove, push }) => (
        <Box>
          <div>
            <Table
              className={cx(
                css`
                  width: 20% !important;
                `
              )}
            >
              <TableCaption
                className={cx(
                  css`
                    caption-side: top !important;
                  `
                )}
              >
                {dayName}{' '}
                <IconButton
                  aria-label={`Hours-${dayName}-OpenIntervals`}
                  icon={<AddIcon />}
                  onClick={() => {
                    push({
                      start: '',
                      end: '',
                    });
                  }}
                />
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Start</Th>
                  <Th>End</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {openInterval &&
                  openInterval.length > 0 &&
                  openInterval.map((hour: any, index: any) => (
                    <Tr key={`hours.${dayName}.openIntervals.${index}.start`}>
                      <Td>
                        <Field
                          name={`hours.${dayName}.openIntervals.${index}.start`}
                          label="Start"
                          type="time"
                          className=""
                        />
                      </Td>{' '}
                      <Td>
                        <Field
                          name={`hours.${dayName}.openIntervals.${index}.end`}
                          label="End"
                          type="time"
                          className=""
                        />
                      </Td>
                      <Td>
                        <RemoveItemButton index={index} remove={remove} />
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

const HoursControl = ({ location }: { location: FranchiseLocation }) => {
  return (
    <Fragment>
      <h5>Hours of Operation</h5>
      <Row>
        <Col>
          <FranchiseDayHoursEditor
            openInterval={location.hours.sunday.openIntervals.length > 0 ? location.hours.sunday.openIntervals : []}
            dayName="sunday"
          />
        </Col>
        <Col>
          <FranchiseDayHoursEditor
            openInterval={location.hours.monday.openIntervals.length > 0 ? location.hours.monday.openIntervals : []}
            dayName="monday"
          />
        </Col>
        <Col>
          <FranchiseDayHoursEditor
            openInterval={location.hours.tuesday.openIntervals.length > 0 ? location.hours.tuesday.openIntervals : []}
            dayName="tuesday"
          />
        </Col>
        <Col>
          <FranchiseDayHoursEditor
            openInterval={
              location.hours.wednesday.openIntervals.length > 0 ? location.hours.wednesday.openIntervals : []
            }
            dayName="wednesday"
          />
        </Col>
        <Col>
          <FranchiseDayHoursEditor
            openInterval={location.hours.thursday.openIntervals.length > 0 ? location.hours.thursday.openIntervals : []}
            dayName="thursday"
          />
        </Col>
        <Col>
          <FranchiseDayHoursEditor
            openInterval={location.hours.friday.openIntervals.length > 0 ? location.hours.friday.openIntervals : []}
            dayName="friday"
          />
        </Col>
        <Col>
          <FranchiseDayHoursEditor
            openInterval={location.hours.saturday.openIntervals.length > 0 ? location.hours.saturday.openIntervals : []}
            dayName="saturday"
          />
        </Col>
      </Row>
      <FieldArrayWrapper header="Modified Hours">
        <FieldArray name="modifiedHours">
          {({ insert, remove, push }) => (
            <Fragment>
              <Navbar color="light" light>
                <Nav className="ml-auto">
                  <NavItem>
                    <Button
                      color="secondary"
                      onClick={() => {
                        push({
                          totalSquareFeet: 0,
                        });
                      }}
                    >
                      Add Modified Hours
                    </Button>
                  </NavItem>
                </Nav>
              </Navbar>

              <div className="form-inline ml-1">
                {location.modifiedHours &&
                  location.modifiedHours.length > 0 &&
                  location.modifiedHours.map((bar, index) => (
                    <div
                      key={`modifiedHours-${index}`}
                      className={css`
                        display: flex;
                        width: 100%;
                        margin: 10px;
                      `}
                    >
                      <RemoveItemButton index={index} remove={remove} />
                      <div className="input-group  mr-4">
                        <label htmlFor={`modifiedHours.${index}.dateToModify`} className="mr-2 sr-only">
                          Date
                        </label>
                        <div className="input-group-prepend">
                          <div className="input-group-text">Date</div>
                        </div>
                        <Field name={`modifiedHours.${index}.dateToModify`} type="date" className="form-control" />
                      </div>
                      <div className="input-group mr-4">
                        <label htmlFor={`modifiedHours.${index}.openTime`} className="mr-2 sr-only">
                          Open Time
                        </label>
                        <div className="input-group-prepend">
                          <div className="input-group-text">Open</div>
                        </div>
                        <Field
                          name={`modifiedHours.${index}.openTime`}
                          label="Open Time"
                          type="time"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mr-2">
                        <label htmlFor={`modifiedHours.${index}.closeTime`} className="mr-2 sr-only">
                          Close Time
                        </label>
                        <div className="input-group-prepend">
                          <div className="input-group-text">Close</div>
                        </div>
                        <Field
                          name={`modifiedHours.${index}.closeTime`}
                          label="Close Time"
                          type="time"
                          className="form-control"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Fragment>
          )}
        </FieldArray>
      </FieldArrayWrapper>
    </Fragment>
  );
};

const FranchiseDatesEditor = ({ location }: { location: FranchiseLocation }) => {
  return (
    <>
      <FieldArray name={`openDateIntervals`}>
        {({ insert, remove, push }) => (
          <Box>
            <div>
              <Table
                className={cx(
                  css`
                    width: 20% !important;
                  `
                )}
              >
                <TableCaption
                  className={cx(
                    css`
                      text-align: right !important;
                      right: 15px;
                      position: relative;
                    `
                  )}
                >
                  <IconButton
                    aria-label={`openDateIntervals`}
                    icon={<AddIcon />}
                    onClick={() => {
                      push({
                        start: '',
                        end: '',
                      });
                    }}
                  />
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Start</Th>
                    <Th>End</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {location.openDateIntervals &&
                    location.openDateIntervals.map((date: any, index: any) => (
                      <Tr key={`openDateIntervals.${index}.start`}>
                        <Td>
                          <Field
                            name={`openDateIntervals.${index}.start`}
                            label="Start"
                            type="date"
                            className="form-control"
                          />
                        </Td>{' '}
                        <Td>
                          <Field
                            name={`openDateIntervals.${index}.end`}
                            label="End"
                            type="date"
                            className="form-control"
                          />
                        </Td>
                        <Td>
                          <RemoveItemButton index={index} remove={remove} />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </div>
          </Box>
        )}
      </FieldArray>
    </>
  );
};

const BarsEditControl = ({ location }: { location: FranchiseLocation }) => {
  return (
    <FieldArrayWrapper header="Bars">
      <FieldArray name="bars">
        {({ insert, remove, push }) => (
          <Fragment>
            <Button
              color="info"
              onClick={() => {
                push({
                  linearFeet: 0,
                  beer: true,
                  liquor: true,
                  standalone: false,
                });
              }}
            >
              Add Bar
            </Button>
            <div className="form-inline p-2">
              {location.bars &&
                location.bars.length > 0 &&
                location.bars.map((bar, index) => (
                  <div className="form-row" key={`bars-${index}`}>
                    <RemoveItemButton index={index} remove={remove} />
                    <div className="input-group mr-2">
                      <label htmlFor={`bars.${index}.linearFeet`} className="mr-2">
                        Linear Feet
                      </label>
                      <Field
                        name={`bars.${index}.linearFeet`}
                        label="Linear Feet"
                        type="number"
                        className="form-control"
                      />
                    </div>
                    <div className="form-check form-check-inline">
                      <Field name={`bars.${index}.liquor`} type="checkbox" className={'form-check-input'} />
                      <label htmlFor={`bars.${index}.liquor`} className={'form-check-label'}>
                        Liquor
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <Field name={`bars.${index}.beer`} type="checkbox" className={'form-check-input'} />
                      <label htmlFor={`bars.${index}.beer`} className={'form-check-label'}>
                        Beer
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <Field name={`bars.${index}.standalone`} type="checkbox" className={'form-check-input'} />
                      <label htmlFor={`bars.${index}.standalone`} className={'form-check-label'}>
                        Stand-alone
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          </Fragment>
        )}
      </FieldArray>
    </FieldArrayWrapper>
  );
};

const PatiosEditControl = ({ location }: { location: FranchiseLocation }) => {
  return (
    <FieldArrayWrapper header="Patios">
      <FieldArray name="patios">
        {({ insert, remove, push }) => (
          <Fragment>
            <Button
              color="info"
              onClick={() => {
                push({
                  totalSquareFeet: 0,
                });
              }}
            >
              Add Patio
            </Button>
            <div className="form-inline p-2">
              {location.patios &&
                location.patios.length > 0 &&
                location.patios.map((bar, index) => (
                  <div key={`patio-${index}`} className="form-row">
                    <RemoveItemButton index={index} remove={remove} />
                    <div className="input-group mr-2">
                      <label htmlFor={`patios.${index}.totalSquareFeet`} className="mr-2 sr-only">
                        Total sq. ft.
                      </label>
                      <div className="input-group-prepend">
                        <div className="input-group-text">sqft.</div>
                      </div>
                      <Field name={`patios.${index}.totalSquareFeet`} type="number" className="form-control" />
                    </div>
                  </div>
                ))}
            </div>
          </Fragment>
        )}
      </FieldArray>
    </FieldArrayWrapper>
  );
};

const TabEntry = ({
  activeTab,
  toggle,
  tabId,
  tabText,
}: {
  activeTab: string;
  toggle: (tabId: string) => void;
  tabId: string;
  tabText: string;
}) => {
  return (
    <NavItem>
      <NavLink
        className={cx({ active: activeTab === tabId })}
        onClick={() => {
          toggle(tabId);
        }}
      >
        {tabText}
      </NavLink>
    </NavItem>
  );
};

export const LocationEditor = ({
  location,
  onSubmit,
}: {
  location: FranchiseLocation;
  onSubmit: (values: FranchiseLocation, helpers: FormikHelpers<FranchiseLocation>) => void;
}) => {
  const fmSelectOptions = useSelector((state: AppModuleRootState) => state.franchiseManagerState.fmSelectOptions);
  const marketState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.marketState);
  const groupState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.groupState);
  const [activeTab, setActiveTab] = useState('details');
  const dispatch = useDispatch();
  const users = useAppUsers();
  const fmLocationMembers = useFMLocationMembers(location.id);
  const fmLocationFees = useFMLocationFees(location.id);

  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useMemo(() => {
    if (!marketState.isFetched && !marketState.isFetching) {
      dispatch(franchiseMarketStateProvider.loadState());
    }
    if (!groupState.isFetched && !groupState.isFetching) {
      dispatch(franchiseGroupsStateProvider.loadState());
    }
  }, [marketState, groupState, dispatch]);

  useMemo(() => {
    if (fmLocationMembers) {
      if (users) {
        fmLocationMembers.map((bar: any, index: any) => {
          fmLocationMembers[index]['userId'] = users.filter(user => user.itemId === bar?.userId)?.[0]?.displayName;
        });
        location.members = fmLocationMembers;
      }
    }
  }, [fmLocationMembers, users, location]);

  useMemo(() => {
    if (fmLocationFees) {
      location.fees = fmLocationFees;
    }
  }, [fmLocationFees, location]);

  return (
    <div>
      <Form
        showButtonsOnTop={true}
        showCancelButton={false}
        submitText="Save"
        initialValues={location}
        onSubmit={(values, helpers) => {
          onSubmit(values, helpers);
        }}
      >
        {({ values }) => {
          return (
            <div className={cx('pt-2')}>
              <Nav tabs>
                <TabEntry tabId="details" tabText="Details" activeTab={activeTab} toggle={toggle} />
                <TabEntry tabId="dates" tabText="Dates" activeTab={activeTab} toggle={toggle} />
                <TabEntry tabId="hours" tabText="Hours" activeTab={activeTab} toggle={toggle} />
                <TabEntry tabId="members" tabText="Members" activeTab={activeTab} toggle={toggle} />
                <TabEntry tabId="fees" tabText="Fees" activeTab={activeTab} toggle={toggle} />
              </Nav>
              <TabContent
                activeTab={activeTab}
                className={cx(
                  'pt-2',
                  css`
                    border-top: #ddd solid 1px;
                  `
                )}
              >
                <TabPane tabId="details">
                  <Fragment>
                    <Row>
                      <FormField name="name" type="text" label="Name" placeholder="Enter the location name" />
                      <FormField name="emailAddress" type="email" label="Email" placeholder="Enter email" />
                      <FormField name="phoneNumber" label="Phone Number" />
                      <DateField name="dateOpened" label="Open Date" />
                      <DateField name="dateClosed" label="Close Date" />
                    </Row>
                    <Row>
                      <FormField name="address1" label="Address" />
                      <FormField name="address2" label="Suite" />
                      <FormField name="city" label="City" />
                      <FormField name="state" label="State" />
                      <FormField name="zip" label="Zip Code" />
                    </Row>
                    <Row>
                      <FormField as="select" name="concept" label="Concept">
                        {fmSelectOptions.concepts &&
                          fmSelectOptions.concepts.map((t, index) => (
                            <option key={index} value={t}>
                              {t}
                            </option>
                          ))}
                      </FormField>
                      <FormField as="select" name="locationType" label="Location Type">
                        {fmSelectOptions.locationTypes &&
                          fmSelectOptions.locationTypes.map((t, index) => (
                            <option key={index} value={t}>
                              {t}
                            </option>
                          ))}
                      </FormField>
                      <FormField as="select" name="marketId" label="Market">
                        {marketState.response?.content &&
                          marketState.response.content.map((t, index) => (
                            <option key={index} value={t.id?.itemId}>
                              {t.name}
                            </option>
                          ))}
                      </FormField>
                      <FormField as="input" name="smallWare" label="Small Ware" />
                      <FormField as="input" name="kes" label="KES" />
                    </Row>
                    <Row>
                      <FormField as="select" name="realEstateType" label="Real Estate Type">
                        <option value="Downtown">Downtown</option>
                        <option value="Residential">Residential</option>
                        <option value="University">University</option>
                        <option value="Retail Center">Retail Center</option>
                      </FormField>
                      <FormField as="select" name="stage" label="Stage">
                        <option value="Franchise Aggreement">Franchise Aggreement</option>
                        <option value="Site Approval">Site Approval</option>
                        <option value="LOI Submitted">LOI Submitted</option>
                        <option value="Lease Sign">Lease Sign</option>
                        <option value="Design / Permitting">Design / Permitting</option>
                        <option value="Under Construction">Under Construction</option>
                      </FormField>
                      <FormField name="distributionCenter" label="Distribution Center" />
                      <FormField as="select" name="training" label="Training">
                        <option value="Self">Self</option>
                        <option value="Corporate">Corporate</option>
                      </FormField>
                    </Row>
                    <hr />
                    <BuildingEditControl />
                    <hr />
                    <BarsEditControl location={values} />
                    <hr />
                    <PatiosEditControl location={values} />
                    <hr className="mb-3" />
                  </Fragment>
                </TabPane>
                <TabPane tabId="dates">
                  <FranchiseDatesEditor location={values} />
                </TabPane>
                <TabPane tabId="hours">
                  <HoursControl location={values} />
                </TabPane>
                <TabPane tabId="members">
                  <FranchiseLocationMemberEditor location={values} />
                </TabPane>
                <TabPane tabId="fees">
                  <FranchiseLocationFeeEditor location={values} locationId={location.id} name="fees" />
                </TabPane>
              </TabContent>
            </div>
          );
        }}
      </Form>
    </div>
  );
};
