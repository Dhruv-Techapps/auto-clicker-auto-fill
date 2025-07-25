interface NavigationStep {
  type: 'navigate';
  url: string;
}

interface SetViewportStep {
  type: 'setViewport';
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  isLandscape: boolean;
}
interface ChangeStep {
  target: string;
  type: 'change';
  selectors: Array<Array<string>>;
  value: string;
}

interface ClickStep {
  target: string;
  type: 'click' | 'doubleClick';
  selectors: Array<Array<string>>;
  offsetY: number;
  offsetX: number;
}

interface KeyStep {
  target: string;
  type: 'keyDown' | 'keyUp';
  key: string;
}

interface AssertedEvents {
  type: string;
  url: string;
  title: string;
}

export type Step = (NavigationStep | SetViewportStep | ChangeStep | ClickStep | KeyStep) & { assertedEvents?: Array<AssertedEvents>; timeout: number };
export interface Recording {
  title: string;
  steps: Array<Step>;
}
