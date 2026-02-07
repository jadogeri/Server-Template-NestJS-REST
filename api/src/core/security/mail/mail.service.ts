
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as handlebars from 'handlebars';
import { Service } from '../../../common/decorators/service.decorator';

@Service()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Reusable method to send emails based on folder structure
   * @param to Recipient email
   * @param folder Folder name in templates directory (e.g., 'welcome')
   * @param context Data payload for Handlebars
   */
  async sendEmail(to: string, folder: string, context: any) {
    // 1. Manually compile the subject from subject.hbs
    const subjectPath = path.join(__dirname, 'templates', folder, 'subject.hbs');
    const subjectTemplate = fs.readFileSync(subjectPath, 'utf8');
    const compiledSubject = handlebars.compile(subjectTemplate)(context);

    // 2. Send using the built-in template engine for HTML and Text
    return await this.mailerService.sendMail({
      to: to,
      subject: compiledSubject,
      template: `${folder}/html`, // Points to templates/folder/html.hbs
      text: `${folder}/text`,     // Points to templates/folder/text.hbs
      context: context,
    });
  }
}
