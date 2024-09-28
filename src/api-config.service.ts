import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isAuthEnabled(): boolean {
    return this.configService.get('AUTH_ENABLED') === 'true';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get accessTokenExpiration(): string {
    return this.getString('ACCESS_TOKEN_EXPIRATION');
  }

  get refreshTokenExpiration(): string {
    return this.getString('REFRESH_TOKEN_EXPIRATION');
  }

  get accessTokenSecret(): string {
    return this.getString('ACCESS_TOKEN_SECRET');
  }

  get refreshTokenSecret(): string {
    return this.getString('REFRESH_TOKEN_SECRET');
  }

  get appleClientId(): string {
    return this.getString('APPLE_CLIENT_ID');
  }

  get appleTeamId(): string {
    return this.getString('APPLE_TEAM_ID');
  }

  get appleKeyIdentifier(): string {
    return this.getString('APPLE_KEY');
  }

  get appleRedirectUrl(): string {
    return this.getString('APPLE_REDIRECT_URL');
  }

  get verificationEmail(): string {
    return this.getString('VERIFICATION_EMAIL');
  }

  get verificationEmailTemplate(): string {
    return this.getString('SEND_GRID_EMAIL_VERIFICATION_TEMPLATE');
  }

  get resetPasswordTemplate(): string {
    return this.getString('SEND_GRID_RESET_PASSWORD_TEMPLATE');
  }

  get deleteAccountTemplate(): string {
    return this.getString('SEND_GRID_DELETE_ACCOUNT_TEMPLATE');
  }

  get sendGridApiKey(): string {
    return this.getString('SEND_GRID_KEY');
  }

  get firebaseProjectId(): string {
    return this.getString('FIREBASE_PROJECT_ID');
  }

  get firebaseStorageBucket(): string {
    return this.getString('FIREBASE_BUCKET_URL');
  }

  get firebasePrivateKey(): string {
    return this.getString('FIREBASE_PRIVATE_KEY');
  }

  get firebaseClientEmail(): string {
    return this.getString('FIREBASE_CLIENT_EMAIL');
  }

  get firebaseApiKey(): string {
    return this.getString('FIREBASE_API_KEY');
  }

  get domainPrefix(): string {
    return this.getString('DOMAIN_URI_PREFIX');
  }

  get androidPackageId(): string {
    return this.getString('ANDROID_PACKAGE_NAME');
  }

  get iosPackageId(): string {
    return this.getString('IOS_PACKAGE_NAME');
  }

  get apiBaseUrl(): string {
    return this.getString('API_BASE_URL');
  }

  get oneSignalAppId(): string {
    return this.getString('ONESIGNAL_APP_ID');
  }

  get oneSignalApiKey(): string {
    return this.getString('ONESIGNAL_API_KEY');
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
