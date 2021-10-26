import { NextFunction, Request, Response } from '@enigmagtm/core';
import { HttpError, HttpStatus } from '../types';

export const errorHandlingRequest = async (err: any, _req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  if (res.headersSent) {
    next(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.code).json({ msg: err.message });
  }

  if (err.code === 'ECONNREFUSED') {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      err: 'Connection refused. Cannot connect to the database.'
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    err: err.stack || err
  });
}
