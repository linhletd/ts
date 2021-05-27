import React, { useState, useEffect, useRef } from 'react';
import Footer from './Footer';
import LeftNavBarLinks from '../Menu/LeftNavBarLinks';
import MainSideBar from '../Menu/MainSideBar';
import RightNavBarLinks from '../Menu/RightNavBarLinks';
import useIsMounted from 'src/hooks/useIsMounted';
import { useMediaQuery } from 'react-responsive';

export default function Layout({ ...props }) {
  const [collapse, setCollapse] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const sidebarRef = useRef();
  const isMounted = useIsMounted(true);

  useEffect(() => {
    if (isTabletOrMobile && !collapse) {
      setCollapse(true);
    } else if (!isTabletOrMobile && collapse)  {
      setCollapse(false);
    }
  }, [isTabletOrMobile]);

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
  return (
    <div className={isMounted ? 'sidebar-mini ' + extraClass : 'sidebar-mini'} onClick={handleBlurSidebar}>
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
