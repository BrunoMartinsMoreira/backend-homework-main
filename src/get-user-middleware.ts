import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AbstractUsersRepository } from './core/users/repositories';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private userRepository: AbstractUsersRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['user_id'];
    if (userId) {
      const user = await this.userRepository.findOne({ id: Number(userId) });
      if (user) {
        req.user = user;
      }
    }
    next();
  }
}
