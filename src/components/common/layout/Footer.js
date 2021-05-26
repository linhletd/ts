import React from 'react';

export default function Footer() {
  return (
    <footer className="main-footer">
      {/* To the right */}
      <div className="float-right d-none d-sm-inline">&quot;Customer first&quot;</div>
      {/* Default to the left */}
      <strong>
        Copyright &copy; 2018-2020 <a href="https://edupia.vn">edupia.vn</a>.
      </strong>{' '}
      All rights reserved.
    </footer>
  );
}
