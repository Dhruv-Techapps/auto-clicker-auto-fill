/* eslint-disable @typescript-eslint/no-namespace */
import { Button, ButtonGroup, Card, CardBody, Col, Form, Modal, Row, ToggleButton } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { subscribeSelector, switchSubscribeModal } from '../store/subscribe';

import * as React from 'react';
import { AwardFill, Discord, Fire, Star } from '../util';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
const SubscribeModal = () => {
  const { visible, isSubscribing } = useAppSelector(subscribeSelector);
  const [yearly, setYearly] = React.useState('year');
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(switchSubscribeModal());
  };

  return (
    <Modal show={visible} size='lg' onHide={handleClose} data-testid='subscription-modal' id='subscription-modal'>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Subscribe to Advance Features</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} className='d-flex justify-content-center mb-3'>
              <ButtonGroup>
                <ToggleButton variant='outline-secondary' id='month' type='radio' value='month' checked={yearly === 'month'} className='px-5 py-2' onChange={() => setYearly('month')}>
                  Monthly
                </ToggleButton>
                <ToggleButton variant='outline-primary' id='yearly' type='radio' value='yearly' checked={yearly === 'year'} className='px-5 py-2' onChange={() => setYearly('year')}>
                  Yearly
                </ToggleButton>
              </ButtonGroup>
            </Col>
            <Col className='d-flex justify-content-center mb-3 text-danger'>
              {yearly === 'month' && (
                <div>
                  <Fire /> Save 2 months on yearly subscription
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ height: '100%' }}>
                <CardBody className='d-flex row-gap-3 flex-column '>
                  <h5>Pro subscription</h5>
                  <div>
                    <div className='d-flex align-items-center'>
                      <h1 className='m-0 me-2'>{yearly === 'year' ? '100' : '10'}$</h1>
                      <small className='text-grey'>
                        per
                        <br />
                        {yearly}
                      </small>
                    </div>
                    <Button variant='primary' target='_blank' href='https://getautoclicker.com/docs/4.x/about/subscription/' disabled={isSubscribing} className='px-5 py-2 mt-3 w-100'>
                      {isSubscribing && <span className='spinner-border spinner-border-sm me-3' aria-hidden='true'></span>}
                      Upgrade to Pro
                    </Button>
                  </div>
                  <div>
                    <p className='p-0 m-0'>This includes:</p>
                    <ul style={{ listStyle: 'none' }}>
                      <li>Unlimited Google Sheets</li>
                      <li>Unlimited Discord Messaging</li>
                      <li>Captcha resolver (Coming Soon)</li>
                      <li>No Ads</li>
                      <li>
                        <Discord /> VIP Assistance over Discord
                      </li>
                      <li>
                        <Star /> Early access to new Features
                      </li>
                      <li>
                        <AwardFill /> Pride and Joy
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
      </Form>
    </Modal>
  );
};
export { SubscribeModal };
