import { EErrorOptions, IAction, IActionStatement, IUserScript } from '@dhruv-techapps/acf-common';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ActionStatementRetryProps {
  readonly register: UseFormRegister<IActionStatement>;
  readonly watch: UseFormWatch<IActionStatement>;
  readonly actions: Array<IAction | IUserScript>;
}

export const StepConditionRetry = ({ register, watch, actions }: ActionStatementRetryProps) => {
  const { t } = useTranslation();
  const option = watch('option');

  return (
    <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
      <Card.Body>
        <Row>
          <Col xs={12} className='mb-2'>
            {t('stateGuard.hint')}
          </Col>
          <Col>
            <Form.Check type='radio' required value={EErrorOptions.STOP} label={t('stateGuard.stop')} {...register('option')} />
          </Col>
          <Col>
            <Form.Check type='radio' required value={EErrorOptions.SKIP} label={t('stateGuard.skip')} {...register('option')} />
          </Col>
          <Col>
            <Form.Check type='radio' required value={EErrorOptions.RELOAD} label={t('stateGuard.refresh')} {...register('option')} />
          </Col>
          <Col>
            <Form.Check type='radio' required value={EErrorOptions.GOTO} label={t('stateGuard.goto')} {...register('option')} />
          </Col>
        </Row>
        {option === EErrorOptions.GOTO && (
          <Row>
            <Col xs={{ span: 4, offset: 8 }}>
              <Form.Select {...register('goto')} required>
                {actions.map((_action, index) => (
                  <option key={_action.id} value={_action.id}>
                    {index + 1} . {_action.name ?? 'Action or Userscript'}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};
