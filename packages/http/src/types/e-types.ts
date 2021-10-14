import express from 'express';

export type Server = express.Express;
export type Router = express.Router;
export type NextFunction = express.NextFunction;
export type Response = express.Response;
export type Request = express.Request;

export const createRouter = () => express.Router();
