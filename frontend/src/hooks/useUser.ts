import { useMutation } from "@tanstack/react-query";
import sendMessage, {
  ContactFormData,
  SendMessageResponse,
} from "@/app/(api)/sendMessage";
import { toast } from "sonner";

export default function useSendMessage() {
  return useMutation<SendMessageResponse, Error, ContactFormData>({
    mutationKey: ["sendMessage"],
    mutationFn: (formData: ContactFormData) => sendMessage(formData),
    onSuccess: (data) => {
      toast.success(data.message || "Message sent successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to send message. Please try again later.",
      );
    },
  });
}
