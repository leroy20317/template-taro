/**
 * @author: leroy
 * @date: 2021/9/26 15:07
 * @description：API.d
 */

declare namespace API {
  type Response<T = any> = {
    status: string;
    data?: T;
    message?: string;
  };
}
