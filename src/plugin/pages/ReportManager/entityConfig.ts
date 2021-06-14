import { BaseEntityService, EntityState, EntityStateProvider, TenantedEntity } from '@savantly/sprout-api';
import { API_URL } from 'plugin/config/appModuleConfiguration';

export interface ReportSource extends TenantedEntity {
  name?: string;
  url?: string;
  menuPath?: string;
  icon?: string;
  weight?: number;

  sourceType: 'VIEW' | 'JSON';
  template?: string;
  templateType?: 'MARKDOWN' | 'HANDLEBARS';
}

export type ReportSourceState = EntityState<ReportSource>;

class ReportSourceService extends BaseEntityService<ReportSource> {
  constructor() {
    super({
      baseUrl: `${API_URL}/report-source`,
    });
  }
}
const reportSourceService = new ReportSourceService();
export { reportSourceService };

export const reportSourceStateProvider = new EntityStateProvider<ReportSource>({
  entityService: reportSourceService,
  initialState: {
    isFetched: false,
    isFetching: false,
    example: {
      name: 'New report',
      icon: 'chart-line',
      menuPath: '',
      sourceType: 'VIEW',
    },
  },
  stateKey: 'reportSources',
});
