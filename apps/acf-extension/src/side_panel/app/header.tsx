export type TPage = 'list' | 'record';

interface IHeaderProps {
  page: TPage;
  setPage: (page: TPage) => void;
}
export const Header = (props: IHeaderProps) => {
  const { page, setPage } = props;
  return (
    <div className='container-fluid'>
      <ul className='nav nav-underline nav-justified'>
        <li className='nav-item'>
          <a className={`nav-link ${page === 'list' ? 'active' : ''}`} href='#' onClick={() => setPage('list')}>
            Configuration
          </a>
        </li>
        <li className='nav-item'>
          <a className={`nav-link ${page === 'record' ? 'active' : ''}`} href='#' onClick={() => setPage('record')}>
            Recording
          </a>
        </li>
      </ul>
    </div>
  );
};
