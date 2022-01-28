import { FieldConfig, useField } from 'formik';
import React, { Fragment, useMemo, useState } from 'react';
// import React, { Fragment,FC, useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { dateTime } from '@savantly/sprout-api';
// @ts-ignore
import cellEditFactory from 'react-bootstrap-table2-editor';
import { FranchiseFee, franchiseFeesStateProvider, locationFeeService } from '../../Fees/feeEntity';
import { useFranchisFeeTypes } from '../../Fees/hooks';
import { FranchiseLocation } from '../../types';
import { Form, Icon, FormField, DateField } from '@sprout-platform/ui';
import { Modal, ModalBody, ModalHeader, Button, Nav, Navbar, NavItem } from 'reactstrap';
import { useDispatch } from 'react-redux';

export interface FranchiseLocationFeeEditorProps extends FieldConfig {
  location: FranchiseLocation;
  locationId: string;
}
export const FranchiseLocationFeeEditor = ({ location, locationId, ...props }: FranchiseLocationFeeEditorProps) => {
  //@ts-ignore
  const [field, meta, helpers] = useField(props);
  //const value = _.clone(meta.value) as FranchiseFee[];
  const feeTypes = useFranchisFeeTypes();
  const [feeTypeOptions, setFeeTypeOptions] = useState(
    undefined as
      | Array<{
          label: string;
          value: any;
        }>
      | undefined
  );
  const [feeTypeOption, setFeeTypeOption] = useState<any>([]);
  const [editData, setEditData] = useState<any>([]);
  const [rowIndex, setRowIndex] = useState('');
  const dispatch = useDispatch();

  useMemo(() => {
    if (feeTypes) {
      setFeeTypeOptions(
        feeTypes.map(o => {
          return {
            label: o.name,
            value: o.itemId,
          };
        })
      );
      setFeeTypeOption(
        feeTypes.map(o => {
          return {
            label: o.name,
            value: o.itemId,
          };
        })
      );
    }
  }, [feeTypes]);

  const FeesType = ({ feeTypeId }: { feeTypeId?: string }) => {
    let obj = feeTypeOption.find((option: any) => option.value === feeTypeId);
    return <span className="mr-1">{obj?.label}</span>;
  };

  const [modal, setModal] = React.useState(false);

  // Toggle for Modal
  const toggle = () => setModal(!modal);

  const franchiseFeeColumnss = [
    {
      dataField: 'feeTypeId',
      text: 'Fees Type Name',
      sort: true,
      isDummyField: true,
      formatter: (cell: any, row: any) => {
        return (
          <span>
            <FeesType key={cell} feeTypeId={row.feeTypeId} />
          </span>
        );
      },
    },
    {
      dataField: 'startDate',
      text: 'Start Date',
      sort: true,
    },
    {
      dataField: 'endDate',
      text: 'End Date',
      sort: true,
    },
    {
      dataField: 'overrideAmount',
      text: 'Override Amount',
      sort: true,
    },
    {
      dataField: 'actions',
      isDummyField: true,
      text: 'Actions',
      formatter: (cellContent: any, row: FranchiseFee, rowIndex: any) => {
        return (
          <>
            <div>
              <Icon
                name="pen"
                size="sm"
                onClick={() => {
                  toggle();
                  setEditData(row);
                  setRowIndex(rowIndex);
                }}
              />
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {location && location.fees && feeTypeOptions && (
        <Fragment>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>{Object.keys(editData).length === 0 ? 'Create One' : 'Edit One'}</ModalHeader>
            <ModalBody>
              <Form
                initialValues={{
                  itemId: editData?.itemId ? editData?.itemId : null,
                  locationId: editData?.locationId,
                  feeTypeId: editData?.feeTypeId,
                  startDate: editData?.startDate ? editData?.startDate : dateTime().format('YYYY-MM-DD'),
                  endDate: editData?.endDate,
                  overrideAmount: editData?.overrideAmount,
                  amount: editData?.amount,
                }}
                onSubmit={async (values: FranchiseFee, { resetForm }) => {
                  values.locationId = values.locationId ? values.locationId : String(locationId);
                  resetForm();
                  toggle();
                  setModal(false);
                  // cancel();
                  if (locationId) {
                    if (values?.itemId && rowIndex !== null) {
                      meta.value[rowIndex] = values;
                      setEditData([]);
                      setRowIndex('');
                      locationFeeService.updateLocationFees(values, values?.itemId);
                    } else {
                      meta.value.push(values);
                      locationFeeService.createLocationFees(values);
                    }
                    helpers.setValue(meta.value);
                    dispatch(franchiseFeesStateProvider.loadState());
                  } else {
                    rowIndex !== '' ? (meta.value[rowIndex] = values) : meta.value.push(values);
                    setRowIndex('');
                    setEditData([]);
                    helpers.setValue(meta.value);
                  }
                }}
                onCancel={toggle}
              >
                {({ values: FranchiseFee }) => (
                  <>
                    <FormField name="feeTypeId" label="fee Type" as="select">
                      <option>Select Fees Type</option>
                      {feeTypeOption &&
                        feeTypeOption.map((ft: any) => (
                          <option value={ft.value} key={ft.label}>
                            {ft.label}
                          </option>
                        ))}
                    </FormField>
                    <DateField name="startDate" label="StartDate" />
                    <DateField name="endDate" label="EndDate" />
                    <FormField name="amount" type="number" label="Amount" />
                    <FormField name="overrideAmount" type="number" label="Override Amount" />
                  </>
                )}
              </Form>
            </ModalBody>
          </Modal>
          <Navbar color="light" light>
            <Nav className="ml-auto">
              <NavItem>
                <Button
                  color="secondary"
                  onClick={() => {
                    toggle();
                    setRowIndex('');
                    setEditData([]);
                  }}
                >
                  Create Fees
                </Button>
              </NavItem>
            </Nav>
          </Navbar>

          <BootstrapTable
            keyField="id"
            data={meta.value as FranchiseFee[]}
            columns={franchiseFeeColumnss}
            remote={{
              pagination: true,
            }}
            noDataIndication={<div style={{ textAlign: 'center' }}>Sorry, no fees record available.</div>}
            striped
            hover
            condensed
          />
        </Fragment>
      )}
    </div>
  );
};
