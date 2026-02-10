import { User } from "./models/User";

// Extending the Request type to also include user (for TypeScript)
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}