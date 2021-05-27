import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { logout } from 'src/util/TokenProvider';
import { getInfo } from 'src/util/TokenProvider';
import Alert from 'src/components/common/modal/Alert';
import BrowserProvider from 'src/util/browser/BrowserProvider';
import {useRouter} from 'next/router'
// import ChangePasswordForm from './ChangePassword/ChangePasswordForm';

export default function RightNavBarLinks() {
  const { t } = useTranslation();
  const [collapse, setCollapse] = useState('');
  const [alert, setMessage] = useState({ show: false, content: '' });
  const [avatar, setAvatar] = useState('/images/default-avatar.png');
  const router = useRouter();
  const ref = useRef();
  useEffect(()=>{
    const info = getInfo();
    if (typeof info === 'object') {
      setAvatar(info.avatar);
    }
  })

  function handleLogout(e) {
    e.preventDefault();
    logout();
    router.push(BrowserProvider.getUrl('LOGIN'))
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
        ref={ref}
        onBlur={() => {
          setTimeout(() => {
            ref.current && setCollapse('');
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
