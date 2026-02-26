import { IAddon } from '@dhruv-techapps/acf-common';
import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

const FLAGS = [
  {
    value: 'g',
    label: () => (
      <>
        <b className='text-danger'>g</b>lobal
      </>
    ),
    sub: "Don't return after first match"
  },
  {
    value: 'm',
    label: () => (
      <>
        <b className='text-danger'>m</b>ulti line
      </>
    ),
    sub: '^ and $ match start/end of line'
  },
  {
    value: 'i',
    label: () => (
      <>
        <b className='text-danger'>i</b>nsensitive
      </>
    ),
    sub: 'Case insensitive match'
  },
  {
    value: 'x',
    label: () => (
      <>
        e<b className='text-danger'>x</b>tended
      </>
    ),
    sub: 'Ignore whitespace'
  },
  {
    value: 's',
    label: () => (
      <>
        <b className='text-danger'>s</b>ingle line
      </>
    ),
    sub: 'Dot matches newline'
  }
];

interface Flags {
  [index: string]: boolean;
}

interface PreCheckValueExtractorFlagsProps {
  watch: UseFormWatch<IAddon>;
  setValue: UseFormSetValue<IAddon>;
}

export function PreCheckValueExtractorFlags({ watch, setValue }: PreCheckValueExtractorFlagsProps) {
  const valueExtractor = watch('valueExtractor');
  const valueExtractorFlags = watch('valueExtractorFlags') || '';

  const flags: Flags = valueExtractorFlags.split('').reduce((a, flag) => ({ ...a, [flag]: true }), {});

  const title = (label?: string) => {
    const flagTitle = Object.entries(flags)
      .filter((flag) => flag[1])
      .reduce((a, [flag]) => a + flag, '');
    return flagTitle || label;
  };

  const onFlagsClick = (e: React.MouseEvent<HTMLElement>) => {
    const {
      dataset: { flag },
      classList
    } = e.currentTarget;

    if (flag) {
      flags[flag] = !classList.contains('active');
      setValue('valueExtractorFlags', title() || '');
    }
  };

  if (!valueExtractor || /^@\w+(-\w+)?$/.test(valueExtractor)) {
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
