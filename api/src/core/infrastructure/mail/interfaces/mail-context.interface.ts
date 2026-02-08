export interface BaseEmailContext {
  companyName?: string;
  year?: number;
  logoUrl?: string;
  firstName?: string;
}

export interface WelcomeEmailContext extends BaseEmailContext {
  loginUrl: string;
}

export interface VerificationEmailContext extends BaseEmailContext {
  verificationLink: string;

}

// A union type for your reusable sendEmail method
export type MailContext = WelcomeEmailContext | VerificationEmailContext | any;
