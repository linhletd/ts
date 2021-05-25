import React from 'react';
import ReactLoading from 'react-loading';

let imgSource = {
  400: '400-bad-request.png',
  403: '403-forbidden.png',
  404: '404-not-found.png',
  500: '500-internal-server-error.png',
  503: '503-service-unavailable.png',
  504: '504-gateway-timeout.png',
};
const requestImageFile = require.context('../../assets', false);
export default function FallbackPage({ code, status }) {
  let img = imgSource[code];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {status === 'loading' ? (
        <ReactLoading type="spokes" height="5%" width="5%" color="#0099ff" className="pt-5" />
      ) : img ? (
        <img src={requestImageFile(`./${img}`).default} className="img-fluid" />
      ) : code >= 400 ? (
        <h1 className="p-5">{code === 401 ? '401 Error - Unauthorized' : 'Unknown Error'}</h1>
      ) : null}
    </div>
  );
}
