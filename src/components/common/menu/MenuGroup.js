import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';

export default function MenuGroup({ children, title, initialOpen, icon = 'fa-folder-open', badge }) {
  let [open, setOpen] = useState(!!initialOpen);
  function handleClick() {
    window.getSelection().removeAllRanges();
    children && setOpen(!open);
  }
  return (
    <li className={`nav-item ${open ? 'menu-open menu-is-opening' : ''}`}>
      <div className={`nav-link`} onClick={handleClick} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'default' }}>
        <i className={`nav-icon fas ${icon}`}></i>
        <p>
          {title} {children && <i className={`right fas fa-angle-left`}></i>}
          {badge && <span className="right badge badge-danger">{badge}</span>}
        </p>
      </div>
      {children && (
        <Collapse in={open}>
          <ul className={`nav`}>{children}</ul>
        </Collapse>
      )}
    </li>
  );
}
