/**
 * WhatsApp Provider Interface
 * Defines the contract for WhatsApp notification providers (Twilio, Gupshup, etc.)
 */

export interface WhatsAppProvider {
  /**
   * Send WhatsApp message
   */
  sendMessage(params: MessageParams): Promise<MessageResult>;

  /**
   * Send template message
   */
  sendTemplateMessage(params: TemplateMessageParams): Promise<MessageResult>;

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): Promise<boolean>;

  /**
   * Get message status
   */
  getMessageStatus(messageId: string): Promise<MessageStatus>;
}

export interface MessageParams {
  to: string; // Phone number with country code (e.g., 919876543210)
  message: string;
  mediaUrl?: string;
  metadata?: Record<string, any>;
}

export interface TemplateMessageParams {
  to: string; // Phone number with country code
  templateName: string;
  templateLanguage: string;
  templateComponents?: TemplateComponent[];
  metadata?: Record<string, any>;
}

export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  parameters?: TemplateParameter[];
}

export interface TemplateParameter {
  type: 'text' | 'image' | 'document' | 'video';
  text?: string;
  image?: { link: string };
  document?: { link: string };
  video?: { link: string };
}

export interface MessageResult {
  messageId: string;
  providerMessageId: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  to: string;
  sentAt: Date;
  metadata?: Record<string, any>;
}

export interface MessageStatus {
  messageId: string;
  providerMessageId: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  to: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export type WhatsAppProviderType = 'TWILIO' | 'GUPSHUP' | 'MESSAGEBIRD';
