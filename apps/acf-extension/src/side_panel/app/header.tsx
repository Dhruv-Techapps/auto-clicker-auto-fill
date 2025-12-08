interface IHeaderProps {
  query: string;
  setQuery: (query: string) => void;
}

export const Header = (props: IHeaderProps) => {
  return (
    <header className='bd-navbar navbar navbar-expand-lg navbar-light sticky-top px-3'>
      <nav className='d-flex w-100'>
        <a href='/' className='navbar-brand mb-0 h1 ps-3'>
          Configurations
        </a>
        <input type='search' placeholder='Search' className='form-control' value={props.query} onInput={(e) => props.setQuery((e.target as HTMLInputElement).value)} />
      </nav>
    </header>
  );
};
