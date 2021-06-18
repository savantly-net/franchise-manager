import { MarkdownViewer } from '@sprout-platform/ui';
import React, { Fragment } from 'react';
import { Knowledge } from '../entity';

export const KnowledgeItemViewer = ({ item }: { item: Knowledge }) => {
  return (
    <Fragment>
      <MarkdownViewer>{item.text}</MarkdownViewer>
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
