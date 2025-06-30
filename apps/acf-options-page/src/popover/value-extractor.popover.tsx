import { OverlayTrigger, Popover } from 'react-bootstrap';

export function ValueExtractorPopover() {
  return (
    <OverlayTrigger
      trigger='click'
      placement='right'
      rootClose
      overlay={
        <Popover id='popover-basic'>
          <Popover.Body>
            <h6>Attribute Selector</h6>
            <ul>
              <li>
                <code>@id</code> to extract id of element
              </li>
              <li>
                <code>@class</code> to extract class of element
              </li>
              <li>
                Similar or attribute can be extracted by appending with <code>@</code>
              </li>
            </ul>
            <h6>Regex</h6>
            <ul>
              <li>
                <code>\d+.\d*</code> float number extract $<span className='text-primary'>123.00</span> only
              </li>
              <li>
                <code>\d+</code> number extract $<span className='text-primary'>123</span>.00 only
              </li>
              <li>
                <code>\d+\.?</code> flag <code>g</code> number extract <span className='text-primary'>12000.00</span> from $12,000.00
              </li>
            </ul>
          </Popover.Body>
        </Popover>
      }
    >
      <i className='bi bi-info-circle ms-2 text-muted' />
    </OverlayTrigger>
  );
}
