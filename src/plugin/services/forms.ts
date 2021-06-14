import { getApiService } from '@savantly/sprout-runtime';
import { FORMS_API_URL } from 'plugin/config/appModuleConfiguration';

export interface AppFormSubmissionDto {
  _id?: string;
  formId?: string;
  data?: any;
  metadata?: any;
  state?: string;
}

export const formSaveService = ({
  formDefinitionId,
  submission,
}: {
  formDefinitionId: string;
  submission: AppFormSubmissionDto;
}) => {
  return getApiService().post<AppFormSubmissionDto>(`${FORMS_API_URL}/form/${formDefinitionId}/submission`, submission);
};

export const formUpdateService = ({
  formDefinitionId,
  submission,
}: {
  formDefinitionId: string;
  submission: AppFormSubmissionDto;
}) => {
  return getApiService().put<AppFormSubmissionDto>(`${FORMS_API_URL}/form/${formDefinitionId}/submission`, submission);
};
