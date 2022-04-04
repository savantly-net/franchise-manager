import React, { Fragment } from 'react';
import { Card, CardBody } from 'reactstrap';
import { QASection as EntityClass } from '../entity';

export const QASectionViewer = ({ item }: { item: EntityClass }) => {
  return (
    <Fragment>
      <h2>{item.name}</h2>
      <hr />
      <div className="mb-2">
        <h5>Details</h5>
        <div>
          <label className="mr-2">Name: </label>
          <span>{item.name}</span>
        </div>
        <div>
          <label className="mr-2">Require Staff Attendance Log: </label>
          <span>{item.requireStaffAttendance}</span>
        </div>
        <div>
          <label className="mr-2">Guest Questions: </label>
          {item.guestQuestions &&
            item.guestQuestions.map(c => (
              <Card>
                <CardBody>
                  Points: {c.points} - {c.text}
                </CardBody>
              </Card>
            ))}
        </div>
        <div>
          <label className="mr-2">Questions: </label>
          {item.questions &&
            item.questions.map(c => (
              <Card>
                <CardBody>
                  Points: {c.points} - {c.text}
                </CardBody>
              </Card>
            ))}
        </div>
      </div>
    </Fragment>
  );
};
