import { ColumnDescription } from '@sprout-platform/ui';
import { FieldConfig, useField } from 'formik';
import React, { Fragment, useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
// @ts-ignore
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button } from 'reactstrap';
import { FranchiseFee, franchiseFeesStateProvider } from '../../Fees/feeEntity';
import { FeeTypeSelector } from '../../Fees/FeeTypeSelector';
import { useFranchisFeeTypes } from '../../Fees/hooks';
import { FranchiseLocation } from '../../types';

const BTDateEditor = ({ value, onUpdate }: { value: any; onUpdate: (value: any) => void }) => {
  return (
    <Fragment>
      <input className="form-control" key="v" type="date" value={value} onChange={e => onUpdate(e.target.value)} />
    </Fragment>
  );
};

const BTNumberEditor = ({ value, onUpdate }: { value: any; onUpdate: (value: any) => void }) => {
  return (
    <Fragment>
      <input className="form-control" key="v" type="number" value={value} onBlur={e => onUpdate(e.target.value)} />
    </Fragment>
  );
};

export interface FranchiseLocationFeeEditorProps extends FieldConfig {
  location: FranchiseLocation;
}
export const FranchiseLocationFeeEditor = ({ location, ...props }: FranchiseLocationFeeEditorProps) => {
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
    }
  }, [feeTypes]);

  const getColumns = () => {
    const columns: Array<ColumnDescription<FranchiseFee>> = [
      {
        dataField: 'feeTypeId',
        text: 'Fee Type',
        sort: false, // can't sort until we work out a good way to update the correct rows
        editable: (cell, row) => {
          return row.itemId ? false : true;
        },
        //@ts-ignore
        editorRenderer: (editorProps, _val, row, column, rowIndex, columnIndex) => {
          return (
            <FeeTypeSelector
              value={_val}
              onChange={val => {
                meta.value[rowIndex].feeTypeId = val;
                helpers.setValue(meta.value);
              }}
            />
          );
        },
        formatter: (cell: string) => {
          const found = feeTypeOptions?.filter(i => i.value === cell);
          return found && found.length > 0 ? found[0].label : '';
        },
      },
      {
        dataField: 'defaultAmount',
        text: 'Default Amount',
        editable: false,
      },
      {
        dataField: 'startDate',
        text: 'Start Date',
        sort: false, // can't sort until we work out a good way to update the correct rows
        //@ts-ignore
        editorRenderer: (editorProps, _val, row, column, rowIndex, columnIndex) => {
          return (
            <BTDateEditor
              value={_val}
              onUpdate={val => {
                console.log(val);
                meta.value[rowIndex].startDate = val;
                helpers.setValue(meta.value);
              }}
            />
          );
        },
      },
      {
        dataField: 'endDate',
        text: 'End Date',
        sort: false, // can't sort until we work out a good way to update the correct rows
        //@ts-ignore
        editorRenderer: (editorProps, _val, row, column, rowIndex, columnIndex) => {
          return (
            <BTDateEditor
              value={_val}
              onUpdate={val => {
                console.log(val);
                meta.value[rowIndex].endDate = val;
                helpers.setValue(meta.value);
              }}
            />
          );
        },
      },
      {
        dataField: 'overrideAmount',
        text: 'Override Amount',
        sort: false, // can't sort until we work out a good way to update the correct rows
        //@ts-ignore
        editorRenderer: (editorProps, _val, row, column, rowIndex, columnIndex) => {
          return (
            <BTNumberEditor
              value={_val}
              onUpdate={val => {
                console.log(val);
                meta.value[rowIndex].overrideAmount = val;
                helpers.setValue(meta.value);
              }}
            />
          );
        },
      },
    ];
    return columns;
  };

  return (
    <div>
      {location && location.fees && feeTypeOptions && (
        <Fragment>
          <Button
            color="info"
            onClick={() => {
              meta.value.push({
                ...franchiseFeesStateProvider.props.initialState.example,
                locationId: location.id,
              });
              helpers.setValue(meta.value);
            }}
          >
            Add Fee
          </Button>

          <BootstrapTable
            keyField="itemId"
            data={meta.value as FranchiseFee[]}
            columns={getColumns()}
            cellEdit={cellEditFactory({ mode: 'click' })}
            onTableChange={(type, newState) => {
              console.log(type);
              helpers.setValue(newState.data);
            }}
            striped
            hover
            condensed
          />
        </Fragment>
      )}
    </div>
  );
};
