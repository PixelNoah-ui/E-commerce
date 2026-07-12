export declare function notifyCustomerOrderPlaced(email: string, orderNumber: string): Promise<void>;
export declare function notifyCustomerPaymentSuccess(email: string, orderNumber: string): Promise<void>;
export declare function notifyCustomerPaymentFailed(email: string, orderNumber: string): Promise<void>;
export declare function notifyAdminNewOrder(orderNumber: string): Promise<void>;
export declare function notifyAdminPaymentReceived(orderNumber: string): Promise<void>;
//# sourceMappingURL=notificationService.d.ts.map