import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LogoutButton from './components/LogoutButton';

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div>
      {!isAdminPage && <Navbar />}
      {isAdminPage && (
        <div
          style={{
            backgroundColor: '#082742',
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '1rem',
          }}
        >
          <LogoutButton />
        </div>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
