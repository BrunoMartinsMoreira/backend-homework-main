import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './configs/ormconfig';
import { UserMiddleware } from './get-user-middleware';
import { ProposalsModule } from './core/proposals/proposals.module';
import { UsersModule } from './core/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ProposalsModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
