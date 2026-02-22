import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { HotkeyPopover } from '@acf-options-page/popover';
import { updateConfigSettings, useAppDispatch } from '@acf-options-page/store';
import { getFieldNameValue, REGEX } from '@acf-options-page/util';
import { defaultHotkey, ELoadTypes, EStartTypes, EUrlMatch, IBypass } from '@dhruv-techapps/acf-common';
import { t } from 'i18next';
import { ChangeEvent } from 'react';
import { Col, Form, FormControl, InputGroup, Offcanvas, Row } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router';

interface AutomationSettingsOffcanvasProps {
  show: boolean;
}

export const AutomationSettingsOffcanvas = ({ show }: AutomationSettingsOffcanvasProps) => {
  const dispatch = useAppDispatch();
  const config = useAutomation();
  const navigate = useNavigate();
  const handleClose = () => navigate(-1);

  if (!config) {
    return null;
  }
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
    if (value) {
      if (e.keyCode >= 65 && e.keyCode < 91) {
        value += String.fromCharCode(e.keyCode);
        if (e.currentTarget) {
          e.currentTarget.value = value;
        }
      }
    }
    return false;
  };

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const update = getFieldNameValue(e, config);
    if (update) {
      dispatch(updateConfigSettings({ ...update, configId: config.id }));
    }
  };

  const onBypassUpdate = () => {
    const bypass: IBypass = {};
    document.querySelectorAll("[id^='bypass.']").forEach((element) => {
      const { name, checked } = element as HTMLInputElement;
      // @ts-expect-error "making is generic function difficult for TypeScript"
      bypass[name] = checked;
    });
    dispatch(updateConfigSettings({ name: 'bypass', value: bypass, configId: config.id }));
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true} style={{ width: '800px' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('modal.configSettings.title')}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row>
          <Col md={12} sm={12}>
            {t('modal.configSettings.start')}&nbsp;
            <Form.Check
              inline
              type='radio'
              id='startAuto'
              name='startType'
              value={EStartTypes.AUTO}
              onChange={onUpdate}
              checked={config.startType === EStartTypes.AUTO}
              label={t('modal.configSettings.auto')}
            />
            <Form.Check
              inline
              type='radio'
              id='startManual'
              name='startType'
              onChange={onUpdate}
              value={EStartTypes.MANUAL}
              checked={config.startType === EStartTypes.MANUAL}
              label={t('modal.configSettings.manual')}
            />
            <small className='text-body-tertiary'>
              <ul className='mb-0 mt-2'>
                <li>
                  <Trans i18nKey='modal.configSettings.autoHint' components={{ b: <b /> }} />
                </li>
                <li>
                  <Trans i18nKey='modal.configSettings.manualHint' components={{ b: <b /> }} />
                </li>
              </ul>
            </small>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={12} sm={12} hidden={config.startType === EStartTypes.AUTO}>
            <InputGroup>
              <InputGroup.Text>{t('modal.configSettings.hotkey')}</InputGroup.Text>
              <FormControl placeholder={defaultHotkey} onKeyDown={onKeyDown} defaultValue={config.hotkey || defaultHotkey} name='hotkey' onBlur={onUpdate} pattern={REGEX.HOTKEY} />
              <InputGroup.Text>
                <HotkeyPopover />
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col md={12} sm={12} hidden={config.startType === EStartTypes.MANUAL}>
            {t('modal.configSettings.extensionLoad')}&nbsp;
            <Form.Check
              inline
              type='radio'
              id='loadTypeWindow'
              value={ELoadTypes.WINDOW}
              onChange={onUpdate}
              checked={config.loadType === ELoadTypes.WINDOW}
              name='loadType'
              label={t('modal.configSettings.window')}
            />
            <Form.Check
              inline
              type='radio'
              id='loadTypeDocument'
              value={ELoadTypes.DOCUMENT}
              onChange={onUpdate}
              checked={config.loadType === ELoadTypes.DOCUMENT}
              name='loadType'
              label={t('modal.configSettings.document')}
            />
            <span className='mx-2 border-start'></span>
            <Form.Check inline type='switch' id='triggerUrlChange' onChange={onUpdate} checked={config.triggerUrlChange} name='triggerUrlChange' label={t('modal.configSettings.triggerUrlChange')} />
            <small className='text-body-tertiary'>
              <ul className='mb-0 mt-2'>
                <li>
                  <Trans i18nKey='modal.configSettings.windowHint' components={{ b: <b /> }} />
                </li>
                <li>
                  <Trans i18nKey='modal.configSettings.documentHint' components={{ b: <b /> }} />
                </li>
                <li>
                  <Trans i18nKey='modal.configSettings.triggerUrlChangeHint' components={{ b: <b /> }} />
                </li>
              </ul>
            </small>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md='12' sm='12'>
            <InputGroup>
              <InputGroup.Text>Google Sheets ID</InputGroup.Text>
              <FormControl name='spreadsheetId' defaultValue={config.spreadsheetId} autoComplete='off' onBlur={onUpdate} placeholder='Google Sheets ID' />
            </InputGroup>
            <small className='text-body-tertiary'>
              https://docs.google.com/spreadsheets/d/<code>1J2OcSNJsnYQCcQmA4K9Fhtv8yqvg0NouB--H4B0jsZA</code>/
            </small>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md='12' sm='12'>
            <InputGroup>
              <InputGroup.Text>{t('configuration.startTime')}</InputGroup.Text>
              <FormControl name='startTime' pattern={REGEX.START_TIME} autoComplete='off' defaultValue={config.startTime} onBlur={onUpdate} placeholder='HH:mm:ss:fff' list='start-time' />
              <Form.Control.Feedback type='invalid'>{t('error.startTime')}</Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md='12' sm='12'>
            <InputGroup>
              <InputGroup.Text>{t('modal.configSettings.urlMatch')}</InputGroup.Text>
              <Form.Select value={config.url_match} onChange={onUpdate} name='url_match' required>
                {Object.entries(EUrlMatch).map((condition) => (
                  <option key={condition[1]} value={condition[1]}>
                    {t(`modal.configSettings.${condition[0].toLowerCase()}`)}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md='12' sm='12'>
            <Form.Label>Bypass browser default</Form.Label>
            <div className='d-flex'>
              <Form.Check inline type='switch' id='bypass.alert' value='alert' onChange={onBypassUpdate} checked={config.bypass?.alert || false} name='alert' label=' alert' />
              <Form.Check inline type='switch' id='bypass.confirm' value='confirm' onChange={onBypassUpdate} checked={config.bypass?.confirm || false} name='confirm' label='confirm' />
              <Form.Check inline type='switch' id='bypass.prompt' value='prompt' onChange={onBypassUpdate} checked={config.bypass?.prompt || false} name='prompt' label='prompt' />
            </div>
          </Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
