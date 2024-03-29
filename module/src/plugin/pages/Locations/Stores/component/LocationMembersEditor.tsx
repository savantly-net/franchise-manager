import { FormControl, FormLabel } from '@chakra-ui/react';
import { Icon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { FieldArray } from 'formik';
import TypeAheadSelectField from 'plugin/component/TypeAheadSelectField';
import { UserPicker } from 'plugin/component/UserPicker';
import { useAppUsers } from 'plugin/services/userService';
import React, { Fragment } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { FranchiseLocation } from '../../types';

const RemoveItemButton = ({ remove, index }: { remove: (index: number) => void; index: number }) => {
  return (
    <Icon
      name="trash-alt"
      size={'2x'}
      className={cx('text-danger', 'mb-2')}
      color="danger"
      onClick={() => {
        remove(index);
      }}
    />
  );
};

export interface FranchiseLocationMemberEditorProps {
  location: FranchiseLocation;
}

export const FranchiseLocationMemberEditor = ({ location }: FranchiseLocationMemberEditorProps) => {
  const users = useAppUsers();
  return (
    <div>
      {location && users && (
        <Fragment>
          <FieldArray name="members">
            {({ insert, remove, push }) => (
              <Fragment>
                <Button
                  color="info"
                  onClick={() => {
                    push({
                      locationId: location.id ? location.id : '',
                    });
                  }}
                >
                  Add Member
                </Button>
                <div className="form-inline p-2">
                  {location.members &&
                    location.members.length > 0 &&
                    location.members.map((bar, index) => (
                      <Row
                        key={`member-${index}`}
                        style={{
                          margin: '0',
                          borderBottom: '1px solid #ddd',
                          padding: '5px 0',
                          alignItems: 'center',
                        }}
                      >
                        <Col
                          className={css`
                            text-align: center;
                          `}
                        >
                          <FormControl>
                            <FormLabel>{`Delete`}</FormLabel>
                            <RemoveItemButton index={index} remove={remove} />
                          </FormControl>
                        </Col>
                        <Col>
                          <UserPicker name={`members.${index}.userId`} users={users} label="User" />
                        </Col>
                        <Col>
                          <TypeAheadSelectField
                            name={`members.${index}.role`}
                            label="Role"
                            items={[
                              { value: 'PRIMARY_CONTACT', displayText: 'PRIMARY CONTACT' },
                              { value: 'GNERAL_MANAGER', displayText: 'GNERAL MANAGER' },
                              { value: 'FSC', displayText: 'FSC' },
                              { value: 'FAC', displayText: 'FAC' },
                              { value: 'FRANCHISE_OWNER', displayText: 'FRANCHISE OWNER' },
                              { value: 'FRANCHISE_PARTNER', displayText: 'FRANCHISE PARTNER' },
                              { value: 'DISTRICT_MANAGER', displayText: 'DISTRICT MANAGER' },
                              { value: 'OTHER', displayText: 'OTHER' },
                            ]}
                          />
                        </Col>
                        {index % 2 === 0 ? (
                          <span
                            className="verticleLine"
                            style={{ height: '65px', width: '1px', backgroundColor: '#ddd', margin: '0 20px' }}
                          />
                        ) : (
                          ''
                        )}
                      </Row>
                    ))}
                </div>
              </Fragment>
            )}
          </FieldArray>
        </Fragment>
      )}
    </div>
  );
};
