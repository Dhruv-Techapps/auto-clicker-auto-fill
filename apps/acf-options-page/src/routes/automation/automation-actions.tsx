import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { ROUTES } from '@acf-options-page/util';
import { Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';

interface AutomationActionsProps {
  onToggleEditMode: () => void;
}

export const AutomationActions = ({ onToggleEditMode }: AutomationActionsProps) => {
  const config = useAutomation();
  const navigate = useNavigate();

  if (!config) {
    return null;
  }

  return (
    <Col xs='auto'>
      {config.initWait !== undefined && config.initWait > 0 && (
        <Button variant='link' onClick={onToggleEditMode}>
          <i className='bi bi-hourglass-split me-2' />
        </Button>
      )}
      {config.schedule && (
        <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_SCHEDULE)} title='schedule'>
          <i className='bi bi-stopwatch-fill me-2' />
        </Button>
      )}
      {config.watch && (
        <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_MONITOR)}>
          <i className='bi bi-eye-fill me-2' />
        </Button>
      )}
      {config.batch && (
        <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_LOOP)}>
          <i className='bi bi-arrow-repeat me-2' />
        </Button>
      )}
      <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_SETTINGS)}>
        <i className='bi bi-gear' />
      </Button>
    </Col>
  );
};
