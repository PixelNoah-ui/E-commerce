interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function contactEmailTemplate({
  name,
  email,
  phone,
  subject,
  message,
}: ContactEmailProps) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f5; padding:40px 20px;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden;">
        
        <div style="background:#f97316; padding:24px;">
          <h1 style="margin:0; color:white;">
            New Contact Message
          </h1>
        </div>

        <div style="padding:24px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject}</p>

          <hr style="margin:24px 0;" />

          <div>
            ${message.replace(/\n/g, "<br />")}
          </div>
        </div>
      </div>
    </div>
  `;
}
