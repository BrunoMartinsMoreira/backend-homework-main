import { User } from 'src/core/users/repositories/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
