import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { updateConfig, useAppDispatch } from '@acf-options-page/store';
import { ROUTES } from '@acf-options-page/util';
import { Button, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface AutomationActionsProps {
  onToggleEditMode: () => void;
}

export const AutomationActions = ({ onToggleEditMode }: AutomationActionsProps) => {
  const { t } = useTranslation();
  const config = useAutomation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (!config) {
    return null;
  }

  const onToggleEnable = () => {
    dispatch(updateConfig({ configId: config.id, enable: !config.enable }));
  };

  return (
    <Col xs='auto'>
      {config.initWait !== undefined && config.initWait > 0 && (
        <OverlayTrigger placement='left' overlay={<Tooltip id='init-wait-tooltip'>{t('automation.initWait')}</Tooltip>}>
          <Button variant='link' onClick={onToggleEditMode}>
            <i className='bi bi-hourglass-split me-2' />
          </Button>
        </OverlayTrigger>
      )}
      {config.schedule && (
        <OverlayTrigger placement='left' overlay={<Tooltip id='schedule-tooltip'>{t('schedule.title')}</Tooltip>}>
          <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_SCHEDULE)} title={t('schedule')}>
            <i className='bi bi-stopwatch-fill me-2' />
          </Button>
        </OverlayTrigger>
      )}
      {config.watch && (
        <OverlayTrigger placement='left' overlay={<Tooltip id='monitor-tooltip'>{t('monitor.title')}</Tooltip>}>
          <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_MONITOR)}>
            <i className='bi bi-eye-fill me-2' />
          </Button>
        </OverlayTrigger>
      )}
      {config.batch && (
        <OverlayTrigger placement='left' overlay={<Tooltip id='batch-tooltip'>{t('loop.title')}</Tooltip>}>
          <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_LOOP)}>
            <i className='bi bi-arrow-repeat me-2' />
          </Button>
        </OverlayTrigger>
      )}
      <OverlayTrigger placement='left-start' overlay={<Tooltip id='edit-mode-tooltip'>{t('automation.disable-tooltip')}</Tooltip>}>
        <Form.Switch type='switch' id='edit-mode-switch' checked={config.enable} onChange={onToggleEnable} className='d-inline-block me-2' />
      </OverlayTrigger>
      <OverlayTrigger placement='left' overlay={<Tooltip id='edit-mode-tooltip'>{t('automationSettings.title')}</Tooltip>}>
        <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_SETTINGS)}>
          <i className='bi bi-gear' />
        </Button>
      </OverlayTrigger>
    </Col>
  );
};
