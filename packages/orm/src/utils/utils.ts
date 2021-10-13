import { isNil } from 'lodash';
import { FieldInfo } from '../types';

/**
 * @param fields Array of fields to set
 * @param obj Object with the fields to be set to new object
 */
export const copyObject = (fields: string[], obj: any): any => {
  if (obj instanceof Array) {
    return obj.map((object: any) => {
      return fields.reduce((newObject: any, field: string) => {
        if (object[field] !== undefined) {
          newObject[field] = object[field];
        }
        return newObject;
      }, {});
    });
  } else {
    return fields.reduce((object: any, field: string) => {
      if (obj[field] !== undefined) {
        object[field] = obj[field];
      }
      return object;
    }, {});
  }
};

/**
 * @param fields list of fields to compare
 * @param obj1 object to compare
 * @param obj2 object to be compare
 * @returns true if all fields are equals
 */
export const compareObj = (fields: string[], obj1: any, obj2: any): boolean => {
  for (const field of fields) {
    if (obj1[field] !== obj2[field]) {
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
 * @param paramObj objetct that contains param values
 * @param fields list of primary keys
 * @param obj object to set params values
 * @returns object with assigned values
 */
export const copyFields = (paramObj: any, fields: FieldInfo[], obj: any): any => {
  fields.forEach((field: FieldInfo) => {
    paramObj[field.name] = obj[field.name];
  });
  return paramObj;
};
