import { getPermission } from '../util/TokenProvider';

interface Permission {
  code: string
}
export function useHasAccess(allowedAuthorities: Array<string>, authorityKey: string): boolean {
  let checkPermission = getPermission().some((permission: Permission) => allowedAuthorities.includes(permission.code));
  if (authorityKey === 'permissions') {
    return checkPermission;
  }
  return false;
}

export function useHasPendableAccess(allowedAuthorities: Array<string>, authorityKey: string):boolean {
  let checkPermission = getPermission().some((permission: Permission) => allowedAuthorities.includes(permission.code));
  if (authorityKey === 'permissions') {
    return checkPermission;
  }
  return false;
}
