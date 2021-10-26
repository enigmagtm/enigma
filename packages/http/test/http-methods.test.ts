import { HttpVerb, Method, METHODS } from '../src';
import { HTTPResourceStub } from './http-resource.stub';

const target = HTTPResourceStub.prototype;

describe('http methods', () => {
  let getMethods: Method[];
  let postMethods: Method[];
  let putMethods: Method[];
  let patchMethods: Method[];
  let delMethods: Method[];

  beforeEach(() => {
    getMethods = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.GET}`, target) || [];
    postMethods = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.POST}`, target) || [];
    putMethods = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.PUT}`, target) || [];
    patchMethods = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.PATCH}`, target) || [];
    delMethods = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.DELETE}`, target) || [];
  });

  it('should register get http methods', () => {
    expect(getMethods.length).toBe(2);
    expect(getMethods[0].name).toBe('getResource');
    expect(getMethods[1].name).toBe('getByIdResource');
    expect(getMethods[1].path).toBeTruthy();
    expect(getMethods[1].path).toBe('/:id(^[^-](\\d+)');
  });

  it('should register post http methods', () => {
    expect(postMethods.length).toBe(1);
    expect(postMethods[0].name).toBe('createResource');
  });

  it('should register put http methods', () => {
    expect(putMethods.length).toBe(1);
    expect(putMethods[0].name).toBe('updateResource');
    expect(putMethods[0].path).toBeTruthy();
    expect(putMethods[0].path).toBe('/:id(^[^-](\\d+)');
  });

  it('should register patch http methods', () => {
    expect(patchMethods.length).toBe(1);
    expect(patchMethods[0].name).toBe('patchResource');
    expect(patchMethods[0].path).toBeTruthy();
    expect(patchMethods[0].path).toBe('/:id(^[^-](\\d+)');
  });

  it('should register delete http methods', () => {
    expect(delMethods.length).toBe(1);
    expect(delMethods[0].name).toBe('deleteResource');
    expect(delMethods[0].path).toBeTruthy();
    expect(delMethods[0].path).toBe('/:id(^[^-](\\d+)');
  });
});
