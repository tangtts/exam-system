import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {

  transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: "smtp.qq.com",
      port: 587,
      secure: false,
      auth: {
        user: '2939117014@qq.com',
        pass: 'ulhjmhuvdntrdcec'
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '考试系统',
        address: '2939117014@qq.com'
      },
      to,
      subject,
      html
    });
  }
}
