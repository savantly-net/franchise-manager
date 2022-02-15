import { BaseEntityService, publishErrorNotification } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';
import { useEffect, useState } from 'react';

export interface ReportSource {
  itemId: string;
  url: string;
  sourceType: 'VIEW' | 'JSON';
  menuPath: string;
}

class ReportSourceService extends BaseEntityService<ReportSource> {
  constructor() {
    super({
      baseUrl: `${API_URL}/report-source`,
    });
  }
}
const reportSourceService = new ReportSourceService();

export const useReportSource = (id: string) => {
  const [fetching, isFetching] = useState(false);
  const [value, setValue] = useState(undefined as ReportSource | undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (id && !fetching && (!value || value.itemId !== id)) {
        isFetching(true);
        const response = await reportSourceService.getById(id);
        isFetching(false);
        if (response.data) {
          setValue(response.data);
        } else {
          publishErrorNotification('Error', 'Error fetching report');
        }
      }
    };
    fetchData();
  }, [id, fetching, isFetching, value, setValue]);
  return value;
};
