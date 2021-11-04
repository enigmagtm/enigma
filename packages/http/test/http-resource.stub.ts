import { Body, Del, Get, HeaderParam, HttpStatus, Patch, PathParam, PathParams, Post, Put, QueryParam, QueryParams } from '../src';

export class HTTPResourceStub {
  @Get({ status: HttpStatus.PARTIAL_CONTENT })
  get(@QueryParam('value') value: string, @HeaderParam('autorization') autorization: string,
    @QueryParams('query') query: any): string {
    return `all objects with params ${value} with ${autorization} in ${query}`;
  }

  @Get({ path: '/:id(^[^-](\\d+)' })
  getById(@PathParam('id') id: number, @PathParams('params') params: any): string {
    return `one object ${id} in params ${params}`;
  }

  @Post()
  create(@Body() payload: any): string {
    return `created with ${payload}`;
  }

  @Put({ path: '/:id(^[^-](\\d+)' })
  update(@PathParam('id') id: number, @Body() payload: any): string {
    return `updated ${id} with ${payload}`;
  }

  @Patch({ path: '/:id(^[^-](\\d+)' })
  patch(@PathParam('id') id: number, @Body() payload: any): string {
    return `patched ${id} with ${payload}`;
  }

  @Del({ path: '/:id(^[^-](\\d+)' })
  delete(@PathParam('id') id: number): string {
    return `deleted ${id}`;
  }
}