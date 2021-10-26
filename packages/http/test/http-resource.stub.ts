import { Body, Del, Get, HeaderParam, HttpStatus, Patch, PathParam, Post, Put, QueryParam } from '../src';

export class HTTPResourceStub {
  @Get({ status: HttpStatus.PARTIAL_CONTENT })
  get(@QueryParam('value') value: string, @HeaderParam('autorization') autorization: string): string {
    return `all objects with params ${value} with ${autorization}`;
  }

  @Get({ path: '/:id(^[^-](\\d+)' })
  getById(@PathParam('id') id: number): string {
    return `one object ${id}`;
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