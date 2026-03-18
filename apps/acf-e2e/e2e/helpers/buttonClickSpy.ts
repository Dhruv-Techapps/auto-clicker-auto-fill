// helpers/buttonClickSpy.js

import { Page } from "@playwright/test";

/**
 * Spy on a button and detect if it gets clicked within a timeout.
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector of the button to spy on
 * @param {number} timeout - Max wait time in ms (default: 3000)
 * @returns {Promise<boolean>} - true if clicked, false if timed out
 */
export async function wasButtonClicked(page:Page, selector:string, timeout = 3000) {
  return page.evaluate(
    ({ selector, timeout }) => {
      return new Promise((resolve) => {
        const btn = document.querySelector(selector);
        if (!btn) return resolve(false);

        btn.addEventListener('click', () => resolve(true), { once: true });
        setTimeout(() => resolve(false), timeout);
      });
    },
    { selector, timeout }
  );
}


/**
 * Wait until a button is clicked or throw on timeout.
 * Useful when you want the test to fail explicitly instead of returning false.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {number} timeout
 */
export async function expectButtonClicked(page:Page, selector:string, timeout = 3000) {
  const clicked = await wasButtonClicked(page, selector, timeout);
  if (!clicked) {
    throw new Error(
      `Expected button "${selector}" to be clicked within ${timeout}ms, but it was not.`
    );
  }
}