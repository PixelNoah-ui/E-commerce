export interface ContactFormData {
  name: string;
  phone: string;
  subject: "Bulk Buy" | "Sell to Owners" | string;
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  error?: string;
}

export default async function sendMessage(
  data: ContactFormData,
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contact/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData?.message || "Failed to send message");
    }

    const resData = await response.json();

    return {
      success: true,
      message: resData?.message || "Message sent successfully!",
    };
  } catch (error) {
    console.error("sendMessage error:", error);
    return {
      success: false,
      message: "Something went wrong. Try again later.",
      error: "ServerError",
    };
  }
}
