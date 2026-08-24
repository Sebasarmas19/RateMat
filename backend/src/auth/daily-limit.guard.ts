import { Injectable, CanActivate, ExecutionContext, BadRequestException, mixin, Type } from '@nestjs/common';
import { DataSource, MoreThan } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';

export const DailyLimitGuard = (entityTarget: EntityTarget<any>, limit: number, userRelationField: string = 'createdBy'): Type<CanActivate> => {
  @Injectable()
  class DailyLimitGuardMixin implements CanActivate {
    constructor(public dataSource: DataSource) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      if (!user) return true;

      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);

      const repo = this.dataSource.getRepository(entityTarget);
      
      const count = await repo.count({
        where: {
          [userRelationField]: { id: user.id },
          createdAt: MoreThan(yesterday),
        }
      });

      if (count >= limit) {
        throw new BadRequestException(`Límite diario alcanzado. Solo puedes realizar esta acción ${limit} veces al día.`);
      }

      return true;
    }
  }

  return mixin(DailyLimitGuardMixin);
};
