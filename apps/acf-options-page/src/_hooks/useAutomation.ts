import { configByIdSelector, useAppSelector } from '@acf-options-page/store';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { useAutomationId } from './useAutomationId';

export function useAutomation(): IConfiguration | undefined {
  const automationId = useAutomationId();
  return useAppSelector((state) => configByIdSelector(state, automationId));
}
