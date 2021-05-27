import React from 'react';
import FallbackPage from 'src/components/generic/FallbackPage';
import useIsMounted from 'src/hooks/useIsMounted';
import { useHasPendableAccess } from 'src/hooks/useAuthority';

const RouteValidator = ({ allowedAuthorities, authorityKey, children }) => {
  console.debug(`RouteValidator - allowedAuthorities: ${allowedAuthorities}, authorityKey: ${authorityKey}`);
  const hasAccess = useHasPendableAccess(allowedAuthorities, authorityKey);
  const isMounted = useIsMounted(true);
  if(isMounted){
    if(hasAccess){
      return children;
    }
    return <FallbackPage code = {403} isLoading={false}/>
  }
  // return <FallbackPage code = {undefined} isLoading/>
  return null
};

export default RouteValidator;
