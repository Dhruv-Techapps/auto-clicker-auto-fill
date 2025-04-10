import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { actionAddonSelector, updateActionAddon } from '../../store/config';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const FLAGS = [
  {
    value: 'g',
    label: () => (
      <>
        <b className='text-danger'>g</b>lobal
      </>
    ),
    sub: "Don't return after first match",
  },
  {
    value: 'm',
    label: () => (
      <>
        <b className='text-danger'>m</b>ulti line
      </>
    ),
    sub: '^ and $ match start/end of line',
  },
  {
    value: 'i',
    label: () => (
      <>
        <b className='text-danger'>i</b>nsensitive
      </>
    ),
    sub: 'Case insensitive match',
  },
  {
    value: 'x',
    label: () => (
      <>
        e<b className='text-danger'>x</b>tended
      </>
    ),
    sub: 'Ignore whitespace',
  },
  {
    value: 's',
    label: () => (
      <>
        <b className='text-danger'>s</b>ingle line
      </>
    ),
    sub: 'Dot matches newline',
  },
];

type Flags = {
  [index: string]: boolean;
};

function AddonValueExtractorFlags() {
  const { addon } = useAppSelector(actionAddonSelector);
  const dispatch = useAppDispatch();

  const flags: Flags = addon.valueExtractorFlags?.split('').reduce((a, flag) => ({ ...a, [flag]: true }), {}) || {};

  const title = (label?: string) => {
    const flagTitle = Object.entries(flags)
      .filter((flag) => flag[1])
      .reduce((a, [flag]) => a + flag, '');
    return flagTitle || label;
  };

  const onFlagsClick = (e: React.MouseEvent<HTMLElement>) => {
    const flagElement = e.currentTarget;
    const {
      dataset: { flag },
      classList,
    } = flagElement;

    if (flag) {
      flags[flag] = !classList.contains('active');
      dispatch(updateActionAddon({ name: 'valueExtractorFlags', value: title() || '' }));
    }
  };

  if (!addon.valueExtractor || /^@\w+(-\w+)?$/.test(addon.valueExtractor)) {
    return null;
  }

  return (
    <DropdownButton variant='outline-secondary' title={title('flags')} data-testid='value-extractor-flags' id='value-extractor-flags' align='end'>
      {FLAGS.map(({ value, label, sub }) => (
        <Dropdown.Item href='#' key={value} active={flags[value]} onClick={onFlagsClick} data-flag={value}>
          {label()} <br />
          <small className='fw-light'>{sub}</small>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export { AddonValueExtractorFlags };
