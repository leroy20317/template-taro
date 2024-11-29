import api from '@/utils/api';
import url from '@/utils/url';

export type User = Partial<{
  status: string;
  user_id: number;
  pushCode: string;
  session: string;
  auth: string;
}>;

export async function getUserInfo() {
  return {};
  return api<User>(url.userInfo, {
    method: 'GET',
  });
}
