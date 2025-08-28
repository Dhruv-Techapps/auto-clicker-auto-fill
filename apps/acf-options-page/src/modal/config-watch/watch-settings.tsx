import { ChangeEvent, Fragment } from 'react';
import { Card, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { updateWatch, watchSelector } from '../../store/config';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getFieldNameValue, REGEX } from '../../util';

// Watch (DOM observer) settings block split out of action-settings modal
function WatchSettings() {
  const { t } = useTranslation();
  const { watch } = useAppSelector(watchSelector);
  const dispatch = useAppDispatch();

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const update = getFieldNameValue(e, watch);
    if (update) {
      dispatch(updateWatch(update));
    }
  };

  return (
    <Card bg='info-subtle' text='info-emphasis' className='mt-3'>
      <Card.Body>
        <Row className='mb-3'>
          <Col md={12} sm={12}>
            <Form.Check type='switch' name='watchEnabled' checked={watch?.watchEnabled || false} onChange={onUpdate} label={t('modal.watch.enabled', 'Enable Watching')} />
            <small className='text-muted'>
              {t('modal.watch.enabledHint', 'Automatically re-run actions when new matching elements are added to the page (e.g., for infinite scrolling, async content)')}
            </small>
          </Col>
        </Row>
        {watch?.watchEnabled && (
          <Fragment>
            <hr className='my-3' />
            <Row className='mb-3'>
              <Col md={6} sm={12}>
                <InputGroup>
                  <InputGroup.Text>{t('modal.watch.rootSelector', 'Watch Root')}</InputGroup.Text>
                  <FormControl placeholder={t('modal.watch.rootSelectorPlaceholder', 'body')} name='watchRootSelector' onBlur={onUpdate} defaultValue={watch?.watchRootSelector || 'body'} />
                </InputGroup>
                <small className='text-muted'>{t('modal.watch.rootSelectorHint', 'CSS selector for container to observe')}</small>
              </Col>

              <Col md={6} sm={12}>
                <InputGroup>
                  <InputGroup.Text>
                    {t('modal.watch.debounce', 'Debounce')}&nbsp;<small className='text-muted'>({t('common.sec', 'sec')})</small>
                  </InputGroup.Text>
                  <FormControl
                    placeholder={t('modal.watch.debounce', 'Debounce')}
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
                <small className='text-muted'>{t('modal.watch.debounceHint', 'Delay before processing new elements (1-5 seconds)')}</small>
              </Col>
            </Row>
          </Fragment>
        )}
      </Card.Body>
    </Card>
  );
}

export { WatchSettings };
