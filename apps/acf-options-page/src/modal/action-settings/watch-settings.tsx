import { EActionWatchRestartMode } from '@dhruv-techapps/acf-common';
import { ChangeEvent, Fragment } from 'react';
import { Card, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { actionWatchSelector, updateActionWatch } from '../../store/config/action/watch';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { REGEX } from '../../util';
import { getFieldNameValue } from '../../util/element';
import { LifecycleStopConditions } from './watch/lifecycle-stop-conditions';

// Watch (DOM observer) settings block split out of action-settings modal
function WatchSettings() {
  const { t } = useTranslation();
  const { watch } = useAppSelector(actionWatchSelector);
  const dispatch = useAppDispatch();

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const update = getFieldNameValue(e, watch);
    if (update) {
      let value: any = update.value;
      if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
        value = Number(value);
      }
      dispatch(updateActionWatch({ name: update.name, value }));
    }
  };

  return (
    <Card bg='info-subtle' text='info-emphasis' className='mt-3'>
      <Card.Header>
        <h6 className='mb-0'>{t('modal.actionSettings.watch.title', 'DOM Watcher Settings')}</h6>
      </Card.Header>
      <Card.Body>
        <Row className='mb-3'>
          <Col md={12} sm={12}>
            <Form.Check type='switch' name='watchEnabled' checked={watch?.watchEnabled || false} onChange={onUpdate} label={t('modal.actionSettings.watch.enabled', 'Enable DOM Watching')} />
            <small className='text-muted'>
              {t('modal.actionSettings.watch.enabledHint', 'Automatically re-run this action when new matching elements are added to the page (e.g., for infinite scrolling, async content)')}
            </small>
          </Col>
        </Row>
        {watch?.watchEnabled && (
          <Fragment>
            <Row className='mb-3'>
              <Col md={12} sm={12}>
                <InputGroup>
                  <InputGroup.Text>{t('modal.actionSettings.watch.rootSelector', 'Watch Root')}</InputGroup.Text>
                  <FormControl
                    placeholder={t('modal.actionSettings.watch.rootSelectorPlaceholder', 'body')}
                    name='watchRootSelector'
                    onBlur={onUpdate}
                    defaultValue={watch?.watchRootSelector || 'body'}
                  />
                </InputGroup>
                <small className='text-muted'>{t('modal.actionSettings.watch.rootSelectorHint', 'CSS selector for container to observe')}</small>
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={12}>
                <InputGroup>
                  <InputGroup.Text>{t('modal.actionSettings.watch.restartMode', 'Restart Mode')}</InputGroup.Text>
                  <Form.Select name='restartMode' onChange={onUpdate} defaultValue={watch?.restartMode || EActionWatchRestartMode.SINGLE}>
                    <option value={EActionWatchRestartMode.SINGLE}>{t('modal.actionSettings.watch.restartMode.single', 'Single Action')}</option>
                    <option value={EActionWatchRestartMode.SEQUENCE}>{t('modal.actionSettings.watch.restartMode.sequence', 'From This Action')}</option>
                    <option value={EActionWatchRestartMode.FULL}>{t('modal.actionSettings.watch.restartMode.full', 'Full Sequence')}</option>
                  </Form.Select>
                </InputGroup>
                <small className='text-muted'>{t('modal.actionSettings.watch.restartModeHint', 'How to restart when DOM changes trigger this action')}</small>
              </Col>
              <Col md={6} sm={12}>
                <InputGroup>
                  <InputGroup.Text>
                    {t('modal.actionSettings.watch.debounce', 'Debounce')}&nbsp;<small className='text-muted'>({t('common.ms', 'ms')})</small>
                  </InputGroup.Text>
                  <FormControl
                    placeholder={t('modal.actionSettings.watch.debounce', 'Debounce')}
                    name='debounce'
                    type='number'
                    onBlur={onUpdate}
                    defaultValue={watch?.debounce ?? 1}
                    pattern={REGEX.NUMBER}
                    min='1'
                    max='5'
                  />
                  <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                </InputGroup>
                <small className='text-muted'>{t('modal.actionSettings.watch.debounceHint', 'Delay before processing new elements (1-5 seconds)')}</small>
              </Col>
              {/* <Col md={6} sm={12}>
                <InputGroup>
                  <InputGroup.Text>{t('modal.actionSettings.watch.maxRepeats', 'Max Repeats')}</InputGroup.Text>
                  <FormControl
                    placeholder={t('modal.actionSettings.watch.maxRepeats', 'Max Repeats')}
                    name='maxRepeats'
                    type='number'
                    onBlur={onUpdate}
                    defaultValue={settings.watch?.maxRepeats || 1}
                    pattern={REGEX.NUMBER}
                    min='1'
                    max='10'
                  />
                  <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                </InputGroup>
                <small className='text-muted'>{t('modal.actionSettings.watch.maxRepeatsHint', 'Maximum times to process the same element')}</small>
              </Col>*/}
            </Row>
            {/*<Row className='mb-2'>
              <Col md={6} sm={12}>
                <Form.Check
                  type='switch'
                  name='visibilityCheck'
                  checked={settings.watch?.visibilityCheck || false}
                  onChange={onUpdate}
                  label={t('modal.actionSettings.watch.visibilityCheck', 'Visibility Check')}
                />
                <small className='text-muted'>{t('modal.actionSettings.watch.visibilityCheckHint', 'Only process elements that are visible in viewport')}</small>
              </Col>
            </Row>*/}
            <Col md={12} sm={12}>
              <hr />
            </Col>
            <LifecycleStopConditions />
          </Fragment>
        )}
      </Card.Body>
    </Card>
  );
}

export { WatchSettings };
