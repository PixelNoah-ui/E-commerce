import sendEmail from "../utils/sendEmail.js";

export async function notifyCustomerOrderPlaced(
  email: string,
  orderNumber: string,
) {
  await sendEmail({
    email,
    subject: `Your order ${orderNumber} has been received`,
    html: `<p>Hello,</p><p>Your order <strong>${orderNumber}</strong> has been received and is being processed.</p>`,
  });
}

export async function notifyCustomerPaymentSuccess(
  email: string,
  orderNumber: string,
) {
  await sendEmail({
    email,
    subject: `Payment confirmed for ${orderNumber}`,
    html: `<p>Hello,</p><p>Your payment for order <strong>${orderNumber}</strong> was confirmed successfully.</p>`,
  });
}

export async function notifyCustomerPaymentFailed(
  email: string,
  orderNumber: string,
) {
  await sendEmail({
    email,
    subject: `Payment issue for ${orderNumber}`,
    html: `<p>Hello,</p><p>There was an issue with the payment for order <strong>${orderNumber}</strong>.</p>`,
  });
}

export async function notifyAdminNewOrder(orderNumber: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  await sendEmail({
    email: adminEmail,
    subject: `New order received: ${orderNumber}`,
    html: `<p>A new order <strong>${orderNumber}</strong> has been placed.</p>`,
  });
}

export async function notifyAdminPaymentReceived(orderNumber: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  await sendEmail({
    email: adminEmail,
    subject: `Payment received for ${orderNumber}`,
    html: `<p>Payment was received for order <strong>${orderNumber}</strong>.</p>`,
  });
}
