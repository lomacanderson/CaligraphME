// Mock Payment Provider
// Simulates payment processing for demo/testing purposes

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface PaymentMethod {
  id: string;
  type: 'mock_card' | 'mock_bank';
  last4: string;
}

export class MockPaymentProvider {
  /**
   * Process a payment (simulated)
   */
  static async processPayment(
    amount: number,
    userId: string,
    description?: string
  ): Promise<PaymentResult> {
    // Simulate network delay
    await this.delay(500);

    // Generate mock transaction ID
    const transactionId = `mock_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate success (95% success rate)
    const success = Math.random() > 0.05;

    return {
      success,
      transactionId,
      amount,
      timestamp: new Date().toISOString(),
      status: success ? 'completed' : 'failed'
    };
  }

  /**
   * Create a payment method (simulated)
   */
  static async createPaymentMethod(
    userId: string,
    type: 'card' | 'bank' = 'card'
  ): Promise<PaymentMethod> {
    await this.delay(300);

    return {
      id: `mock_pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type === 'card' ? 'mock_card' : 'mock_bank',
      last4: Math.floor(1000 + Math.random() * 9000).toString()
    };
  }

  /**
   * Process a refund (simulated)
   */
  static async processRefund(
    transactionId: string,
    amount: number
  ): Promise<PaymentResult> {
    await this.delay(400);

    return {
      success: true,
      transactionId: `mock_refund_${Date.now()}`,
      amount,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  }

  /**
   * Transfer funds (simulated)
   * Used for allowance deposits and redemptions
   */
  static async transferFunds(
    fromUserId: string,
    toUserId: string,
    amount: number,
    description?: string
  ): Promise<PaymentResult> {
    await this.delay(600);

    return {
      success: true,
      transactionId: `mock_transfer_${Date.now()}`,
      amount,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  }

  /**
   * Verify payment method (simulated)
   */
  static async verifyPaymentMethod(paymentMethodId: string): Promise<boolean> {
    await this.delay(200);
    return true; // Always valid in mock mode
  }

  /**
   * Get payment status (simulated)
   */
  static async getPaymentStatus(transactionId: string): Promise<'completed' | 'pending' | 'failed'> {
    await this.delay(100);
    return 'completed'; // Always completed in mock mode
  }

  /**
   * Simulate network delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export convenience functions
export const mockPayment = {
  process: MockPaymentProvider.processPayment.bind(MockPaymentProvider),
  createMethod: MockPaymentProvider.createPaymentMethod.bind(MockPaymentProvider),
  refund: MockPaymentProvider.processRefund.bind(MockPaymentProvider),
  transfer: MockPaymentProvider.transferFunds.bind(MockPaymentProvider),
  verify: MockPaymentProvider.verifyPaymentMethod.bind(MockPaymentProvider),
  getStatus: MockPaymentProvider.getPaymentStatus.bind(MockPaymentProvider)
};

