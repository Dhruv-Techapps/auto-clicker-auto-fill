import { Footer, Header } from '@dhruv-techapps/ui-components';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import aa from 'search-insights';
import { auth } from '../firebase';
import { EXTENSIONS } from '../util/constant';
import { User } from './header/user';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const onHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  useEffect(() => {
    auth.authStateReady().then(() => {
      if (auth.currentUser) {
        aa('setUserToken', auth.currentUser.uid);
      }
    });
  }, []);

  useEffect(() => {
    if (chrome.runtime?.sendMessage) {
      EXTENSIONS.forEach(({ id }, index) => {
        chrome.runtime.sendMessage(id, { messenger: 'manifest', methodName: 'value', message: 'version' }, (response) => {
          if (response?.version) {
            EXTENSIONS[index].version = response.version;
          }
        });
      });
    }
  }, []);

  return (
    <>
      <Header onHomeClick={onHomeClick}>
        <User />
      </Header>
      <Outlet />
      <Footer />
    </>
  );
};

export default Home;
