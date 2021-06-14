import React, { Fragment } from 'react';
import { ReportSource } from '../entityConfig';

const ReportSourceViewer = ({ item }: { item: ReportSource }) => {
  return (
    <Fragment>
      <h3>{item.name}</h3>
      <p>Located in reports menu at: {item.menuPath}</p>
      <p>Source type: {item.sourceType}</p>
      <p>Rendered from: {item.url}</p>
      <p>Sorting weight: {item.weight}</p>
    </Fragment>
  );
};

export default ReportSourceViewer;
