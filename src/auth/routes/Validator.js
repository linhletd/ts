import React from 'react';

import { useHasPendableAccess } from '../../hooks/useAuthority';
import NotFound from '../../pages/Fallback/NotFound';
import PrivateRoute from '../../routes/PrivateRoute';
import { isLoggedIn } from '../../util/TokenProvider';
// import Empty from '../../pages/Fallback/Empty';
// import Constants from '../../util/Constants';

const RouteValidator = ({ allowedAuthorities, authorityKey, path, component, ...props }) => {
  console.debug(`RouteValidator - allowedAuthorities: ${allowedAuthorities}, authorityKey: ${authorityKey}`);
  const hasAccess = useHasPendableAccess(allowedAuthorities, authorityKey);
  // if (hasAccess === Constants.REACT_QUERY.CODES.LOADING) {
  //   return <Route path={path} {...props} component={Empty} />;
  // }

  return <PrivateRoute authed={isLoggedIn()} path={path} {...props} component={hasAccess ? component : NotFound} />;
};

export default RouteValidator;
