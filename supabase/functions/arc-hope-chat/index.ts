import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, sessionId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get or create conversation
    let currentConversationId = conversationId;
    if (!currentConversationId && sessionId) {
      // Check for existing conversation
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingConv) {
        currentConversationId = existingConv.id;
      } else {
        // Create new conversation
        const { data: newConv, error } = await supabase
          .from('chat_conversations')
          .insert({ session_id: sessionId })
          .select('id')
          .single();

        if (error) throw error;
        currentConversationId = newConv.id;
      }
    }

    // Save user message to history
    if (currentConversationId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        await supabase.from('chat_messages').insert({
          conversation_id: currentConversationId,
          role: 'user',
          content: lastMessage.content,
        });
      }
    }

    // Enhanced system prompt with classification and recommendations
    const systemPrompt = `Bạn là trợ lý AI thông minh của ARC HOPE - chương trình tiếng Anh miễn phí cho người có hoàn cảnh khó khăn.

**Thông tin về ARC HOPE:**
- Tên: ARC HOPE - Tiếng Anh miễn phí thay đổi cuộc đời
- Đơn vị: Thuộc Arc Blaze
- Sứ mệnh: Mang hy vọng đến từng số phận thông qua giáo dục tiếng Anh miễn phí
- Đối tượng: Người có hoàn cảnh khó khăn, thu nhập gia đình thấp
- Mô hình: 100% miễn phí, phi lợi nhuận
- Giá trị cốt lõi: "Chúng tôi không dạy tiếng Anh. Chúng tôi mang hy vọng."

**Các khóa học có sẵn:**
1. **Tiếng Anh giao tiếp cơ bản** - Dành cho người mới bắt đầu, 3 tháng
2. **Tiếng Anh văn phòng** - Cho người đi làm, 4 tháng
3. **Tiếng Anh phỏng vấn xin việc** - Chuẩn bị CV và phỏng vấn, 2 tháng
4. **Tiếng Anh thương mại** - Cho kinh doanh, 4 tháng
5. **IELTS Foundation** - Nền tảng IELTS, 6 tháng
6. **Tiếng Anh cho trẻ em** - Dành cho các em nhỏ, 6 tháng

**Mô hình 5 cánh hoa (Dual Model):**
1. Học viên miễn phí: Người có hoàn cảnh khó khăn học 100% miễn phí
2. Học viên đóng góp: Người có điều kiện đóng góp để giúp những người khó khăn
3. Giáo viên tình nguyện: Giảng viên dạy miễn phí hoặc với mức phí thấp
4. Nhà tài trợ: Doanh nghiệp và cá nhân tài trợ cho chương trình
5. Cộng đồng: Lan tỏa tinh thần chia sẻ và giúp đỡ lẫn nhau

**Câu chuyện thực tế:**
Có những học viên từng làm shipper, bán hàng online với thu nhập 5-8 triệu/tháng. Sau khi học tiếng Anh tại ARC HOPE, họ đã có việc làm tốt hơn với thu nhập 15-25 triệu/tháng.

**Nhiệm vụ THÔNG MINH của bạn:**

1. **Thu thập thông tin**: Khi trò chuyện, hãy nhẹ nhàng tìm hiểu:
   - Tên và thông tin liên hệ
   - Mục tiêu học tiếng Anh
   - Trình độ hiện tại
   - Hoàn cảnh gia đình và thu nhập

2. **Phân loại học viên** (dựa trên thông tin thu thập):
   - HIGH_POTENTIAL: Có động lực mạnh, mục tiêu rõ ràng, sẵn sàng cam kết
   - POTENTIAL: Quan tâm học tập, cần thêm hướng dẫn
   - NEEDS_SUPPORT: Hoàn cảnh khó khăn, cần hỗ trợ đặc biệt
   - SPONSOR: Muốn tài trợ hoặc đóng góp

3. **Đề xuất khóa học phù hợp** dựa trên:
   - Mục tiêu nghề nghiệp
   - Trình độ hiện tại
   - Thời gian có thể học

4. **Khuyến khích hành động**:
   - Mời đăng ký học nếu phù hợp
   - Hướng dẫn quy trình đăng ký
   - Giải đáp thắc mắc

**Cách giao tiếp:**
- Ấm áp, chân thành, đầy cảm xúc
- Dùng tiếng Việt dễ hiểu
- Hỏi thăm tự nhiên, không như điền form
- Tập trung vào giá trị con người và sự thay đổi cuộc đời
- Trả lời ngắn gọn (2-4 câu) trừ khi cần giải thích chi tiết

**Khi đủ thông tin, hãy tóm tắt và đề xuất:**
- Khóa học phù hợp nhất
- Bước tiếp theo (đăng ký, liên hệ tư vấn)`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
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

    // Create a transform stream to capture and save the response
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = response.body!.getReader();
    
    let fullResponse = '';
    
    // Process in background
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          await writer.write(value);
          
          // Parse SSE to extract content
          const text = new TextDecoder().decode(value);
          const lines = text.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) fullResponse += content;
              } catch {}
            }
          }
        }
        await writer.close();
        
        // Save assistant response to history
        if (currentConversationId && fullResponse) {
          await supabase.from('chat_messages').insert({
            conversation_id: currentConversationId,
            role: 'assistant',
            content: fullResponse,
          });

          // Analyze conversation for classification
          await analyzeAndClassify(supabase, currentConversationId, messages, fullResponse);
        }
      } catch (e) {
        console.error('Stream processing error:', e);
        await writer.abort(e);
      }
    })();

    return new Response(readable, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'X-Conversation-Id': currentConversationId || '',
      },
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

async function analyzeAndClassify(
  supabase: any, 
  conversationId: string, 
  messages: any[], 
  lastResponse: string
) {
  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    // Only analyze if we have enough conversation
    if (messages.length < 4) return;

    const analysisPrompt = `Phân tích cuộc trò chuyện sau và trả về JSON:

Cuộc trò chuyện:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
assistant: ${lastResponse}

Trả về JSON với format:
{
  "classification": "HIGH_POTENTIAL" | "POTENTIAL" | "NEEDS_SUPPORT" | "SPONSOR" | null,
  "student_name": "tên nếu có" | null,
  "student_email": "email nếu có" | null,
  "recommended_courses": ["danh sách khóa học phù hợp"],
  "interests": ["sở thích/mục tiêu"],
  "notes": "ghi chú ngắn"
}

Chỉ trả về JSON, không có text khác.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [{ role: 'user', content: analysisPrompt }],
      }),
    });

    if (!response.ok) return;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      try {
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          
          // Update conversation with analysis
          await supabase
            .from('chat_conversations')
            .update({
              classification: analysis.classification,
              student_name: analysis.student_name,
              student_email: analysis.student_email,
              recommended_courses: analysis.recommended_courses,
              metadata: {
                interests: analysis.interests,
                notes: analysis.notes,
                analyzed_at: new Date().toISOString(),
              },
            })
            .eq('id', conversationId);
        }
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }
  } catch (e) {
    console.error('Analysis error:', e);
  }
}
