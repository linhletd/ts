import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { logout } from 'src/util/TokenProvider';
import { getInfo } from 'src/util/TokenProvider';
import Alert from 'src/components/common/modal/Alert';
import BrowserProvider from 'src/util/browser/BrowserProvider';
import Link from 'next/link'
// import ChangePasswordForm from './ChangePassword/ChangePasswordForm';

export default function RightNavBarLinks() {
  const { t } = useTranslation();
  const [collapse, setCollapse] = useState('');
  const [alert, setMessage] = useState({ show: false, content: '' });
  const info = getInfo();
  let avatar = '/images/default-avatar.png';
  if (typeof info === 'object') {
    avatar = info.avatar;
  }

  function handleLogout(e) {
    e.preventDefault();
    logout();
    window.location.reload();
  }

  function onAvatarClick(e) {
    e.preventDefault();
    console.log(`RightNavBarLinks - collapse: ${collapse}`);
    if (collapse === '') {
      setCollapse('show');
    } else {
      setCollapse('');
    }
  }
  function handleClickChangePw() {
    setCollapse('');
    setMessage({
      show: true,
      content: ''
      // content: <ChangePasswordForm setMessage={setMessage} />,
    });
  }
  return (
    <>
      <ul
        className="navbar-nav ml-auto"
        tabIndex="0"
        onBlur={() => {
          setTimeout(() => {
            setCollapse('');
          }, 200);
        }}
      >
        {/* Notifications Dropdown Menu */}
        <li className={`nav-item dropdown ${collapse}`}>
          <a className="nav-link" onClick={onAvatarClick}>
            <img src={avatar} width="30" height="30" className="img-circle" alt="" />
          </a>
          <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-right ${collapse}`}>
            <a href={BrowserProvider.getUrl('USER_PROFILE')} className="dropdown-item" >
              <i className="fas fa-envelope mr-2"></i> {t('components.rightbarlinks.text.profile')}
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" onClick={handleLogout}>
              <i className="fas fa fa-sign-out-alt mr-2"></i> {t('components.rightbarlinks.text.logout')}
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" onClick={handleClickChangePw}>
              <i className="fas fa-key mr-2"></i> {t('components.rightbarlinks.text.changePassword')}
            </a>
          </div>
        </li>
      </ul>
      <Alert
        {...alert}
        feetless={true}
        backdrop="static"
        title={t('components.rightbarlinks.changePassword.title')}
        handleClose={() => {
          setMessage({ show: false, content: '' });
        }}
      />
    </>
  );
}