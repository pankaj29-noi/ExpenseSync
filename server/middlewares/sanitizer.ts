import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

const sanitize = (obj: any) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeHtml(obj[key], {
        allowedTags: [],
        allowedAttributes: {},
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitize(obj[key]);
    }
  }
};

export const sanitizer = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    sanitize(req.body);
  }
  next();
};