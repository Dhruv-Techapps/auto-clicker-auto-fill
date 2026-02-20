import { configByIdSelector, useAppSelector } from '@acf-options-page/store';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { useConfigId } from './useConfigId';

export function useConfig(): IConfiguration | undefined {
  const configId = useConfigId();
  return useAppSelector((state) => configByIdSelector(state, configId));
}
