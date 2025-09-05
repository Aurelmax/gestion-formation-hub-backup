// SMS Provider stub - to be implemented later
export interface SMSProvider {
  sendSMS(to: string, message: string): Promise<boolean>;
}

export class MockSMSProvider implements SMSProvider {
  async sendSMS(to: string, message: string): Promise<boolean> {
    // Mock implementation for development
    console.log(`[SMS Mock] Sending to ${to}: ${message}`);
    return true;
  }
}

export const smsProvider: SMSProvider = new MockSMSProvider();

export default smsProvider;