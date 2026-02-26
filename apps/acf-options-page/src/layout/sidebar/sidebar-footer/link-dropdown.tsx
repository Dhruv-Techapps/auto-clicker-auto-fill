import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface ILinkDropdownProps {
  links: { href: string; title: string; label: string; icon: string }[];
  title: string;
  icon: string;
}
export const LinkDropdown = (props: ILinkDropdownProps) => {
  const { links, title, icon } = props;
  const { t } = useTranslation();
  return (
    <NavDropdown
      title={
        <div className='d-inline-flex align-items-center w-100 text-secondary-emphasis'>
          <i className={`bi ${icon} me-2`} /> {t(title)}
        </div>
      }
      drop='end'
      as='div'
    >
      {links.map(({ href, title, label, icon }) => (
        <NavDropdown.Item key={href} href={href} className='d-flex align-items-center w-100 gap-2 text-secondary-emphasis' target='_blank' rel='noopener noreferrer' title={title} aria-label={label}>
          <i className={`bi ${icon}`} />
          {label}
          <i className='bi bi-box-arrow-up-right ms-auto fs-6' />
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};
