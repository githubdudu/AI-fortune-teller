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
import { useModalStore } from '$/stores/modalStore';

function UserAvatarButton() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const PAGE_HEADER_ZINDEX = new FixedZIndex(10);

  const { userProfile, isLoggedIn, logout } = useContext(AppContext);
  const toggleModalOpen = useModalStore((state) => state.toggleModalOpen);

  useEffect(() => {
    setOpen(false);
  }, []);

  const handleAvatarButtonClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleSelect = ({ item }) => {
    setOpen(false);

    switch (item.value) {
      case 'home':
        navigate('/');
        break;
      case 'profile':
        navigate('/user-info-input');
        break;
      case 'daily-fortune':
        toggleModalOpen();
        navigate('/home');
        break;
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  };

  return (
    <Sticky top={0}>
      <div className="flex justify-end">
        {isLoggedIn ? (
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
        ) : (
          <div className="w-8 h-8"></div> // empty placeholder for replacing useravatarbutton's location when not logged in
        )}
        {isLoggedIn && open && (
          <Dropdown
            anchor={anchorRef.current}
            id="user-dropdown"
            onDismiss={() => setOpen(false)}
            zIndex={new CompositeZIndex([PAGE_HEADER_ZINDEX])}
            idealDirection="bottom"
          >
            <Dropdown.Item
              onSelect={handleSelect}
              option={{ value: 'home', label: 'Home' }}
            />
            <Dropdown.Item
              onSelect={handleSelect}
              option={{ value: 'profile', label: 'Profile' }}
            />
            <Dropdown.Item
              onSelect={handleSelect}
              option={{ value: 'daily-fortune', label: 'Daily Fortune' }}
            />
            <Dropdown.Item
              onSelect={handleSelect}
              option={{ value: 'logout', label: 'Logout' }}
            />
          </Dropdown>
        )}
      </div>
    </Sticky>
  );
}

export default UserAvatarButton;
