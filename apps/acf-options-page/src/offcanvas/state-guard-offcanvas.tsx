import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { useStepId } from '@acf-options-page/_hooks/useStepId';
import { syncActionStatement, useAppDispatch } from '@acf-options-page/store';
import { EActionConditionOperator, EErrorOptions, IActionStatement, getDefaultActionCondition } from '@dhruv-techapps/acf-common';
import { Button, Form, Offcanvas, Table } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { StepConditionCondition } from './step-state-guard/step-condition-condition';
import { StepConditionRetry } from './step-state-guard/step-condition-retry';

interface StateGuardOffcanvasProps {
  show: boolean;
}

export const StateGuardOffcanvas = ({ show }: StateGuardOffcanvasProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();
  const navigate = useNavigate();
  const stepId = useStepId();

  const action = config?.actions.find((a) => a.id === stepId);

  const { register, handleSubmit, watch, control } = useForm<IActionStatement>({
    defaultValues: action?.statement ?? { conditions: [], option: EErrorOptions.STOP }
  });

  const { fields, append, update, remove } = useFieldArray({ control, name: 'conditions' });

  if (!config || !action) {
    return null;
  }

  const handleClose = () => navigate(-1);
  const { actions } = config;

  const addCondition = (operator?: EActionConditionOperator) => {
    append(getDefaultActionCondition(actions[0].id, operator));
  };

  const onSubmit = (data: IActionStatement) => {
    if (data.conditions.length > 0) {
      dispatch(syncActionStatement({ configId: config.id, actionId: stepId, statement: data }));
    }
    navigate(-1);
  };

  const onReset = () => {
    dispatch(syncActionStatement({ configId: config.id, actionId: stepId, statement: undefined }));
    navigate(-1);
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true} style={{ width: '800px' }}>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className='h-100 d-flex flex-column'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('stateGuard.title')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='flex-grow-1 overflow-auto'>
          <p className='text-muted'>{t('stateGuard.info')}</p>
          <Table className='mb-0'>
            <thead>
              <tr>
                <th>OPR</th>
                <th>Action</th>
                <th>Status</th>
                <th>
                  <Button type='button' variant='link' className='mt-2 p-0' aria-label='Add' onClick={() => addCondition(EActionConditionOperator.AND)}>
                    <i className='bi bi-plus-lg' />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <StepConditionCondition key={field.id} field={field} index={index} update={update} remove={remove} actions={actions} />
              ))}
            </tbody>
          </Table>
          {fields.length > 0 ? (
            <StepConditionRetry register={register} watch={watch} actions={actions} />
          ) : (
            <div className='p-5 d-flex justify-content-center'>
              <Button type='button' aria-label='Add' onClick={() => addCondition()}>
                <i className='bi bi-plus-lg' /> {t('stateGuard.add')}
              </Button>
            </div>
          )}
        </Offcanvas.Body>
        <div className='p-3 border-top d-flex justify-content-between'>
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='action-statement-reset'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='action-statement-save' disabled={fields.length === 0}>
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};
