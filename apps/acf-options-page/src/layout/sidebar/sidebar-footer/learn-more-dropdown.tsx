import { Nav, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LINKS = [
  { href: 'https://getautoclicker.com/docs/4.x/getting-started', title: 'docs', label: 'Docs' },
  { href: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/issues', title: 'issues', label: 'Issues' },
  { href: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/discussions', title: 'discussion', label: 'Discussion' },
  { href: 'https://test.getautoclicker.com/', title: 'practice form', label: 'Practice Form' }
];

export const LearnMoreDropdown = () => {
  const { t } = useTranslation();
  return (
    <NavDropdown
      title={
        <div className='d-inline-flex align-items-center w-100 text-secondary-emphasis'>
          <i className='bi bi-info-circle me-2' /> {t('learnMore')}
        </div>
      }
      drop='end'
      as='div'
    >
      {LINKS.map(({ href, title, label }) => (
        <NavDropdown.Item key={href} className='p-0'>
          <Nav.Link href={href} target='_blank' rel='noopener noreferrer' title={title} className='d-flex align-items-center justify-content-between w-100 gap-2 text-secondary-emphasis'>
            {label} <i className='bi bi-box-arrow-up-right fs-6' />
          </Nav.Link>
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};
