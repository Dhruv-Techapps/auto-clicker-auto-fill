import { Col, Container, Image, Row } from 'react-bootstrap';
import { SPONSORS } from '../util/constants';

export function Sponsors() {
  return (
    <Container className='sponsors'>
      <Row className='my-2'>
        <Col className='px-4'>
          <b className='text-muted mb-2 d-block'>Sponsored By</b>
          <div className='d-flex flex-column flex-sm-row'>
            {SPONSORS.map((sponsor) => (
              <a href={sponsor.link} key={sponsor.id} target='_blank' rel='noreferrer' className='me-3 mb-3'>
                {sponsor.title ? (
                  <>
                    <Image width={30} height={30} roundedCircle src={sponsor.image} className='me-2' />
                    {sponsor.title}
                  </>
                ) : (
                  <Image width={256} height={40} src={sponsor.image} />
                )}
              </a>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
