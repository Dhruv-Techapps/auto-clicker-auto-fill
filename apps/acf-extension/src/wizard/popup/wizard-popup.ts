import { WizardAction } from '../type';

export class AutoClickerAutoFillPopup extends HTMLElement {
  autoHideCount = 3;

  static get observedAttributes() {
    return ['actions'];
  }

  constructor() {
    super();
    const template = (document.getElementById('auto-clicker-autofill-popup') as HTMLTemplateElement).content;
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.cloneNode(true));
    this.setI18n();
    this.attachEventListener();
  }

  setI18n() {
    const docsTestElement = this.shadowRoot?.querySelector('#docs-text') as HTMLElement;
    const chatTestElement = this.shadowRoot?.querySelector('#chat-text') as HTMLElement;
    const advanceTestElement = this.shadowRoot?.querySelector('#advance-text') as HTMLElement;
    const sponsorElement = this.shadowRoot?.querySelector('#sponsor-text') as HTMLElement;
    if (docsTestElement) {
      docsTestElement.innerText = chrome.i18n.getMessage('@DOCS');
    }
    if (chatTestElement) {
      chatTestElement.innerText = chrome.i18n.getMessage('@CHAT');
    }
    if (advanceTestElement) {
      advanceTestElement.innerText = chrome.i18n.getMessage('@ADVANCE');
    }
    if (sponsorElement) {
      sponsorElement.innerText = chrome.i18n.getMessage('@SPONSOR');
    }
  }

  attachEventListener() {
    this.shadowRoot?.addEventListener('click', (e) => {
      e.stopPropagation();
      const element = e.composedPath()[0] as HTMLElement;
      if (element.nodeName === 'BUTTON') {
        if (element.hasAttribute('auto-generate-config')) {
          this.dispatchEvent(new CustomEvent('auto-generate-config'));
        }
      }
    });

    // Close modal popup
    this.shadowRoot?.querySelector('[data-bs-dismiss="modal"]')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('close'));
    });
    this.expandCollapse();
  }

  setHoverEvent(tbody: HTMLTableSectionElement) {
    tbody.querySelectorAll('tr').forEach((element) => {
      element.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        const { title } = e.currentTarget as HTMLTableRowElement;
        this.dispatchEvent(new CustomEvent('enter', { detail: { xpath: title } }));
      });
      element.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        const { title } = e.currentTarget as HTMLTableRowElement;
        this.dispatchEvent(new CustomEvent('leave', { detail: { xpath: title } }));
      });
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        const { title } = e.currentTarget as HTMLTableRowElement;
        this.dispatchEvent(new CustomEvent('element-focus', { detail: { xpath: title } }));
      });
      // Remove button
      element.querySelector('button')?.addEventListener('click', (e) => {
        const index = (e.currentTarget as HTMLButtonElement)?.getAttribute('index');
        this.dispatchEvent(new CustomEvent('remove', { detail: { index } }));
      });
    });
  }

  expandCollapse() {
    const collapse = this.shadowRoot?.querySelector('[aria-label="collapse"]');
    collapse?.addEventListener('click', () => {
      collapse.classList.toggle('expand');
      this.shadowRoot?.querySelectorAll('[id^="collapse"]').forEach((e) => e.classList.toggle('collapse'));
    });
  }

  connectedCallback() {
    const name = this.getAttribute('name');
    const settings = this.getAttribute('settings');
    if (settings) {
      this.shadowRoot?.querySelector('#settings')?.setAttribute('href', settings);
      if (name) {
        (this.shadowRoot?.querySelector('.modal-title') as HTMLHeadingElement).innerText = name;
      }
    }
  }

  attributeChangedCallback() {
    this.crateTable();
  }

  autoHide() {
    this.autoHideCount -= 1;
    if (this.autoHideCount === 0) {
      (this.shadowRoot?.querySelector('[aria-label="collapse"]') as HTMLButtonElement).click();
    }
  }

  crateTable() {
    const actionsAttribute = this.getAttribute('actions');
    const actions: Array<WizardAction> = actionsAttribute && JSON.parse(actionsAttribute);
    if (!actions || actions.length === 0) {
      (this.shadowRoot?.querySelector('slot[name="actions"]') as HTMLSlotElement).hidden = true;
      (this.shadowRoot?.querySelector('slot[name="no-actions"]') as HTMLSlotElement).hidden = false;
    } else {
      this.autoHide();
      (this.shadowRoot?.querySelector('slot[name="actions"]') as HTMLSlotElement).hidden = false;
      (this.shadowRoot?.querySelector('slot[name="no-actions"]') as HTMLSlotElement).hidden = true;
      const tbody = this.shadowRoot?.querySelector('tbody');
      if (tbody) {
        tbody.innerText = '';
        actions.forEach(({ name, value, elementFinder, elementValue }, index) => {
          const tr = (document.getElementById('auto-clicker-autofill-popup-tr') as HTMLTemplateElement).content.cloneNode(true) as HTMLTableRowElement;
          const tds = tr.querySelectorAll('td div') as NodeListOf<HTMLTableCellElement>;
          if (elementValue) {
            tds[0].innerText = `${name}::${elementValue}`;
          } else {
            tds[0].innerText = name ?? elementFinder;
          }
          tr.children[0].setAttribute('title', elementFinder);
          tds[1].innerText = value ?? 'Click';
          tr.querySelector('button')?.setAttribute('index', String(index));
          tbody.appendChild(tr);
        });
        this.setHoverEvent(tbody);
      }
    }
  }
}

window.customElements.define('auto-clicker-autofill-popup', AutoClickerAutoFillPopup);
