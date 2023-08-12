import React, { ChangeEvent, FormEvent, forwardRef, useImperativeHandle, useState } from 'react';
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { StorageService } from '@dhruv-techapps/core-service';
import { useTranslation } from 'react-i18next';
import { Configuration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { ErrorAlert } from '../components';
import { dataLayerModel } from '../util/data-layer';

type RemoveConfigsModalRef = {
  showRemove: () => void;
};

type RemoveConfigsModalProps = Configuration & { checked?: boolean };

const RemoveConfigsModal = forwardRef<RemoveConfigsModalRef>((_, ref) => {
  const [configs, setConfigs] = useState<Array<RemoveConfigsModalProps>>([]);
  const [error, setError] = useState();
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const onSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filteredConfigs = configs
      .filter((config) => !config.checked)
      .map((config) => {
        delete config.checked;
        return config;
      });
    StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.CONFIGS]: filteredConfigs })
      .then(() => {
        setShow(false);
        window.location.reload();
      })
      .catch(setError);
  };

  useImperativeHandle(ref, () => ({
    showRemove() {
      StorageService.get<Array<RemoveConfigsModalProps>>(window.EXTENSION_ID, LOCAL_STORAGE_KEY.CONFIGS)
        .then((configs) => {
          setConfigs(
            configs.map((prevConfig, prevConfigIndex) => {
              if (!prevConfig.name) {
                const url = prevConfig.url.split('/');
                prevConfig.name = url[2] || `config-${prevConfigIndex}`;
              }
              return prevConfig;
            })
          );
        })
        .catch(setError);
      setShow(true);
    },
  }));

  const handleClose = () => {
    dataLayerModel('remove-configs', 'close');
    setShow(false);
  };

  const remove = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.currentTarget;
    setConfigs(
      configs.map((config, index) => {
        if (index === Number(name)) {
          config.checked = checked;
        }
        return config;
      })
    );
  };

  const checkedConfigLength = () => configs.filter((config) => config.checked).length + 1;

  return (
    <Modal show={show} size="lg" onHide={handleClose} scrollable onShow={() => dataLayerModel('remove-configs', 'open')}>
      <Form onSubmit={onSubmit} id="remove-configs">
        <Modal.Header>
          <Modal.Title as="h6">{t('configuration.removeConfigs')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
          <ErrorAlert error={error} />
          <p className="text-muted">This action cant be reverted.</p>
          <ListGroup>
            {configs.map((config, index) => (
              <ListGroup.Item key={index}>
                <Form.Check
                  type="checkbox"
                  checked={config.checked || false}
                  onChange={remove}
                  className={config.checked ? 'text-danger' : ''}
                  name={`remove-configs-${index}`}
                  disabled={!config.checked && configs.length === checkedConfigLength()}
                  id={`configuration-checkbox-${index}`}
                  label={
                    <>
                      {config.name}
                      {!config.enable && (
                        <Badge pill bg="secondary" className="ms-2">
                          {t('common.disabled')}
                        </Badge>
                      )}
                    </>
                  }
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button type="button" variant="outline-primary px-5" onClick={handleClose}>
            {t('common.close')}
          </Button>
          <Button type="submit" variant="danger px-5" className="ml-3" id="remove-configs-button">
            {t('configuration.removeConfigs')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
});
RemoveConfigsModal.displayName = 'RemoveConfigsModal';
const memo = React.memo(RemoveConfigsModal);
export { memo as RemoveConfigsModal };
