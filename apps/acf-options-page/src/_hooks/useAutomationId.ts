import { TRandomUUID } from '@dhruv-techapps/core-common';
import { useParams } from 'react-router';

export function useAutomationId(): TRandomUUID {
  const { automationId } = useParams<{ automationId: TRandomUUID }>();
  if (!automationId) {
    throw new Error('useAutomationId must be used within a route that provides an automationId param');
  }
  return automationId;
}
