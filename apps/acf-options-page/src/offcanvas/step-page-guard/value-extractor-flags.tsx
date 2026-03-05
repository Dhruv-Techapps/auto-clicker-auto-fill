import { IAddon } from '@dhruv-techapps/acf-common';
import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const FLAG_KEYS = [
  {
    value: 'g',
    label: () => (
      <>
        <b className='text-danger'>g</b>lobal
      </>
    ),
    subKey: 'popover.flags.global'
  },
  {
    value: 'm',
    label: () => (
      <>
        <b className='text-danger'>m</b>ulti line
      </>
    ),
    subKey: 'popover.flags.multiLine'
  },
  {
    value: 'i',
    label: () => (
      <>
        <b className='text-danger'>i</b>nsensitive
      </>
    ),
    subKey: 'popover.flags.insensitive'
  },
  {
    value: 'x',
    label: () => (
      <>
        e<b className='text-danger'>x</b>tended
      </>
    ),
    subKey: 'popover.flags.extended'
  },
  {
    value: 's',
    label: () => (
      <>
        <b className='text-danger'>s</b>ingle line
      </>
    ),
    subKey: 'popover.flags.singleLine'
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
  const { t } = useTranslation();
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
    <DropdownButton variant='outline-secondary' title={title(t('popover.flags.title'))} data-testid='value-extractor-flags' id='value-extractor-flags' align='end'>
      {FLAG_KEYS.map(({ value, label, subKey }) => (
        <Dropdown.Item href='#' key={value} active={flags[value]} onClick={onFlagsClick} data-flag={value}>
          {label()} <br />
          <small className='fw-light'>{t(subKey)}</small>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
