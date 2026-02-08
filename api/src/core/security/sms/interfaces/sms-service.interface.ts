export interface SmsServiceInterface {

  sendSms(phoneNumber: string,folder: string, message: string): Promise<void>;
}