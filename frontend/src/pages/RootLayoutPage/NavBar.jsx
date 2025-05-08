import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Sticky } from 'gestalt';

function NavBar() {
  const navigator = useNavigate();
  const location = useLocation();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const LOGIN_BUTTON = { text: 'Login', href: '/login', id: 'login' };
  const PROFILE_BUTTON = { text: 'Profile', href: '/profile', id: 'profile' };
  const LOGOUT_BUTTON = { text: 'Log out', href: '/log out', id: 'logout' };

  const [dynamicButton, setDynamicButton] = useState([LOGIN_BUTTON]);

  useEffect(() => {
    const auth_token = localStorage.getItem('auth_token');
    setDynamicButton(
      auth_token ? [PROFILE_BUTTON, LOGOUT_BUTTON] : [LOGIN_BUTTON],
    );
  }, [location]);

  // Set the selected tab index based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setSelectedTabIndex(0);
    } else if (path === '/about') {
      setSelectedTabIndex(1);
    } else if (path === '/login') {
      setSelectedTabIndex(2);
    } else if (path === '/profile') {
      setSelectedTabIndex(2);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userProfile');
    navigator('/');
  };

  const handleTabChange = ({ event, activeTabIndex }) => {
    event.preventDefault();
    setSelectedTabIndex(activeTabIndex);
    const buttonName = event.target.innerText;

    // Navigate to home
    if (buttonName === 'Home') {
      navigator('/');
    } else if (buttonName === 'About') {
      navigator('/about');
    } else if (buttonName === 'Login') {
      navigator('/login');
    } else if (buttonName === 'Profile') {
      navigator('/profile');
    } else if (buttonName === 'Log out') {
      handleLogout();
    }
  };

  const handleTabChangeForRightTabs = ({ activeTabIndex, ...rest }) => {
    handleTabChange({ ...rest, activeTabIndex: activeTabIndex + 1 });
  };
  return (
    <Sticky top={0}>
      <div className="bg-white w-screen flex justify-between px-4 shadow-md">
        <Tabs
          tabs={[{ text: 'Home', href: '/', id: 'home' }]}
          onChange={handleTabChange}
          activeTabIndex={selectedTabIndex}
          size="md"
          accessibilityLabel="Main navigation"
        />
        <Tabs
          tabs={[
            { text: 'About', href: '/about', id: 'about' },
            ...dynamicButton,
          ]}
          onChange={handleTabChangeForRightTabs}
          activeTabIndex={selectedTabIndex - 1}
          size="md"
          accessibilityLabel="Main navigation"
        />
      </div>
    </Sticky>
  );
}

export default NavBar;
