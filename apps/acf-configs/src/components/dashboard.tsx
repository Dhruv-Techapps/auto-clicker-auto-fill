import { Footer, Header } from '@dhruv-techapps/ui';

import { Outlet } from 'react-router-dom';
import { User } from './header/user';

export const Dashboard = () => {
  return (
    <>
      <Header>
        <User />
      </Header>
      <main className='container-fluid'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};