import { FormField, Icon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { FieldArray } from 'formik';
import TypeAheadSelectField from 'plugin/components/TypeAheadSelectField';
import { UserPicker } from 'plugin/components/UserPicker';
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
                      locationId: location.id,
                    });
                  }}
                >
                  Add Member
                </Button>
                <div className="form-inline p-2">
                  {location.members &&
                    location.members.length > 0 &&
                    location.members.map((bar, index) => (
                      <Row key={`member-${index}`}>
                        <Col
                          className={css`
                            text-align: center;
                          `}
                        >
                          <div>
                            <label>Delete</label>
                          </div>
                          <RemoveItemButton index={index} remove={remove} />
                        </Col>
                        <Col>
                          <UserPicker name={`members.${index}.userId`} users={users} label="User" />
                        </Col>
                        <Col>
                          <TypeAheadSelectField
                            name={`members.${index}.role`}
                            label="Role"
                            items={[{ value: 'STAFF' }, { value: 'COACH' }, { value: 'OWNER' }]}
                          />
                        </Col>
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
