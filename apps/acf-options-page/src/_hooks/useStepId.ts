import { TRandomUUID } from '@dhruv-techapps/core-common';
import { useParams } from 'react-router';

export function useStepId(): TRandomUUID {
  const { stepId } = useParams<{ stepId: TRandomUUID }>();
  if (!stepId) {
    throw new Error('useStepId must be used within a route that provides a stepId param');
  }
  return stepId;
}
