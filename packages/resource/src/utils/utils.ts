import { HttpParams, HttpStatus } from '@enigmagtm/http';
import { transaction } from '@enigmagtm/orm';

export const createTransactionalMethod = (status: HttpStatus) => {
  return async (target: Object, method: any, args: any[], params: HttpParams): Promise<void> => {
    const { res, next, options } = params;
    const trxn = await transaction();
    try {
      args.push(trxn);
      const result = await method.apply(target, args);
      await trxn.commit();
      res.status(options?.status || status).json(result);
    } catch (e) {
      next(e);
      await trxn.rollback(e);
    }
  }
};
