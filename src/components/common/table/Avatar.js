import React from 'react';

export default function Avatar({ width, height, link, className, ...props }) {
  link && !link.startsWith('http') && !link.startsWith('/') && (link = undefined);
  let url = '/images/default-avatar.png';
  if (link) {
    url = link;
    if (!url.startsWith('http')) {
      url = process.env.REACT_APP_BASE_URL_STATE + url;
    }
  }

  return <img src={url} width={width || '40'} height={height || '40'} className={className || 'img-circle'} {...props} />;
}
