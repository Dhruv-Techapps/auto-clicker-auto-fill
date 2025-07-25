import { TRandomUUID } from '@dhruv-techapps/core-common';

export interface IUserScript {
  id: TRandomUUID;
  disabled?: boolean;
  actionId?: number;
  error?: string[];
}
