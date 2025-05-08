import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Sticky } from 'gestalt';

function NavBar() {
  const navigator = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
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
            { text: 'Login', href: '/login', id: 'login' },
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
