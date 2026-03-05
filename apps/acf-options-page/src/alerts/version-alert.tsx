import { appSelector, useAppSelector } from '@acf-options-page/store';
import { Alert } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da > db) return 1;
    if (da < db) return -1;
  }
  return 0;
}

export const VersionAlert = () => {
  const { manifest } = useAppSelector(appSelector);
  const { t } = useTranslation();

  if (!manifest?.version) return null;

  if (compareVersions(manifest.version, '4.1.9') >= 0) return null;

  return (
    <Alert variant='warning' className='mb-0 text-center p-1 rounded-0'>
      <strong>{t('versionAlert.securityUpdate')}</strong> <Trans i18nKey='versionAlert.message' components={{ 1: <strong /> }} />
      <a href='https://github.com/advisories/GHSA-wphj-fx3q-84ch' target='_blank' rel='noopener noreferrer' className='alert-link ms-1'>
        {t('versionAlert.learnMore')}
      </a>
      .<span className='d-inline-block ms-1'>{t('versionAlert.update')}</span>
    </Alert>
  );
};
