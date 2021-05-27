import { useHasAccess } from 'src/hooks/useAuthority';
import useIsMounted from 'src/hooks/useIsMounted';

const ComponentValidator = ({ allowedAuthorities, authorityKey, children }) => {
  const hasAccess = useHasAccess(allowedAuthorities, authorityKey);
  const isMounted = useIsMounted();

  return !isMounted ? null: hasAccess && children;
};

export default ComponentValidator;
