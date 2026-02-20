import { REGEX } from '@acf-options-page/util';
import { IWatchSettings } from '@dhruv-techapps/acf-common';
import { Fragment } from 'react';
import { Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface WatchSettingsProps {
  register: UseFormRegister<IWatchSettings>;
  watchEnabled: boolean | undefined;
}

// Watch (DOM observer) settings block split out of action-settings modal
function WatchSettings({ register, watchEnabled }: WatchSettingsProps) {
  const { t } = useTranslation();

  return (
    <div>
      <Row className='mb-3'>
        <Col md={12} sm={12}>
          <Form.Check type='switch' id='watch-enabled' label={t('modal.watch.enabled', 'Enable Watching')} {...register('watchEnabled')} />
          <small className='text-muted'>
            {t('modal.watch.enabledHint', 'Automatically re-run actions when new matching elements are added to the page (e.g., for infinite scrolling, async content)')}
          </small>
        </Col>
      </Row>
      {watchEnabled && (
        <Fragment>
          <hr className='my-3' />
          <Row className='mb-3'>
            <Col md={12} sm={12} className='mb-3'>
              <InputGroup>
                <InputGroup.Text>{t('modal.watch.rootSelector', 'Watch Root')}</InputGroup.Text>
                <FormControl placeholder={t('modal.watch.rootSelectorPlaceholder', 'body')} {...register('watchRootSelector')} />
              </InputGroup>
              <small className='text-muted'>{t('modal.watch.rootSelectorHint', 'CSS selector for container to observe')}</small>
            </Col>
            <Col md={6} sm={12}>
              <InputGroup>
                <InputGroup.Text>{t('modal.watch.watchAttributes', 'Watch Attributes')}</InputGroup.Text>
                <FormControl placeholder={t('modal.watch.attributesPlaceholder', 'style, class, hidden')} {...register('watchAttributes')} />
              </InputGroup>
              <small className='text-muted'>{t('modal.watch.attributesHint', 'Comma-separated list of attributes to observe for changes')}</small>
            </Col>
            <Col md={6} sm={12}>
              <InputGroup>
                <InputGroup.Text>
                  {t('modal.watch.debounce', 'Debounce')}&nbsp;<small className='text-muted'>({t('common.sec', 'sec')})</small>
                </InputGroup.Text>
                <FormControl type='number' min='1' max='5' {...register('debounce', { pattern: { value: new RegExp(REGEX.NUMBER), message: t('error.number') }, min: 1, max: 5 })} />
                <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
              </InputGroup>
              <small className='text-muted'>{t('modal.watch.debounceHint', 'Delay before processing new elements (1-5 seconds)')}</small>
            </Col>
          </Row>
        </Fragment>
      )}
    </div>
  );
}

export { WatchSettings };
