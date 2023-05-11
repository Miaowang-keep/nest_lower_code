import { Request, Response } from 'express';
import { Log4jsForNest } from 'src/log4j';


// 函数式中间件
export function logger(req: Request, res: Response, next: () => any) {
    const code = res.statusCode;
    next();
    const logFormat = ` >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      Request original url: ${req.originalUrl}
      Method: ${req.method}
      IP: ${req.ip}
      Status code: ${code}
      Parmas: ${JSON.stringify(req.params)}
      Query: ${JSON.stringify(req.query)}
      Body: ${JSON.stringify(
        req.body,
      )} \n  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    `;
    if (code >= 500) {
        Log4jsForNest.error(logFormat);
    } else if (code >= 400) {
        Log4jsForNest.warn(logFormat);
    } else {
        Log4jsForNest.info(logFormat);
    }
  }