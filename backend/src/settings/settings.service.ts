import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';

export type UpdateSettingsDto = Partial<
  Pick<
    Settings,
    | 'language'
    | 'notifications'
    | 'theme'
    | 'autosave'
    | 'privacy'
    | 'reminderEmails'
  >
>;

@Injectable()
export class SettingsService {

  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>
  ) {}

  async createForUser(userId: string) {
    const existing = await this.findByUserId(userId);

    if (existing) {
      return existing;
    }

    const settings = this.settingsRepository.create({
      userId
    });

    return this.settingsRepository.save(settings);
  }

  findByUserId(userId: string) {
    return this.settingsRepository.findOne({
      where: { userId }
    });
  }

  async findOrCreateByUserId(userId: string) {
    const existing = await this.findByUserId(userId);

    if (existing) {
      return existing;
    }

    return this.createForUser(userId);
  }

  async updateForUser(
    userId: string,
    updateSettingsDto: UpdateSettingsDto
  ) {
    await this.findOrCreateByUserId(userId);

    const allowedUpdates = Object.fromEntries(
      Object.entries({
        language: updateSettingsDto.language,
        notifications: updateSettingsDto.notifications,
        theme: updateSettingsDto.theme,
        autosave: updateSettingsDto.autosave,
        privacy: updateSettingsDto.privacy,
        reminderEmails: updateSettingsDto.reminderEmails
      }).filter(([, value]) => value !== undefined)
    );

    await this.settingsRepository.update(
      { userId },
      allowedUpdates
    );

    return this.findOrCreateByUserId(userId);
  }

}
