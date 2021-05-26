import React from 'react';

export default function LeftNavBarLinks({ onMenuClick }) {
  return (
    <ul className="navbar-nav">
      <li className="nav-item">
        <a className="nav-link" data-widget="pushmenu" onClick={onMenuClick} href="#" role="button">
          <i className="fas fa-bars"></i>
        </a>
      </li>
      {/* <li className="nav-item d-none d-sm-inline-block">
        <a href="index3.html" onClick={handleClick} className="nav-link">
          Home
        </a>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <a href="#" className="nav-link">
          Contact
        </a>
      </li> */}
    </ul>
  );
}
