import { Events } from '@dhruv-techapps/acf-events';
import { MainWorldService } from '@dhruv-techapps/acf-main-world/service';

export class ACFEvents {
  static async check(elementFinder: string, elements: Array<HTMLElement>, value?: string) {
    const element = elements[0];
    if (/^(A|AREA)$/.test(element.tagName) && /javascript/gi.test((element as HTMLAnchorElement).href)) {
      MainWorldService.click(elementFinder);
      return;
    }
    await Events.check(elements, value);
  }
}
