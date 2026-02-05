import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Email không hợp lệ").max(255);

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      emailSchema.parse(email);

      const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          toast.info("Email này đã đăng ký nhận bản tin rồi!");
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast.success("Đăng ký thành công! Cảm ơn bạn đã theo dõi ARC HOPE.");
        setEmail("");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-accent/50 rounded-2xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="font-playfair text-xl font-semibold text-primary mb-2">
          Đã Đăng Ký Thành Công!
        </h3>
        <p className="text-muted-foreground text-sm">
          Cảm ơn bạn đã theo dõi. Chúng tôi sẽ gửi tin tức hữu ích đến bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-accent/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-playfair text-xl font-semibold text-primary">
            Nhận Bản Tin
          </h3>
          <p className="text-sm text-muted-foreground">
            Cập nhật tin tức và câu chuyện thành công
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={isSubmitting} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-3">
        Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất kỳ lúc nào.
      </p>
    </div>
  );
};
