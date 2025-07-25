import { IAction } from '@dhruv-techapps/acf-common';

export type WizardAction = IAction & { elementType?: string; elementValue?: string; checked?: boolean; xpath?: string };
