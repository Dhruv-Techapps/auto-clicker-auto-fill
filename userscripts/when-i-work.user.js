// ==UserScript==
// @name         When I Work
// @namespace    https://getautoclicker.com/
// @version      1.2
// @description  Pick the schedule
// @author       Dhruv Techapps
// @match        https://appx.wheniwork.com/requests/shift
// @match        https://test.getautoclicker.com
// @match        https://contentmarketinginstitute.com/articles/tools-website-load-time/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_notification
// ==/UserScript==

(function () {
  'use strict';
  const WAIT_BEFORE_START = 1; // Wait before starting the script in seconds (0.3 seconds)
  const RELOAD_INTERVAL_MS = '5e8'; // Reload interval in seconds (1 second) and randomize between 1 and 3 seconds
  const TIMES = ['8:00am', '8:30am', '9:m', '9:30am', '10am', '10:30am', '11am', '11:30a', '12pm', '12:30pm', '1pm', '1:30pm', '2pm', '2:30pm', '3pm', '3:30pm', '4:30p'];
  const LINES_ACCEPT = ['CARS General at CARS'];
  const DATE = [2025, 2, 13]; // Year, Month, Date , Month start from 0 so 0 is January and 11 is December

  const sleep = async (time) => {
    console.debug('sleep', time / 1000, 'sec');
    await new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  };
  const getWaitTime = (time) => {
    let waitTime;
    if (time) {
      if (typeof time === 'string') {
        if (/^\d+(\.\d+)?e\d+(\.\d+)?$/.test(time)) {
          const [start, end] = time
            .toString()
            .split('e')
            .map((n) => Number(n));
          waitTime = (Math.floor(Math.random() * (end - start)) + start) * 1000;
        }
      } else {
        waitTime = Number(time) * 1000;
      }
    }
    return waitTime;
  };

  const checkTimeDiff = (timeRange) => {
    // Split the string to get individual times
    const [startTime, endTime] = timeRange.split(' - ');
    if (!TIMES.includes(startTime)) {
      console.warn('TIMES out of range');
      return false;
    }

    // Function to convert time (e.g., '7p', '7:30p') into total minutes
    function parseTimeToMinutes(time) {
      const isPM = time.toLowerCase().includes('p'); // Check if it's PM
      const [hour, minute = '0'] = time.replace(/[ap]/i, '').split(':').map(Number);

      let totalMinutes = (hour % 12) * 60 + parseInt(minute, 10); // Convert hours and minutes to minutes
      if (isPM) totalMinutes += 12 * 60; // Add 12 hours for PM times
      return totalMinutes;
    }

    // Convert start and end times to minutes
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    console.debug('startMinutes', startMinutes, 'endMinutes', endMinutes);
    // Calculate the difference
    const differenceInMinutes = Math.abs(endMinutes - startMinutes);
    console.debug('differenceInMinutes', differenceInMinutes);
    return differenceInMinutes === 30; // Return true if the difference is at least 60 minutes
  };

  /**
   * Finds a node in the DOM using an XPath expression.
   *
   * @param {string} xpath - The XPath expression to locate the node.
   * @param {Document|Node} [context=document] - The context to evaluate the XPath (default is the entire document).
   * @returns {Node|null} - The first node that matches the XPath expression, or null if no match is found.
   */
  function getNodeByXPath(xpath, context = document) {
    try {
      const xpathResult = document.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return xpathResult.singleNodeValue;
    } catch (error) {
      console.error('Invalid XPath or context:', error);
      return null;
    }
  }
  window.onload = async () => {
    console.debug('Window loaded');
    // Delay the execution of the script
    await sleep(getWaitTime(WAIT_BEFORE_START));

    const rows = document.querySelectorAll('.ag-row-even');
    console.debug('rows', rows.length);
    for (const tr of rows) {
      console.debug('row', tr);
      const [, , , shift] = [...tr.querySelectorAll('div.ag-cell')];
      if (shift) {
        console.debug(shift);
        const [, , datetime, type] = shift.querySelectorAll('div');
        console.debug('datetime', datetime.innerText);
        const [date, time] = datetime.innerText.split(' | ');
        console.debug('date, time', date, time);
        const shiftDate = new Date(DATE).toDateString();
        console.debug('date comparison', date.replace(',', ''), shiftDate);
        console.debug(checkTimeDiff(time), time);

        if (date.replace(',', '') === shiftDate && checkTimeDiff(time)) {
          console.debug('LINES_ACCEPT', LINES_ACCEPT.includes(type.innerText));
          if (LINES_ACCEPT.includes(type.innerText)) {
            tr.click();
            await sleep(300);
            const node = getNodeByXPath(`//*[@id="main-content"]/div/div/div[1]/form/div[2]/div/button[2]/div`);
            node.click();
            GM_notification({ title: 'When I Work', text: `${datetime} ${type} shift picked`, image: 'https://appx.wheniwork.com/favicon.ico' });
          }
        }
      }
    }
    await sleep(getWaitTime(RELOAD_INTERVAL_MS));
    window.location.reload();
  };
  // Your code here...
})();
