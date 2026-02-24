import { useAutomationId } from '@acf-options-page/_hooks';
import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { DropdownToggle } from '@acf-options-page/components';
import { actionSelector, addAction, addUserscript, setColumnVisibility } from '@acf-options-page/store/config';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { Button, ButtonGroup, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import StepTable from './step-table';

function Step() {
  const { t } = useTranslation();
  const configId = useAutomationId();
  const config = useAutomation();
  const dispatch = useAppDispatch();

  const { columnVisibility } = useAppSelector(actionSelector);

  const onAddAction = () => {
    dispatch(addAction({ configId }));
  };

  const onAddUserscript = () => {
    dispatch(addUserscript({ configId }));
  };

  const onColumnChange = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement>) => {
    const column = e.currentTarget.getAttribute('data-column');
    if (!column) {
      return;
    }
    dispatch(setColumnVisibility(column));
  };

  if (!config) {
    return null;
  }

  const { actions } = config;

  return (
    <div className='h-100'>
      <Container fluid>
        <Row className='p-2'>
          <Col className='d-flex align-items-center text-body-tertiary'>{t('step.title')}</Col>
          <Col xs='auto' className='d-flex align-items-center'>
            <Dropdown className='ml-2' id='acton-column-filter-wrapper'>
              <Dropdown.Toggle as={DropdownToggle} id='acton-column-filter' className='p-0 me-3' aria-label='Toggle Action Column'>
                <i className='bi bi-filter fs-4' />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onColumnChange} data-column='name' active={columnVisibility.name}>
                  {t('step.name')}
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='initWait' active={columnVisibility.initWait}>
                  {t('step.initWait')}
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='repeat' active={columnVisibility.repeat}>
                  {t('step.repeat')}
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='repeatInterval' active={columnVisibility.repeatInterval}>
                  {t('step.repeatInterval')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown as={ButtonGroup} size='sm'>
              <Button onClick={onAddAction} variant='outline-primary'>
                {t('common.add')}
              </Button>
              <Dropdown.Toggle id='step-add' variant='outline-primary'></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onAddAction}>
                  <i className='bi bi-plus-circle me-2' /> {t('step.add')}
                </Dropdown.Item>
                <Dropdown.Item onClick={onAddUserscript}>
                  <i className='bi bi-plus-circle me-2' /> {t('userscript.add')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
      <StepTable actions={actions} />
    </div>
  );
}
export default Step;
