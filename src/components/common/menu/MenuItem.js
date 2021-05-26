import React from 'react';
import Link from 'next/link'

export default function MenuItem({ link, title, badge, icon, path, ...rest }) {
  return (
    <li className={`nav-item`} style={{ width: '100%' }}>
      {
        <Link
          href={link}
          // activeClassName="active"
          // isActive={(match, location) => {
          //   if (path) {
          //     return location.pathname.startsWith(path);
          //   }
          //   return location.pathname + location.search === link;
          // }}
          // {...rest}
        >
          <a className={`nav-link`}>
            <i className={`nav-icon fas ${icon}`}></i>
            <p>
              {title}
              {badge && <span className="right badge badge-danger">{badge}</span>}
            </p>
          </a>
        </Link>
      }
    </li>
  );
}
