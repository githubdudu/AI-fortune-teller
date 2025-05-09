import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Sticky,
  FixedZIndex,
  Dropdown,
  CompositeZIndex,
} from 'gestalt';
import { AppContext } from '$/context/AppContextProvider';

function UserAvatarButton() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const anchorRef = useRef(null);
  const PAGE_HEADER_ZINDEX = new FixedZIndex(10);

  const { userProfile } = useContext(AppContext);

  useEffect(() => {
    const checkLoginStatus = () => {
      const auth_tokenExists = !!localStorage.getItem('auth_token');
      setIsLoggedIn(auth_tokenExists);
    };

    checkLoginStatus();
  }, []);

  const handleAvatarButtonClick = () => {
    setOpen(!open);
    console.log('Clicked!');
    console.log('isLoggedIn: ', isLoggedIn);
    console.log('open: ', open);
  };

  const handleSelect = ({ item }) => {
    setOpen(false);

    switch (item.value) {
      case 'profile':
        navigate('/profile');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userProfile');
    setIsLoggedIn(false);
    navigate('/');
    setOpen(false);
  };

  return (
    <Sticky top={0}>
      <div className="w-screen flex justify-end pt-4 pr-6">
        <div className="hover:opacity-80 transition-opacity">
          <button
            className="bg-transparent border-0 p-0 m-0 cursor-pointer"
            onClick={handleAvatarButtonClick}
            aria-label="User menu"
            type="button"
            ref={anchorRef}
          >
            <Avatar
              name={userProfile?.displayName || 'User'}
              size="sm"
              outline
            />
          </button>
        </div>
        {open && (
          <Dropdown
            anchor={anchorRef.current}
            id="user-dropdown"
            onDismiss={() => setOpen(false)}
            zIndex={new CompositeZIndex([PAGE_HEADER_ZINDEX])}
            forceDirection
            idealDirection="bottom"
          >
            <Dropdown.Item
              onSelect={handleSelect}
              option={{ value: 'profile', label: 'Profile' }}
            />
            <Dropdown.Item
              onSelect={handleSelect}
              option={{ value: 'logout', label: 'Logout' }}
            />
            {/* {isLoggedIn && (
              <>
                <Dropdown.Item
                  onSelect={handleSelect}
                  option={{ value: 'profile', label: 'Profile' }}
                />
                <Dropdown.Item
                  onSelect={handleSelect}
                  option={{ value: 'logout', label: 'Logout' }}
                />
              </>
            )} */}
          </Dropdown>
        )}
      </div>
    </Sticky>
  );
}

export default UserAvatarButton;
