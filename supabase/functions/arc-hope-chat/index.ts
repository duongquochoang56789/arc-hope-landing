import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Bạn là trợ lý AI của ARC HOPE - chương trình tiếng Anh miễn phí cho người có hoàn cảnh khó khăn.

**Thông tin về ARC HOPE:**
- Tên: ARC HOPE - Tiếng Anh miễn phí thay đổi cuộc đời
- Đơn vị: Thuộc Arc Blaze
- Sứ mệnh: Mang hy vọng đến từng số phận thông qua giáo dục tiếng Anh miễn phí
- Đối tượng: Người có hoàn cảnh khó khăn, thu nhập gia đình thấp
- Mô hình: 100% miễn phí, phi lợi nhuận
- Giá trị cốt lõi: "Chúng tôi không dạy tiếng Anh. Chúng tôi mang hy vọng."

**Mô hình 5 cánh hoa (Dual Model):**
1. Học viên miễn phí: Người có hoàn cảnh khó khăn học 100% miễn phí
2. Học viên đóng góp: Người có điều kiện đóng góp để giúp những người khó khăn
3. Giáo viên tình nguyện: Giảng viên dạy miễn phí hoặc với mức phí thấp
4. Nhà tài trợ: Doanh nghiệp và cá nhân tài trợ cho chương trình
5. Cộng đồng: Lan tỏa tinh thần chia sẻ và giúp đỡ lẫn nhau

**Câu chuyện thực tế:**
Có những học viên từng làm shipper, bán hàng online với thu nhập 5-8 triệu/tháng. Sau khi học tiếng Anh tại ARC HOPE, họ đã có việc làm tốt hơn với thu nhập 15-25 triệu/tháng, thay đổi hoàn toàn cuộc đời và gia đình.

**Nhiệm vụ của bạn:**
1. Trả lời các câu hỏi về ARC HOPE một cách nhiệt tình, chân thành
2. Khuyến khích người có hoàn cảnh khó khăn đăng ký học miễn phí
3. Mời gọi người có điều kiện tài trợ hoặc tham gia đóng góp
4. Chia sẻ câu chuyện cảm động về sự thay đổi của học viên
5. Luôn truyền cảm hứng và hy vọng

**Cách giao tiếp:**
- Ấm áp, chân thành, đầy cảm xúc
- Dùng tiếng Việt dễ hiểu
- Tập trung vào giá trị con người và sự thay đổi cuộc đời
- Khuyến khích hành động cụ thể (đăng ký học, tài trợ, chia sẻ)

Hãy trả lời ngắn gọn (2-3 câu) trừ khi được hỏi chi tiết.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Đang có quá nhiều yêu cầu, vui lòng thử lại sau.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Hệ thống cần được nạp thêm tín dụng.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Lỗi kết nối AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Lỗi không xác định' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
