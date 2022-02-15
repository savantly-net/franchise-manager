import { LoadingIcon } from '@sprout-platform/ui';
import { css } from 'emotion';
import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useReportSource } from './ReportSourceClient';
import { ReportViewer } from './ReportViewer';

const ReportsIndexPage = () => {
  const reportSourceId = useParams().id;
  const reportSource = useReportSource(reportSourceId);
  return (
    <Fragment>
      {!reportSource && (
        <div className="d-flex align-items-middle">
          <LoadingIcon
            className={css`
              text-align: center;
            `}
          />
        </div>
      )}
      {reportSource && <ReportViewer reportSource={reportSource} />}
    </Fragment>
  );
};

export default ReportsIndexPage;
