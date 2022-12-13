import { Module } from '@nestjs/common';
import { ProjectsModule } from '@dcltracker/projects';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ProjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
