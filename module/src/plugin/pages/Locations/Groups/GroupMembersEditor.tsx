import { Icon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { FieldArray } from 'formik';
import TypeAheadSelectField from 'plugin/component/TypeAheadSelectField';
import { UserPicker } from 'plugin/component/UserPicker';
import { useAppUsers } from 'plugin/services/userService';
import React, { Fragment } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { FranchiseGroup } from './entity';

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

export interface FranchiseGroupMemberEditorProps {
  groupMember: FranchiseGroup;
}

export const GroupMembersEditor = ({ groupMember }: FranchiseGroupMemberEditorProps) => {
  const users = useAppUsers();
  return (
    <div>
      {groupMember && users && (
        <Fragment>
          <FieldArray name="members">
            {({ insert, remove, push }) => (
              <Fragment>
                <Row>
                  <Col
                    className={css`
                      direction: rtl;
                    `}
                  >
                    <Button
                      className={css`
                        display: block;
                        margin: 2em 0;
                      `}
                      color="info"
                      onClick={() => {
                        push({
                          franchiseGroupId: groupMember.itemId ? groupMember.itemId : '',
                        });
                      }}
                    >
                      Add Member
                    </Button>
                  </Col>
                </Row>
                <div className="form-inline p-0">
                  {groupMember?.members && groupMember?.members.length > 0 && (
                    <Row
                      className={css`
                        margin-bottom: 1em;
                        width: 100%;
                      `}
                    >
                      <Col>
                        <label>User</label>
                      </Col>
                      <Col>
                        <label>Role</label>
                      </Col>
                      <div
                        className={css`
                          width: 0;
                        `}
                      >
                        <label>Delete</label>
                      </div>
                    </Row>
                  )}
                  {groupMember?.members &&
                    groupMember?.members.length > 0 &&
                    groupMember?.members.map((bar: any, index: any) => (
                      <Row
                        key={`member-${index}`}
                        className={css`
                          margin-bottom: 2em;
                        `}
                      >
                        <Col>
                          <UserPicker name={`members.${index}.userId`} users={users} />
                        </Col>
                        <Col>
                          <TypeAheadSelectField
                            name={`members.${index}.role`}
                            label=""
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
                        <Col
                          className={css`
                            text-align: center;
                            padding: 0;
                          `}
                        >
                          <RemoveItemButton index={index} remove={remove} />
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
