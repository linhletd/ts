import { createFetcher } from 'src/util/request';
import APIProvider from 'src/util/api/url/APIProvider';
import useSWR from 'swr';

export default function UserNameFromId({ userId }) {
  let { data: user } = useSWR(userId, createFetcher(APIProvider.getUrl('USER_ITEM'), { params: { id: userId } }));
  if (user && user.userName) {
    return user.userName;
  }
  return userId;
}
