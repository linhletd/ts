import React, { useState, useEffect, useRef } from 'react';
import Footer from './Footer';
import LeftNavBarLinks from '../Menu/LeftNavBarLinks';
import MainSideBar from '../Menu/MainSideBar';
import RightNavBarLinks from '../Menu/RightNavBarLinks';
import { isLoggedIn } from 'src/util/TokenProvider';
import { useMediaQuery } from 'react-responsive';

export default function Layout({ ...props }) {
  const [collapse, setCollapse] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const sidebarRef = useRef();

  useEffect(() => {
    if (isTabletOrMobile && !collapse) {
      setCollapse(true);
    } else if (!isTabletOrMobile && collapse) {
      setCollapse(false);
    }
  }, [isTabletOrMobile]);

  if (!isLoggedIn()) {
    return (
      <div className=" row justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className={`${isTabletOrMobile ? 'col-9' : 'col-4'} shadow-sm`}>{props.children}</div>
      </div>
    );
  }

  function onMenuClick(e) {
    e.preventDefault();
    console.log(`Layout - collapse: ${collapse}`);
    setCollapse(!collapse);
  }
  function handleBlurSidebar(e) {
    let target = e.target;
    if (!collapse && isTabletOrMobile && target !== sidebarRef.current && !sidebarRef.current?.contains(target)) {
      setCollapse(true);
    }
  }

  let extraClass = '';
  if (!isTabletOrMobile) {
    if (collapse) {
      extraClass = 'sidebar-collapse';
    }
  } else {
    if (collapse) {
      extraClass = 'sidebar-collapse';
    } else {
      extraClass = 'sidebar-open';
    }
  }
  return (
    <div className={'sidebar-mini ' + extraClass} onClick={handleBlurSidebar}>
      <div className="wrapper">
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
          <LeftNavBarLinks onMenuClick={onMenuClick} />
          {/* <SearchForm /> */}
          <RightNavBarLinks />
        </nav>
        <MainSideBar ref={sidebarRef} />

        <div className="content-wrapper">
          {props.children}
          {/* <PageHeader /> */}
          {/* <PageContent /> */}
        </div>

        {/* <ControlSideBar /> */}

        <Footer />
      </div>
    </div>
  );
}
