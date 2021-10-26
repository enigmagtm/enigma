import { asyncHandler, RequestHandler, Router } from '@enigmagtm/core';
import { HttpVerb } from '../types';

interface FieldInfo {
  name: string;
  regex?: string;
}

/**
 * @param fields keys to be set as a path param
 * @returns path param for api http calls
 */
export const buildPathParams = (fields: FieldInfo[]): string => {
  return fields.reduce((params: string, field: FieldInfo) =>
    `${params}/:${field.name}${field.regex || ''}`, '');
};

/**
 * @param data data with values
 * @param fields fields to be extracted from data
 * @returns key value string
 */
export const buildKeyValue = (data: any, fields: FieldInfo[]): string => {
  return fields.reduce((params: string, field: FieldInfo) => `${params}[${field.name}]: ${data[field.name]} `, '');
};

/**
 * @param httpVerb http verb to register
 * @param path path for the resource, empty string base resource
 * @param request function to be execute for the specific path
 * @param resolvers middleware funtions to be set before calling request
 * @param router router to register resource
 */
export const registerMethod = (httpVerb: HttpVerb, path: string, request: RequestHandler, resolvers: RequestHandler[],
  router: Router): void => {
  switch (httpVerb) {
    case HttpVerb.GET:
      router.get(path, ...resolvers, asyncHandler(request));
      break;
    case HttpVerb.POST:
      router.post(path, ...resolvers, asyncHandler(request));
      break;
    case HttpVerb.PUT:
      router.put(path, ...resolvers, asyncHandler(request));
      break;
    case HttpVerb.DELETE:
      router.delete(path, ...resolvers, asyncHandler(request));
      break;
    case HttpVerb.PATCH:
      router.patch(path, ...resolvers, asyncHandler(request));
      break;

    default: router.get(path, resolvers, asyncHandler(request));
      break;
  }
}
