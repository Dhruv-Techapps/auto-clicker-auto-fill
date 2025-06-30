import { OverlayTrigger, Popover, Table } from 'react-bootstrap';
import { APP_LINK } from '../util/constants';

export function ValuePopover() {
  return (
    <OverlayTrigger
      trigger='click'
      placement='right'
      rootClose
      overlay={
        <Popover id='popover-basic'>
          <Popover.Body>
            <Table bordered striped className='mt-3'>
              <tbody>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/ai`} target='_blank' rel='noopener noreferrer'>
                      AI
                    </a>
                  </td>
                  <td>
                    <code>openai::your prompt</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/captcha`} target='_blank' rel='noopener noreferrer'>
                      Captcha
                    </a>
                  </td>
                  <td>
                    <code>Image:://img[@class="captcha-img"]</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/google-sheets`} target='_blank' rel='noopener noreferrer'>
                      Google Sheets
                    </a>
                  </td>
                  <td>
                    <code>GoogleSheets::Sheet1!A1</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/clipboard`} target='_blank' rel='noopener noreferrer'>
                      Clipboard
                    </a>
                  </td>
                  <td>
                    <code>Clipboard::Copy::[.]{6}</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/select-option`} target='_blank' rel='noopener noreferrer'>
                      Select Option
                    </a>
                  </td>
                  <td>
                    <code>true</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/scroll-to`} target='_blank' rel='noopener noreferrer'>
                      Scroll To
                    </a>
                  </td>
                  <td>
                    <code>ScrollTo::Bottom</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/mouse-events`} target='_blank' rel='noopener noreferrer'>
                      Mouse Events
                    </a>
                  </td>
                  <td>
                    <code>MouseEvents::dblclick</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/form-events`} target='_blank' rel='noopener noreferrer'>
                      Form Events
                    </a>
                  </td>
                  <td>
                    <code>FormEvents::submit</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/query-param`} target='_blank' rel='noopener noreferrer'>
                      Query Param
                    </a>
                  </td>
                  <td>
                    <code>Query::param</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/batch-repeat`} target='_blank' rel='noopener noreferrer'>
                      Batch Repeat
                    </a>
                  </td>
                  <td>
                    <code>email&lt;batchRepeat&gt; -&gt; email1, email2</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/location-command`} target='_blank' rel='noopener noreferrer'>
                      Location Command
                    </a>
                  </td>
                  <td>
                    <code>LocationCommand::href::https://getautoclicker.com</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/window-command`} target='_blank' rel='noopener noreferrer'>
                      Window Command
                    </a>
                  </td>
                  <td>
                    <code>WindowCommand::close</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/attribute`} target='_blank' rel='noopener noreferrer'>
                      Attribute Command
                    </a>
                  </td>
                  <td>
                    <code>Attr::set::disabled::false</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action-value/class`} target='_blank' rel='noopener noreferrer'>
                      Class Command
                    </a>
                  </td>
                  <td>
                    <code>Class::add::btn</code>
                  </td>
                </tr>
                <tr>
                  <td>Plain text</td>
                  <td>
                    <code>Hello World</code>
                  </td>
                </tr>
              </tbody>
            </Table>
            <div className='text-right'>
              <a href={`${APP_LINK.DOCS}action-value/overview`} target='_blank' rel='noopener noreferrer'>
                more
              </a>
            </div>
          </Popover.Body>
        </Popover>
      }
    >
      <i className='bi bi-info-circle ms-2 text-muted' />
    </OverlayTrigger>
  );
}
