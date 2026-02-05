import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Ai có thể đăng ký học tại ARC HOPE?",
    answer: "ARC HOPE chào đón tất cả những ai có hoàn cảnh khó khăn và mong muốn học tiếng Anh để thay đổi cuộc sống. Chúng tôi ưu tiên những người có thu nhập gia đình dưới 15 triệu/tháng, có động lực học tập và cam kết tham gia đầy đủ các buổi học.",
  },
  {
    question: "Chương trình học hoàn toàn miễn phí?",
    answer: "Đúng vậy! Đối với học viên đủ điều kiện về hoàn cảnh, chương trình hoàn toàn miễn phí 100%. Chúng tôi được tài trợ bởi các nhà hảo tâm và doanh nghiệp có tâm. Học viên có điều kiện tốt hơn có thể đóng góp để hỗ trợ những bạn khó khăn hơn.",
  },
  {
    question: "Giáo trình và phương pháp giảng dạy như thế nào?",
    answer: "Chúng tôi sử dụng giáo trình chuẩn quốc tế được Việt hóa phù hợp. Mỗi học viên được mentoring 1-1, theo dõi tiến độ định kỳ, và có cơ hội thực hành với người bản ngữ. Phương pháp tập trung vào giao tiếp thực tế và ứng dụng trong công việc.",
  },
  {
    question: "Thời gian học như thế nào?",
    answer: "Chương trình kéo dài 6 tháng với 3-4 buổi học/tuần, mỗi buổi 1.5-2 giờ. Chúng tôi có lịch học linh hoạt vào buổi tối và cuối tuần để phù hợp với người đi làm.",
  },
  {
    question: "Làm sao để trở thành nhà tài trợ?",
    answer: "Bạn có thể tài trợ theo nhiều hình thức: học bổng cho 1 học viên (từ 3 triệu/tháng), tài trợ theo khóa, hoặc đóng góp định kỳ. Mọi khoản đóng góp đều được báo cáo minh bạch và bạn có thể theo dõi tiến độ của học viên được tài trợ.",
  },
  {
    question: "Sau khi học xong, tôi được hỗ trợ gì?",
    answer: "Ngoài kiến thức tiếng Anh, chúng tôi hỗ trợ kết nối việc làm với các công ty đối tác, hướng dẫn viết CV và phỏng vấn, cũng như tham gia cộng đồng cựu học viên để tiếp tục phát triển.",
  },
  {
    question: "Làm sao để tôi đăng ký làm tình nguyện viên/giáo viên?",
    answer: "Chúng tôi luôn chào đón những tình nguyện viên nhiệt huyết. Bạn có thể đăng ký qua form trên website hoặc liên hệ trực tiếp qua Zalo. Yêu cầu tối thiểu là có trình độ tiếng Anh từ IELTS 6.5 trở lên và sẵn sàng cam kết ít nhất 3 tháng.",
  },
  {
    question: "ARC HOPE hoạt động ở đâu?",
    answer: "Hiện tại chúng tôi hoạt động chủ yếu tại TP.HCM với các lớp học trực tiếp và online. Chúng tôi đang mở rộng sang các tỉnh thành khác và đặc biệt chú trọng hỗ trợ học viên ở vùng sâu vùng xa thông qua hình thức học online.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-lg text-muted-foreground">
            Giải đáp những thắc mắc phổ biến về ARC HOPE
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background rounded-2xl px-6 shadow-soft border-none"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed pb-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy câu trả lời bạn cần?
          </p>
          <p className="text-primary font-semibold">
            Liên hệ qua Zalo: 0901234567 hoặc email: contact@archope.vn
          </p>
        </div>
      </div>
    </section>
  );
};
