import { User } from "./models/User";
import "express-serve-static-core";

// Extending the Request type to also include user (for TypeScript)
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}


export { }; 