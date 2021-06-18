import { dateTime } from '@savantly/sprout-api';
import { MarkdownViewer } from '@sprout-platform/ui';
import React, { Fragment } from 'react';
import { Calendar } from '../entity';

export const CalendarItemViewer = ({ item }: { item: Calendar }) => {
  return (
    <Fragment>
      <h2>{item.title}</h2>
      <hr />
      <div className="mb-2">
        <h5>Details</h5>
        <div>
          <strong>From:</strong>
          <span className="ml-1">{dateTime(item.fromDate).format('L LT')}</span>
        </div>
        <div>
          <strong>To:</strong>
          <span className="ml-1">{dateTime(item.toDate).format('L LT')}</span>
        </div>
        <div>
          <strong>All day:</strong>
          <input className="ml-1" checked={item.allDay} type="checkbox" readOnly />
        </div>
      </div>
      <hr />
      <div className="mb-2">
        <h5>Description</h5>
        <MarkdownViewer>{item.text}</MarkdownViewer>
      </div>
      <div className="mt-2">
        <hr />
        <span>Tags: </span>
        {item.tags.map(t => (
          <span>{t}</span>
        ))}
      </div>
    </Fragment>
  );
};
