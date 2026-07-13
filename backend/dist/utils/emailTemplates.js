"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProfessionalEmail = buildProfessionalEmail;
const brandName = "PixelShop";
const supportEmail = process.env.EMAIL_USERNAME || "support@pixelshop.com";
const websiteUrl = process.env.CLIENT_URL || "https://abduelectronics.com";
function buildProfessionalEmail({ title, heading, intro, highlight, body, footerNote, }) {
    return `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#f5f7fb; padding:32px 16px; color:#1f2937;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(15,23,42,0.08);">
        <div style="background:linear-gradient(135deg,#0f172a 0%,#2563eb 100%); padding:28px 32px;">
          <p style="margin:0; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#dbeafe;">${brandName}</p>
          <h1 style="margin:10px 0 0; font-size:28px; color:#ffffff;">${title}</h1>
        </div>
        <div style="padding:32px; line-height:1.7;">
          <p style="margin:0 0 12px; font-size:16px;">${intro}</p>
          <h2 style="margin:18px 0 10px; font-size:22px; color:#111827;">${heading}</h2>
          ${highlight ? `<div style="background:#eff6ff; border-left:4px solid #2563eb; padding:14px 16px; border-radius:8px; margin:18px 0; font-weight:600; color:#1d4ed8;">${highlight}</div>` : ""}
          ${body ? `<p style="margin:0 0 12px; font-size:15px; color:#374151;">${body}</p>` : ""}
          <p style="margin:20px 0 0; font-size:14px; color:#6b7280;">${footerNote || "Thank you for choosing PixelShop."}</p>
        </div>
        <div style="padding:0 32px 32px; font-size:13px; color:#6b7280;">
          <p style="margin:0 0 8px;">Need help? Contact us at <a href="mailto:${supportEmail}" style="color:#2563eb; text-decoration:none;">${supportEmail}</a></p>
          <p style="margin:0;">Visit <a href="${websiteUrl}" style="color:#2563eb; text-decoration:none;">${websiteUrl}</a></p>
        </div>
      </div>
    </div>
  `;
}
//# sourceMappingURL=emailTemplates.js.map