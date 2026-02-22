import { EErrorOptions, IAction, IActionStatement, IUserScript } from '@dhruv-techapps/acf-common';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ActionStatementRetryProps {
  readonly register: UseFormRegister<IActionStatement>;
  readonly watch: UseFormWatch<IActionStatement>;
  readonly actions: Array<IAction | IUserScript>;
}

export const ActionStatementRetry = ({ register, watch, actions }: ActionStatementRetryProps) => {
  const { t } = useTranslation();
  const option = watch('option');

  return (
    <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
      <Card.Body>
        <Row>
          <Col xs={12} className='mb-2'>
            {t('stepCondition.hint')}
          </Col>
          <Col>
            <Form.Check type='radio' required value={EErrorOptions.STOP} label={t('stepCondition.stop')} {...register('option')} />
          </Col>
          <Col>
            <Form.Check type='radio' required value={EErrorOptions.SKIP} label={t('stepCondition.skip')} {...register('option')} />
          </Col>
          <Col>
            <Form.Check type='radio' required value={EErrorOptions.RELOAD} label={t('stepCondition.refresh')} {...register('option')} />
          </Col>
          <Col>
            <Form.Check type='radio' required value={EErrorOptions.GOTO} label={t('stepCondition.goto')} {...register('option')} />
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
