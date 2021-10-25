import { isNil } from 'lodash';
import { FieldInfo, Param, QueryBuilder } from '../types';

/**
 * @param fields Array of fields to set
 * @param obj Object with the fields to be set to new object
 */
export const copyObject = (fields: FieldInfo[], obj: any, mapped?: boolean): any => {
  if (obj instanceof Array) {
    return obj.map((object: any) => {
      return fields.reduce((newObject: any, fieldInfo: FieldInfo) => {
        const field = mapped ? (fieldInfo.map || fieldInfo.name) : fieldInfo.name;
        if (object[fieldInfo.name] !== undefined) {
          newObject[field] = object[fieldInfo.name];
        }
        return newObject;
      }, {});
    });
  } else {
    return fields.reduce((object: any, fieldInfo: FieldInfo) => {
      if (obj[fieldInfo.name] !== undefined) {
        const field = mapped ? (fieldInfo.map || fieldInfo.name) : fieldInfo.name;
        object[field] = obj[fieldInfo.name];
      }
      return object;
    }, {});
  }
};

/**
 * @param fields list of fields to compare
 * @param objTo object to compare
 * @param objToBe object to be compare
 * @returns true if all fields are equals
 */
export const compareObj = (fields: string[], objTo: any, objToBe: any): boolean => {
  for (const field of fields) {
    if (objTo[field] !== objToBe[field]) {
      return false;
    }
  }
  return true;
};

/**
 * @param data object that contains field value
 * @param field field to be evaluated
 * @param greaterThanZero evaluate if value is greater than zero
 * @returns true if all conditions are met
 */
export const validateField = (data: any, field: string, greaterThanZero = false): boolean => {
  if (isNil(data[field])) {
    throw new Error(`The field [${field}] is required.`);
  }
  if (greaterThanZero) {
    if (!Number.isNaN(data[field])) {
      if (data[field] <= 0) {
        throw new Error(`The field [${field}] must be greater than 0.`);
      }
    }
  }
  return true;
};

/**
 * @param destination destination objett where values will be assign from soruce object
 * @param fields list of fields
 * @param source source object from which values will be assign
 * @returns object with assigned values
 */
export const copyFields = (destination: any, fields: FieldInfo[], source: any): any => {
  fields.forEach((fieldInfo: FieldInfo) => {
    destination[fieldInfo.map || fieldInfo.name] = source[fieldInfo.name];
  });
  return destination;
};

/**
 * @param query object that manages where clauses
 * @param where object with conditions
 * @returns queryBuilder with added conditions
 */
export const parseWhere = (query: QueryBuilder, where: any): QueryBuilder => {
  for (const [key, value] of Object.entries<any>(where)) {
    if (key === 'or') {
      for (const [keyOr, valueOr] of Object.entries<any>(value)) {
        if (valueOr === 'object') {
          query = query.orWhere(keyOr, (valueOr as Param).operator, (valueOr as Param).value);
          continue;
        }
        query = query.orWhere({ [keyOr]: valueOr });
        continue;
      }
      continue;
    }
    if (typeof value === 'object') {
      query = query.where(key, (value as Param).operator, (value as Param).value);
      continue;
    }
    query = query.where({ [key]: value });
  }
  return query;
}
