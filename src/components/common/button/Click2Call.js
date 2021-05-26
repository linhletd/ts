import React, { useState } from 'react';
import { callPost } from '../../hooks/useRequest';
import APIProvider from '../../util/api/url/APIProvider';

export default function ClickToCall({ object, children }) {
  let [isCalling, setCalling] = useState(false);
  const handleCall = async (e) => {
    let objectType = object.contact ? 'DEAL' : 'CONTACT';
    let { id: objectId } = object;

    e.preventDefault();
    if (isCalling) return;
    setCalling(true);
    const { code } = await callPost(`${APIProvider.getUrl('COMMON_CONTACT_CALL')}?objectId=${objectId}&objectType=${objectType}`);
    if (code) {
      setCalling(false);
    }
  };
  let style = {
    opacity: isCalling ? 0.6 : 1,
    cursor: 'pointer',
  };
  return (
    <div style={style} onClick={handleCall}>
      {children || <i className="fas fa-phone" />}
    </div>
  );
}
