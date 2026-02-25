import { download } from '@acf-options-page/_helpers/download';
import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { duplicateConfig, removeConfigs, updateConfig, useAppDispatch } from '@acf-options-page/store';
import { ROUTES } from '@acf-options-page/util';
import { APP_LINK } from '@acf-options-page/util/constants';
import { ChangeEvent } from 'react';
import { Col, Dropdown, FormControl, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface AutomationMenuProps {
  onToggleEditMode: () => void;
}

export const AutomationMenu = ({ onToggleEditMode }: AutomationMenuProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();
  const navigate = useNavigate();

  if (!config) {
    return null;
  }

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = { name: e.target.name, value: e.target.value };
    dispatch(updateConfig({ configId: config.id, [update.name]: update.value }));
  };

  const onDuplicateConfig = () => {
    dispatch(duplicateConfig(config.id));
  };

  const onDeleteConfig = () => {
    dispatch(removeConfigs([config.id]));
    navigate(-1);
  };

  const onToggleEnable = () => {
    dispatch(updateConfig({ configId: config.id, enable: !config.enable }));
  };

  return (
    <Col xs='auto'>
      <Dropdown as={InputGroup} size='sm'>
        <FormControl name='name' className='border border-secondary' defaultValue={config.name || config.url || config.id} autoComplete='off' onBlur={onUpdate} placeholder={APP_LINK.TEST} />
        <Dropdown.Toggle split id='config-dropdown' variant='outline-secondary'></Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onToggleEditMode}>
            <i className='bi bi-pencil me-2' /> {t('automation.edit')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => download(config.name || config.url, config)}>
            <i className='bi bi-download me-2' /> {t('automation.export')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(ROUTES.AUTOMATION_SCHEDULE)}>
            <i className='bi bi-stopwatch-fill me-2' /> {t('automation.schedule')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(ROUTES.AUTOMATION_LOOP)}>
            <i className='bi bi-arrow-repeat me-2' /> {t('loop.title')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(ROUTES.AUTOMATION_MONITOR)}>
            <i className='bi bi-eye-fill me-2' /> {t('monitor.title')}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={onDuplicateConfig}>
            <i className='bi bi-copy me-2' /> {t('automation.duplicate')}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={onToggleEnable}>
            <i className={`bi bi-toggle-${config.enable ? 'on' : 'off'} me-2`} /> {t(`automation.${config.enable ? 'disable' : 'enable'}`)}
          </Dropdown.Item>
          <Dropdown.Item onClick={onDeleteConfig}>
            <i className='bi bi-trash me-2' /> {t('automation.remove')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Col>
  );
};
