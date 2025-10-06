// API integration utilities for Indian healthcare market
// These are examples - you'll need actual API keys and endpoints

interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
}

interface SMSConfig {
  apiKey: string;
  senderId: string;
  provider: 'textlocal' | 'msg91' | 'twilio';
}

interface AadhaarVerificationConfig {
  apiKey: string;
  environment: 'sandbox' | 'production';
}

// WhatsApp Business API integration
export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  async sendMessage(to: string, message: string, type: 'text' | 'template' = 'text') {
    const url = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: to.replace('+', ''),
      type: type,
      text: {
        body: message
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          messageId: result.messages[0].id,
          cost: 0.02 // Approximate cost in INR
        };
      } else {
        return {
          success: false,
          error: result.error?.message || 'Failed to send message'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  async sendReportTemplate(to: string, patientName: string, reportId: string, downloadLink: string) {
    const message = `🔬 *Lab Report Ready*

Hi ${patientName},

Your lab report is now ready! 📊

📋 *Report Details:*
• Report ID: ${reportId}
• Date: ${new Date().toLocaleDateString('en-IN')}

📱 Download your report: ${downloadLink}

For any queries, call us at +91-9876543210

🏥 PathoSync Laboratory
📍 Healthcare Street, Medical City

Thank you for choosing us! 🙏`;

    return this.sendMessage(to, message);
  }
}

// SMS API integration for Indian providers
export class SMSService {
  private config: SMSConfig;

  constructor(config: SMSConfig) {
    this.config = config;
  }

  async sendSMS(to: string, message: string) {
    let url = '';
    let payload: any = {};

    switch (this.config.provider) {
      case 'textlocal':
        url = 'https://api.textlocal.in/send/';
        payload = {
          apikey: this.config.apiKey,
          numbers: to.replace('+91', ''),
          message: message,
          sender: this.config.senderId
        };
        break;

      case 'msg91':
        url = 'https://api.msg91.com/api/v2/sendsms';
        payload = {
          authkey: this.config.apiKey,
          mobiles: to.replace('+91', ''),
          message: message,
          sender: this.config.senderId,
          route: 4
        };
        break;

      case 'twilio':
        // Twilio implementation
        break;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(payload)
      });

      const result = await response.json();
      
      return {
        success: response.ok,
        data: result,
        cost: 0.05 // Approximate cost in INR
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send SMS'
      };
    }
  }
}

// Aadhaar verification service
export class AadhaarService {
  private config: AadhaarVerificationConfig;

  constructor(config: AadhaarVerificationConfig) {
    this.config = config;
  }

  async verifyAadhaar(aadhaarNumber: string) {
    // This is a mock implementation
    // Real implementation would use government APIs like DigiLocker or UIDAI
    
    const isValid = /^\d{12}$/.test(aadhaarNumber);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: isValid,
          data: isValid ? {
            aadhaarNumber: aadhaarNumber,
            name: 'John Doe', // This would come from actual verification
            isVerified: true,
            address: 'Sample Address'
          } : null,
          error: isValid ? null : 'Invalid Aadhaar number'
        });
      }, 1000);
    });
  }
}

// UPI payment integration
export class UPIService {
  static generateUPILink(
    recipientUPI: string,
    amount: number,
    note: string,
    transactionId: string
  ) {
    const upiUrl = `upi://pay?pa=${recipientUPI}&pn=PathoSync Laboratory&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}&tr=${transactionId}`;
    return upiUrl;
  }

  static generateQRCode(upiLink: string) {
    // Generate QR code for UPI payment
    // You can use libraries like qrcode.js
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
  }
}

// Government scheme integration helpers
export class GovernmentSchemeService {
  static schemes = {
    CGHS: 'Central Government Health Scheme',
    ECHS: 'Ex-Servicemen Contributory Health Scheme',
    AYUSHMAN_BHARAT: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana',
    ESI: 'Employee State Insurance'
  };

  static validateSchemeId(scheme: string, id: string) {
    // Mock validation - real implementation would check with government databases
    const patterns = {
      CGHS: /^[0-9]{8}$/,
      ECHS: /^[A-Z]{2}[0-9]{6}$/,
      AYUSHMAN_BHARAT: /^[0-9]{11}$/,
      ESI: /^[0-9]{10}$/
    };

    return patterns[scheme as keyof typeof patterns]?.test(id) || false;
  }
}

// Integration configuration for Indian market
export const indianMarketConfig = {
  whatsapp: {
    // Get from Facebook Business Manager
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || ''
  },
  
  sms: {
    // TextLocal configuration
    apiKey: process.env.TEXTLOCAL_API_KEY || '',
    senderId: 'PATHOSYNC',
    provider: 'textlocal' as const
  },
  
  email: {
    // SendGrid or other email provider
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: 'noreply@pathosync.com'
  },
  
  payment: {
    // Payment gateway configuration
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
    upiId: 'pathosync@upi'
  },
  
  gst: {
    // GST configuration
    gstNumber: process.env.GST_NUMBER || '',
    stateCode: process.env.STATE_CODE || '27' // Maharashtra
  }
};

// Export services
export const whatsappService = new WhatsAppService(indianMarketConfig.whatsapp);
export const smsService = new SMSService(indianMarketConfig.sms);
export const aadhaarService = new AadhaarService({
  apiKey: process.env.AADHAAR_API_KEY || '',
  environment: 'sandbox'
});

// Helper functions for Indian market
export const indianHelpers = {
  formatIndianPhoneNumber: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91-${cleaned}`;
    }
    return phone;
  },

  formatIndianCurrency: (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  },

  validateGSTNumber: (gst: string) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  },

  validatePANNumber: (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  },

  generateGSTInvoiceNumber: (stateCode: string, financialYear: string) => {
    const timestamp = Date.now().toString().slice(-6);
    return `${stateCode}/${financialYear}/INV/${timestamp}`;
  }
};