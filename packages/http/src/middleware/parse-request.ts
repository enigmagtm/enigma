import { NextFunction, Request, Response } from '@enigmagtm/core';

export const ParseRequest = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.sfields) {
    try {
      (req.query as any).sfields = JSON.parse((req.query as any).sfields);
    } catch (ex: any) {
      console.log(ex);
      return res.status(400).json({
        err: 'sfields query param must be a JSON object. Cannot parse JSON.',
        msg: ex.message,
        stack: ex.stack
      });
    }
  }

  if (req.query.where) {
    try {
      (req.query as any).where = JSON.parse((req.query as any).where);
    } catch (ex: any) {
      console.log(ex);
      return res.status(400).json({
        err: 'where query param must be a JSON object. Cannot parse JSON.',
        msg: ex.message,
        stack: ex.stack
      });
    }
  }
  next();
}
