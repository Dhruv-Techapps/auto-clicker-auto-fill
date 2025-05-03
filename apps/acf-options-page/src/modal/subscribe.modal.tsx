/* eslint-disable @typescript-eslint/no-namespace */
import { Button, Card, CardBody, Col, Form, Modal, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { subscribeSelector, switchSubscribeModal } from '../store/subscribe';

import * as React from 'react';
import { AwardFill, Discord, Star } from '../util';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
const SubscribeModal = () => {
  const { visible, isSubscribing } = useAppSelector(subscribeSelector);
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
            <Col>
              <Card style={{ height: '100%' }}>
                <CardBody className='d-flex row-gap-3 flex-column '>
                  <h5>Pro subscription</h5>
                  <div>
                    <div className='d-flex align-items-center'>
                      <h1 className='m-0 me-2'>10$</h1>
                      <small className='text-grey'>
                        per
                        <br />
                        month
                      </small>
                    </div>
                    <Button variant='primary' target='_blank' href='https://github.com/sponsors/Dhruv-Techapps' disabled={isSubscribing} className='px-5 py-2 mt-3 w-100'>
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
