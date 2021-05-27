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
export default function FallbackPage({ code, isLoading }) {
  let img = imgSource[code] && `/images/${imgSource[code]}`;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        <ReactLoading type="spokes" height="5%" width="5%" color="#0099ff" className="pt-5" />
      ) : img ? (
        <img src={img} className="img-fluid" />
      ) : code >= 400 ? (
        <h1 className="p-5">{code === 401 ? '401 Error - Unauthorized' : 'Unknown Error'}</h1>
      ) : null}
    </div>
  );
}
