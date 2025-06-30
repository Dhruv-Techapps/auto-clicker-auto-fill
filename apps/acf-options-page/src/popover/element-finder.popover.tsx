import { OverlayTrigger, Popover, Table } from 'react-bootstrap';
import { APP_LINK } from '../util/constants';

export function ElementFinderPopover() {
  return (
    <OverlayTrigger
      trigger='click'
      rootClose
      placement='right'
      overlay={
        <Popover id='popover-basic'>
          <Popover.Body>
            <Table bordered striped className='mt-3'>
              <thead>
                <tr>
                  <th>getElementBy</th>
                  <th>Element Finder</th>
                  <th># of elements</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action/element-finder/#get-element-by-id`} target='_blank' rel='noopener noreferrer'>
                      getElementById
                    </a>
                  </td>
                  <td>
                    <code>#username</code>
                    <br />
                    <code>Id::username</code>
                  </td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action/element-finder/#get-elements-by-classname`} target='_blank' rel='noopener noreferrer'>
                      getElementsByClassName
                    </a>
                  </td>
                  <td>
                    <code>ClassName::form-control test</code>
                  </td>
                  <td>&gt;1</td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action/element-finder/#get-elements-by-name`} target='_blank' rel='noopener noreferrer'>
                      getElementsByName
                    </a>
                  </td>
                  <td>
                    <code>Name::login</code>
                  </td>
                  <td>&gt;1</td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action/element-finder/#get-elements-by-tag-name`} target='_blank' rel='noopener noreferrer'>
                      getElementsByTagName
                    </a>
                  </td>
                  <td>
                    <code>TagName::input</code>
                  </td>
                  <td>&gt;1</td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action/element-finder/#query-selector`} target='_blank' rel='noopener noreferrer'>
                      querySelector
                    </a>
                  </td>
                  <td>
                    <code>Selector::input</code>
                    <br />
                    <code>Selector::input[type]</code>
                    <br />
                    <code>Selector::input[disabled]</code>
                    <br />
                    <code>Selector::input[type=&apos;password&apos;]</code>
                    <br />
                    <code>Selector::input[name=&apos;login&apos;]</code>
                    <br />
                    <code>Selector::input#username</code>
                    <br />
                    <code>Selector::input.form-control.test</code>
                    <br />
                  </td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action/element-finder/#query-selector-all`} target='_blank' rel='noopener noreferrer'>
                      querySelectorAll
                    </a>
                  </td>
                  <td>
                    <code>SelectorAll::input</code>
                  </td>
                  <td>&gt;1</td>
                </tr>
                <tr>
                  <td>
                    <a href={`${APP_LINK.DOCS}action/element-finder/#xpath`} target='_blank' rel='noopener noreferrer'>
                      XPath
                    </a>
                  </td>
                  <td>
                    <code>&#47;&#47;input[contains(@class,&apos;test&apos;)]</code>
                  </td>
                  <td>&gt;1</td>
                </tr>
              </tbody>
            </Table>
          </Popover.Body>
        </Popover>
      }
    >
      <i className='bi bi-info-circle ms-2 text-muted' />
    </OverlayTrigger>
  );
}
