/**
 * Mock WhatsApp Provider
 * For development and testing purposes
 */

import {
  WhatsAppProvider,
  MessageParams,
  TemplateMessageParams,
  MessageResult,
  MessageStatus,
} from './provider';

export class MockWhatsAppProvider implements WhatsAppProvider {
  private mockDelay: number;

  constructor(mockDelay: number = 600) {
    this.mockDelay = mockDelay;
  }

  async sendMessage(params: MessageParams): Promise<MessageResult> {
    await this.delay();

    const messageId = `mock_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      messageId,
      providerMessageId: `provider_${messageId}`,
      status: 'sent',
      to: params.to,
      sentAt: new Date(),
      metadata: {
        mock: true,
        message: params.message,
      },
    };
  }

  async sendTemplateMessage(params: TemplateMessageParams): Promise<MessageResult> {
    await this.delay();

    const messageId = `mock_template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      messageId,
      providerMessageId: `provider_${messageId}`,
      status: 'sent',
      to: params.to,
      sentAt: new Date(),
      metadata: {
        mock: true,
        templateName: params.templateName,
        templateLanguage: params.templateLanguage,
      },
    };
  }

  async verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): Promise<boolean> {
    await this.delay();

    // In mock mode, accept any signature that starts with 'mock_'
    return signature.startsWith('mock_');
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    await this.delay();

    // Mock status based on messageId pattern
    if (messageId.includes('failed')) {
      return {
        messageId,
        providerMessageId: messageId,
        status: 'failed',
        to: '919876543210',
        sentAt: new Date(Date.now() - 60000),
        failedAt: new Date(),
        error: 'Phone number not registered on WhatsApp',
        metadata: { mock: true },
      };
    }

    if (messageId.includes('read')) {
      return {
        messageId,
        providerMessageId: messageId,
        status: 'read',
        to: '919876543210',
        sentAt: new Date(Date.now() - 120000),
        deliveredAt: new Date(Date.now() - 60000),
        readAt: new Date(),
        metadata: { mock: true },
      };
    }

    // Default to delivered
    return {
      messageId,
      providerMessageId: messageId,
      status: 'delivered',
      to: '919876543210',
      sentAt: new Date(Date.now() - 60000),
      deliveredAt: new Date(),
      metadata: { mock: true },
    };
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.mockDelay));
  }
}

// Singleton instance
export const mockWhatsAppProvider = new MockWhatsAppProvider(400);
