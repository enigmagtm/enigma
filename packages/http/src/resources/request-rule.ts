import { HttpVerb } from '../types';

export enum TypeRule {
  EXCLUDE,
  INCLUDE
}

export interface RequestRule {
  pathRegex: string;
  httpVerbs: HttpVerb[];
  type: TypeRule;
}
