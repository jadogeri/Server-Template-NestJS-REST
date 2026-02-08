export interface SmsServiceInterface {

  sendSms(phoneNumber: string, message: string): Promise<void>;
}