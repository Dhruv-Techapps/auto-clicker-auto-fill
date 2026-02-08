import { Container, Form, ListGroup } from 'react-bootstrap';

export const Search = () => {
  return (
    <Container className='p-4'>
      <Form.Control size='lg' type='search' placeholder='Search' />
      <ListGroup>
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
    </Container>
  );
};
