import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
//log full error
  console.error(err);

  // Zod validation -> 400
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      issues: err.issues,
    });
  }

  // MySQL common errors
  if (err && typeof err === "object" && "code" in err) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        return res.status(409).json({ message: "Duplicate entry" });
      case "ER_NO_REFERENCED_ROW_2":
      case "ER_ROW_IS_REFERENCED_2":
        return res.status(409).json({ message: "Referential integrity error" });
      case "ER_DATA_TOO_LONG":
        return res.status(400).json({ message: "Field too long" });
     
    }
  }

  // Default
  return res.status(500).json({ message: "Internal Server Error" });
}
