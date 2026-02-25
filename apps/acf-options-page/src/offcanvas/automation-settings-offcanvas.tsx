import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { HotkeyPopover } from '@acf-options-page/popover';
import { updateConfig, useAppDispatch } from '@acf-options-page/store';
import { REGEX } from '@acf-options-page/util';
import { defaultHotkey, ELoadTypes, EStartTypes, EUrlMatch, IConfiguration } from '@dhruv-techapps/acf-common';
import { Button, Col, Form, FormControl, FormGroup, InputGroup, Offcanvas, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

type ConfigSettingsFormData = Pick<IConfiguration, 'startType' | 'hotkey' | 'loadType' | 'triggerUrlChange' | 'spreadsheetId' | 'startTime' | 'url_match' | 'bypass'>;

interface AutomationSettingsOffcanvasProps {
  show: boolean;
}

export const AutomationSettingsOffcanvas = ({ show }: AutomationSettingsOffcanvasProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useForm<ConfigSettingsFormData>({
    mode: 'onChange',
    defaultValues: {
      startType: config?.startType,
      hotkey: config?.hotkey || defaultHotkey,
      loadType: config?.loadType,
      triggerUrlChange: config?.triggerUrlChange,
      spreadsheetId: config?.spreadsheetId,
      startTime: config?.startTime,
      url_match: config?.url_match,
      bypass: config?.bypass
    }
  });

  if (!config) {
    return null;
  }

  const handleClose = () => navigate(-1);
  const startType = watch('startType');

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let value = '';
    if (e.ctrlKey) {
      value += 'Ctrl + ';
    } else if (e.altKey) {
      value += 'Alt + ';
    }
    if (e.shiftKey) {
      value += 'Shift + ';
    }
    if (value && e.keyCode >= 65 && e.keyCode < 91) {
      value += String.fromCharCode(e.keyCode);
      setValue('hotkey', value, { shouldDirty: true });
    }
  };

  const onSubmit = (data: ConfigSettingsFormData) => {
    if (data.startType === EStartTypes.AUTO) {
      data.hotkey = undefined;
    }
    dispatch(updateConfig({ configId: config.id, ...data }));
    navigate(-1);
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true}>
      <Form onSubmit={handleSubmit(onSubmit)} className='h-100 d-flex flex-column' noValidate>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('automationSettings.title')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='flex-grow-1 overflow-auto'>
          <Row>
            <Col md={12} sm={12}>
              <Form.Label className='me-2'>{t('automationSettings.startType')}</Form.Label>
              <Form.Check inline type='radio' id='startAuto' value={EStartTypes.AUTO} label={t('automationSettings.auto')} {...register('startType')} />
              <Form.Check inline type='radio' id='startManual' value={EStartTypes.MANUAL} label={t('automationSettings.manual')} {...register('startType')} />
              <small className='text-body-tertiary'>
                <ul className='mb-0 mt-2'>
                  <li>
                    <Trans i18nKey='automationSettings.autoHint' components={{ b: <b /> }} />
                  </li>
                  <li>
                    <Trans i18nKey='automationSettings.manualHint' components={{ b: <b /> }} />
                  </li>
                </ul>
              </small>
            </Col>
          </Row>
          <hr />
          <Row>
            <FormGroup as={Col} md={12} sm={12} hidden={startType === EStartTypes.AUTO} controlId='hotkey'>
              <Form.Label>{t('automationSettings.hotkey')}</Form.Label>
              <InputGroup>
                <FormControl
                  placeholder={defaultHotkey}
                  onKeyDown={onKeyDown}
                  autoComplete='off'
                  readOnly
                  {...register('hotkey', { pattern: { value: REGEX.HOTKEY, message: t('error.hotkey') } })}
                  isInvalid={!!errors.hotkey}
                />
                <Form.Control.Feedback type='invalid'>{errors.hotkey?.message}</Form.Control.Feedback>
                <InputGroup.Text>
                  <HotkeyPopover />
                </InputGroup.Text>
              </InputGroup>
            </FormGroup>
            <Col md={12} sm={12} hidden={startType === EStartTypes.MANUAL}>
              <Form.Label className='me-2'>{t('automationSettings.loadType')}</Form.Label>
              <Form.Check inline type='radio' id='loadTypeWindow' value={ELoadTypes.WINDOW} label={t('automationSettings.window')} {...register('loadType')} />
              <Form.Check inline type='radio' id='loadTypeDocument' value={ELoadTypes.DOCUMENT} label={t('automationSettings.document')} {...register('loadType')} />
              <span className='mx-2 border-start'></span>
              <Form.Check inline type='switch' id='triggerUrlChange' label={t('automationSettings.triggerUrlChange')} {...register('triggerUrlChange')} />
              <small className='text-body-tertiary'>
                <ul className='mb-0 mt-2'>
                  <li>
                    <Trans i18nKey='automationSettings.windowHint' components={{ b: <b /> }} />
                  </li>
                  <li>
                    <Trans i18nKey='automationSettings.documentHint' components={{ b: <b /> }} />
                  </li>
                  <li>
                    <Trans i18nKey='automationSettings.triggerUrlChangeHint' components={{ b: <b /> }} />
                  </li>
                </ul>
              </small>
            </Col>
          </Row>
          <hr />
          <Row>
            <Form.Group controlId='spreadsheetId' as={Col} md='12' sm='12'>
              <Form.Label>{t('automationSettings.googleSheetsId')}</Form.Label>
              <Form.Control
                {...register('spreadsheetId', { pattern: { value: REGEX.SPREADSHEET_ID, message: t('error.spreadsheetId') } })}
                autoComplete='off'
                isInvalid={!!errors.spreadsheetId}
                placeholder='1J2OcSNJsnYQCcQmA4K9Fhtv8yqvg0NouB--H4B0jsZA'
              />
              <Form.Control.Feedback type='invalid'>{errors.spreadsheetId?.message}</Form.Control.Feedback>
            </Form.Group>
            <small className='text-body-tertiary'>
              https://docs.google.com/spreadsheets/d/<span className='text-body-secondary'>1J2OcSNJsnYQCcQmA4K9Fhtv8yqvg0NouB--H4B0jsZA</span>/
            </small>
          </Row>
          <hr />
          <Row>
            <Form.Group controlId='startTime' as={Col} md='12' sm='12'>
              <Form.Label>{t('automationSettings.startTime')}</Form.Label>
              <Form.Control
                {...register('startTime', { pattern: { value: REGEX.START_TIME, message: t('error.startTime') } })}
                autoComplete='off'
                placeholder='HH:mm:ss:fff'
                list='start-time'
                isInvalid={!!errors.startTime}
              />
              <Form.Control.Feedback type='invalid'>{errors.startTime?.message}</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <hr />
          <Row>
            <Form.Group controlId='urlMatch' as={Col} md='12' sm='12'>
              <Form.Label>{t('automationSettings.urlMatch')}</Form.Label>
              <Form.Select {...register('url_match')}>
                {Object.entries(EUrlMatch).map(([label, val]) => (
                  <option key={val} value={val}>
                    {t(`automationSettings.${label.toLowerCase()}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>
          <hr />
          <Row>
            <Col md='12' sm='12'>
              <Form.Label>{t('automationSettings.bypass.title')}</Form.Label>
              <div className='d-flex'>
                <Form.Check inline type='switch' id='bypass.alert' label={t('automationSettings.bypass.alert')} {...register('bypass.alert')} />
                <Form.Check inline type='switch' id='bypass.confirm' label={t('automationSettings.bypass.confirm')} {...register('bypass.confirm')} />
                <Form.Check inline type='switch' id='bypass.prompt' label={t('automationSettings.bypass.prompt')} {...register('bypass.prompt')} />
              </div>
            </Col>
          </Row>
        </Offcanvas.Body>
        <div className='offcanvas-footer d-flex justify-content-between p-3 border-top'>
          <Button type='button' variant='outline-primary' className='px-5' onClick={handleClose}>
            {t('common.close')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='config-settings-save' disabled={!isDirty || !isValid}>
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};
