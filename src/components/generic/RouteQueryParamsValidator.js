import React from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import * as yup from 'yup';

let fallbackSchema = yup.object().shape({
  size: yup.number().required().positive().integer().lessThan(101),
  page: yup.number().required().positive().integer(),
  sort: yup.string().equals(['createdAt,desc']).required(),
});
let fallbackParams = { page: 1, size: 10, sort: 'createdAt,desc' };

export default function RouteQueryValidator({ schema = fallbackSchema, Component, defaultParams = fallbackParams, ...rest }) {
  let location = useLocation();
  let query = new URLSearchParams(location.search);
  let params = {};
  [...query.entries()].map((cur) => {
    params[cur[0]] = cur[1];
  });
  let queryIsValidated = Object.keys(params).length <= Object.keys(defaultParams).length && schema.isValidSync(params);
  if (queryIsValidated) {
    return <Component {...rest} />;
  } else {
    Object.keys(params).map((cur) => {
      try {
        schema.validateSyncAt(cur);
        if (!defaultParams[cur]) {
          throw new Error('unused params');
        }
      } catch (e) {
        delete params[cur];
      }
    });
    let finalParms = { ...defaultParams, ...params };
    let replaceQuery = new URLSearchParams();
    Object.keys(finalParms).map((cur) => {
      if (!(typeof finalParms[cur] === 'symbol')) {
        replaceQuery.set(cur, finalParms[cur]);
      }
    });
    return <Redirect to={`${location.pathname}?${replaceQuery.toString()}`} />;
  }
}
