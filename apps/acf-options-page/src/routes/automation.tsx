import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router';
import { AutomationActions } from './automation/automation-actions';
import { AutomationEdit } from './automation/automation-edit';
import { AutomationMenu } from './automation/automation-menu';
import { AutomationNew } from './automation/automation-new';
import Step from './automation/step';

export const Automation = () => {
  const config = useAutomation();

  const [editMode, setEditMode] = useState(false);

  if (!config) {
    return null;
  }

  return (
    <div>
      {config.url ? (
        <>
          <Container fluid className='border-bottom'>
            <Row className='p-2 align-items-center'>
              <AutomationMenu onToggleEditMode={() => setEditMode(!editMode)} />
              <Col className='text-center text-body-tertiary' style={{ marginLeft: '-120px' }}>
                <small>{config.url}</small>
              </Col>
              <AutomationActions onToggleEditMode={() => setEditMode(!editMode)} />
            </Row>
          </Container>
          {editMode && <AutomationEdit onDone={() => setEditMode(false)} />}
          <Step />
        </>
      ) : (
        <AutomationNew />
      )}
      <Outlet />
    </div>
  );
};
