import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  visible?: boolean;
  message: React.ReactNode;
  title?: string;
  headerClass?: string;
  noClick: () => void;
  yesClick: () => void;
}

const ConfirmModal = ({ visible, message, title, headerClass, noClick, yesClick }: ConfirmModalProps) => {
  const { t } = useTranslation();
  const onShow = () => {
    //:TODO
  };
  const onHide = () => {
    //:TODO
  };
  return (
    <Modal show={visible} centered backdrop='static' keyboard={false} onShow={onShow} onHide={onHide} data-testid='confirm-modal'>
      <Modal.Body className='p-4 text-center'>
        <h4 className={`my-3 fw-normal ${headerClass}`}>{title || 'Confirm'}</h4>
        {message}
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant='link' className='text-decoration-none col-6 m-0 rounded-0 border-end' size='lg' onClick={noClick} data-testid='confirm-modal-no'>
          {t('common.no')}
        </Button>
        <Button variant='link' className={`text-decoration-none col-6 m-0 rounded-0 ${headerClass}`} size='lg' onClick={yesClick} data-testid='confirm-modal-yes'>
          {t('common.yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
ConfirmModal.displayName = 'ConfirmModal';
export { ConfirmModal };
