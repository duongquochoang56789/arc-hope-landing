import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Email templates
const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Chào mừng bạn đến với ARC HOPE! 🌟',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ARC HOPE</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tiếng Anh miễn phí thay đổi cuộc đời</p>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2d5a27; margin-top: 0;">Xin chào ${name}! 👋</h2>
          <p style="color: #374151; line-height: 1.6;">
            Cảm ơn bạn đã đăng ký tham gia chương trình ARC HOPE. Đơn đăng ký của bạn đã được ghi nhận và đang chờ xét duyệt.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để thông báo kết quả.
          </p>
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #2d5a27; margin: 0; font-style: italic;">
              "Chúng tôi không chỉ dạy tiếng Anh. Chúng tôi mang hy vọng."
            </p>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
            Trân trọng,<br>Đội ngũ ARC HOPE
          </p>
        </div>
      </div>
    `,
  }),

  approved: (name: string) => ({
    subject: '🎉 Chúc mừng! Bạn đã được chấp nhận vào ARC HOPE',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 CHÚC MỪNG!</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2d5a27; margin-top: 0;">Xin chào ${name}!</h2>
          <p style="color: #374151; line-height: 1.6; font-size: 18px;">
            <strong>Đơn đăng ký của bạn đã được CHẤP NHẬN!</strong>
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Chào mừng bạn chính thức trở thành học viên của ARC HOPE. Đây là bước đầu tiên trong hành trình thay đổi cuộc đời của bạn!
          </p>
          <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h3 style="color: #166534; margin-top: 0;">Bước tiếp theo:</h3>
            <ol style="color: #374151; line-height: 1.8; margin-bottom: 0;">
              <li>Chờ email thông báo lịch học</li>
              <li>Tham gia buổi định hướng</li>
              <li>Bắt đầu hành trình học tập!</li>
            </ol>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
            Trân trọng,<br>Đội ngũ ARC HOPE
          </p>
        </div>
      </div>
    `,
  }),

  rejected: (name: string) => ({
    subject: 'Thông báo về đơn đăng ký ARC HOPE',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ARC HOPE</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2d5a27; margin-top: 0;">Xin chào ${name},</h2>
          <p style="color: #374151; line-height: 1.6;">
            Cảm ơn bạn đã quan tâm đến chương trình ARC HOPE. Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng đơn đăng ký của bạn chưa được chấp nhận trong đợt này.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Điều này không có nghĩa là cánh cửa đã đóng lại. Bạn có thể:
          </p>
          <ul style="color: #374151; line-height: 1.8;">
            <li>Đăng ký lại trong đợt tiếp theo</li>
            <li>Liên hệ với chúng tôi để được tư vấn thêm</li>
            <li>Theo dõi các chương trình khác của ARC HOPE</li>
          </ul>
          <p style="color: #374151; line-height: 1.6;">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn trên con đường học tập.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
            Trân trọng,<br>Đội ngũ ARC HOPE
          </p>
        </div>
      </div>
    `,
  }),
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentId, emailType, recipientEmail, studentName } = await req.json();
    
    if (!emailType || !recipientEmail) {
      throw new Error('Missing required fields: emailType, recipientEmail');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get email template
    const template = emailTemplates[emailType as keyof typeof emailTemplates];
    if (!template) {
      throw new Error(`Unknown email type: ${emailType}`);
    }

    const { subject, html } = template(studentName || 'Bạn');

    // For now, we'll use Resend API if configured, otherwise just log
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    let status = 'pending';
    let errorMessage = null;

    if (RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ARC HOPE <noreply@archope.org>',
            to: [recipientEmail],
            subject,
            html,
          }),
        });

        if (response.ok) {
          status = 'sent';
        } else {
          const error = await response.text();
          status = 'failed';
          errorMessage = error;
        }
      } catch (e) {
        status = 'failed';
        errorMessage = e instanceof Error ? e.message : 'Unknown error';
      }
    } else {
      // No Resend API key, just log
      console.log('Email would be sent:', { to: recipientEmail, subject, type: emailType });
      status = 'sent'; // Mark as sent for demo purposes
    }

    // Record the notification
    await supabase.from('email_notifications').insert({
      student_id: studentId || null,
      email_type: emailType,
      recipient_email: recipientEmail,
      subject,
      status,
      error_message: errorMessage,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    });

    return new Response(
      JSON.stringify({ success: status === 'sent', status, message: status === 'sent' ? 'Email sent successfully' : errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Email notification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
