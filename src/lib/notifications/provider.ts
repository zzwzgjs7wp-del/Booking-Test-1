// Notification provider abstraction
// Default: console logging
// Can be extended with Twilio, SendGrid, etc.

export interface SMSOptions {
  to: string
  message: string
}

export interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
}

export interface NotificationProvider {
  sendSMS(options: SMSOptions): Promise<void>
  sendEmail(options: EmailOptions): Promise<void>
}

class ConsoleNotificationProvider implements NotificationProvider {
  async sendSMS(options: SMSOptions): Promise<void> {
    console.log('[SMS]', {
      to: options.to,
      message: options.message,
      timestamp: new Date().toISOString()
    })
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    console.log('[Email]', {
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      timestamp: new Date().toISOString()
    })
  }
}

class TwilioNotificationProvider implements NotificationProvider {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || ''
    this.authToken = process.env.TWILIO_AUTH_TOKEN || ''
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || ''
  }

  async sendSMS(options: SMSOptions): Promise<void> {
    if (!this.accountSid || !this.authToken) {
      console.warn('Twilio credentials not configured, falling back to console')
      return new ConsoleNotificationProvider().sendSMS(options)
    }

    // Uncomment when Twilio SDK is installed:
    // const twilio = require('twilio')
    // const client = twilio(this.accountSid, this.authToken)
    // await client.messages.create({
    //   body: options.message,
    //   from: this.fromNumber,
    //   to: options.to
    // })
    
    console.log('[Twilio SMS]', { to: options.to, message: options.message })
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    // Twilio doesn't handle email, fall back to SendGrid or console
    return new ConsoleNotificationProvider().sendEmail(options)
  }
}

class SendGridNotificationProvider implements NotificationProvider {
  private apiKey: string
  private fromEmail: string

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || ''
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || ''
  }

  async sendSMS(options: SMSOptions): Promise<void> {
    // SendGrid doesn't handle SMS, fall back to console
    return new ConsoleNotificationProvider().sendSMS(options)
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.apiKey || !this.fromEmail) {
      console.warn('SendGrid credentials not configured, falling back to console')
      return new ConsoleNotificationProvider().sendEmail(options)
    }

    // Uncomment when SendGrid SDK is installed:
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(this.apiKey)
    // await sgMail.send({
    //   to: options.to,
    //   from: this.fromEmail,
    //   subject: options.subject,
    //   html: options.html,
    //   text: options.text
    // })
    
    console.log('[SendGrid Email]', { to: options.to, subject: options.subject })
  }
}

function getProvider(): NotificationProvider {
  const provider = process.env.NOTIFICATION_PROVIDER || 'console'
  
  switch (provider) {
    case 'twilio':
      return new TwilioNotificationProvider()
    case 'sendgrid':
      return new SendGridNotificationProvider()
    case 'console':
    default:
      return new ConsoleNotificationProvider()
  }
}

export const notificationProvider = getProvider()

export async function sendSMS(options: SMSOptions): Promise<void> {
  return notificationProvider.sendSMS(options)
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  return notificationProvider.sendEmail(options)
}
