import { Request, Response, NextFunction } from "express";

export function requireJsonContentType(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.is("application/json")) {
    res.status(415).json({
      error: {
        code: "UNSUPPORTED_MEDIA_TYPE",
        message: "Content-Type must be application/json",
        details: [],
      },
    });
    return;
  }
  next();
}
