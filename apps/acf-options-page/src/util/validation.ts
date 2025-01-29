export const IN_VALID_CLASS = 'is-invalid';
export const NUMBER_FIELDS = ['retry', 'retryInterval', 'recheck', 'recheckInterval', 'repeat', 'repeatInterval', 'initWait'];

document.addEventListener('keyup', (e) => {
  const ele = e.target as HTMLInputElement;
  const { value, pattern, required } = ele;
  let isValid = true;
  if (pattern) {
    if (!new RegExp(pattern).test(value)) {
      isValid = false;
    }
  }
  if (isValid && required && !value) {
    isValid = false;
  }
  if (isValid) {
    ele.classList.remove(IN_VALID_CLASS);
  } else {
    ele.classList.add(IN_VALID_CLASS);
  }
});
