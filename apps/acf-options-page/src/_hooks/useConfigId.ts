import { TRandomUUID } from '@dhruv-techapps/core-common';
import { useParams } from 'react-router';

export function useConfigId(): TRandomUUID {
  const { configId } = useParams<{ configId: TRandomUUID }>();
  if (!configId) {
    throw new Error('useConfigId must be used within a route that provides a configId param');
  }
  return configId;
}
