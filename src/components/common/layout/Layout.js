import React, { useState, useEffect, useRef } from 'react';
import Footer from './Footer';
import LeftNavBarLinks from '../Menu/LeftNavBarLinks';
import MainSideBar from '../Menu/MainSideBar';
import RightNavBarLinks from '../Menu/RightNavBarLinks';
import { isLoggedIn } from 'src/util/TokenProvider';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/router'

export default function Layout({ ...props }) {
  const [collapse, setCollapse] = useState(false);
  const [extraClass, setExtraClass] = useState('')
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const sidebarRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (isTabletOrMobile && !collapse) {
      setCollapse(true);
    } else if (!isTabletOrMobile && collapse) {
      setCollapse(false);
    }
  }, [isTabletOrMobile]);

  useEffect(()=>{
    let exClass = '';
    if (!isTabletOrMobile) {
      if (collapse) {
        exClass = 'sidebar-collapse';
      }
    } else {
      if (collapse) {
        exClass = 'sidebar-collapse';
      } else {
        exClass = 'sidebar-open';
      }
    }
    (exClass !== extraClass) && setExtraClass(exClass)
  }, [isTabletOrMobile, collapse])

  useEffect(()=>{
    if(!isLoggedIn()){
      router.replace('/login')
    }
  },[])

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
