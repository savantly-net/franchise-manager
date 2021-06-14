import { css } from 'emotion';
import React from 'react';
import { ReportSource } from './ReportSourceClient';

export const ReportViewer = ({ reportSource }: { reportSource: ReportSource }) => {
  if (reportSource.sourceType === 'VIEW') {
    return (
      <div className="d-flex column">
        <iframe
          src={reportSource.url}
          className={css`
            height: 100vh;
            width: 100vw;
            border: none;
          `}
        />
      </div>
    );
  }
  return <p>{JSON.stringify(reportSource)}</p>;
};
