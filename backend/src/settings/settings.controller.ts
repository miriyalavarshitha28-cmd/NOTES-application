import {
  Body,
  Controller,
  Get,
  Param,
  Put
} from '@nestjs/common';
import {
  SettingsService,
  UpdateSettingsDto
} from './settings.service';

@Controller('settings')
export class SettingsController {

  constructor(
    private readonly settingsService: SettingsService
  ) {}

  @Get('user/:userId')
  findByUserId(
    @Param('userId') userId: string
  ) {
    return this.settingsService.findOrCreateByUserId(
      userId
    );
  }

  @Put('user/:userId')
  updateByUserId(
    @Param('userId') userId: string,
    @Body() updateSettingsDto: UpdateSettingsDto
  ) {
    return this.settingsService.updateForUser(
      userId,
      updateSettingsDto
    );
  }

}
