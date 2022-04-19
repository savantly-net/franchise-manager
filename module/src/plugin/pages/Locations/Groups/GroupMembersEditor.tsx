import { Table, Td, Th, Thead, Tr } from '@chakra-ui/react';
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
                <Table>
                  {groupMember?.members && groupMember?.members.length > 0 && (
                    <Thead>
                      <Tr>
                        <Th>User</Th>
                        <Th className="">Role</Th>
                        <Th className="QAI__table__col__actions">Delete</Th>
                      </Tr>
                    </Thead>
                  )}
                  {groupMember?.members &&
                    groupMember?.members.length > 0 &&
                    groupMember?.members.map((bar: any, index: any) => (
                      <Tr key={`member-${index}`}>
                        <Td className="p-0">
                          <UserPicker name={`members.${index}.userId`} users={users} />
                        </Td>
                        <Td className="p-0">
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
                        </Td>
                        <Td>
                          <RemoveItemButton index={index} remove={remove} />
                        </Td>
                      </Tr>
                    ))}
                </Table>
              </Fragment>
            )}
          </FieldArray>
        </Fragment>
      )}
    </div>
  );
};
