import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Users, BookOpen, TrendingUp, Award, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-classroom.jpg";
import successStory from "@/assets/success-story.jpg";
import graduationImage from "@/assets/graduation-embrace.jpg";
import { z } from "zod";
import { ChatBot } from "@/components/ChatBot";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { Link } from "react-router-dom";
import { SponsorsSection } from "@/components/SponsorsSection";
import { FAQSection } from "@/components/FAQSection";
import { ImpactCounter } from "@/components/ImpactCounter";
import { NewsletterSignup } from "@/components/NewsletterSignup";
const studentSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được quá 100 ký tự"),
  phone: z.string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  email: z.string()
    .email("Email không hợp lệ")
    .max(255, "Email quá dài"),
  goal: z.string()
    .trim()
    .min(10, "Mục tiêu phải có ít nhất 10 ký tự")
    .max(500, "Mục tiêu không được quá 500 ký tự"),
  income: z.enum(["under_10m", "10_20m", "over_20m"], {
    errorMap: () => ({ message: "Vui lòng chọn mức thu nhập" })
  })
});

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    goal: "",
    income: ""
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validated = studentSchema.parse(formData);

      const { error } = await supabase
        .from('students')
        .insert([{
          full_name: validated.name,
          phone: validated.phone,
          email: validated.email,
          goal: validated.goal,
          income: validated.income,
        }]);

      if (error) throw error;

      toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất có thể.");
      
      setFormData({
        name: "",
        phone: "",
        email: "",
        goal: "",
        income: ""
      });
    } catch (error) {
      // Only log errors in development
      if (import.meta.env.DEV) {
        console.error('Error submitting form:', error);
      }

      // Handle validation errors
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }
  };
  return <div className="min-h-screen bg-background font-inter">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${heroImage})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-accent/50 to-muted/70" />
        </div>
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="max-w-5xl space-y-8 animate-fade-in">
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-widest text-foreground/80 uppercase">
                Bởi Arc Blaze
              </p>
              <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
                ARC HOPE
              </h1>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold text-primary">
                Tiếng Anh Miễn Phí Thay Đổi Cuộc Đời
              </h2>
            </div>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 font-light italic max-w-3xl mx-auto">
              "Chúng tôi không dạy tiếng Anh. Chúng tôi mang hy vọng đến từng số phận."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="hero" size="lg" className="text-lg px-10 py-7 rounded-xl" onClick={() => document.getElementById('registration-form')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                <Heart className="mr-2 h-5 w-5" />
                Tôi muốn học miễn phí
              </Button>
              <Button variant="heroPink" size="lg" className="text-lg px-10 py-7 rounded-xl" onClick={() => document.getElementById('registration-form')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                <DollarSign className="mr-2 h-5 w-5" />
                Tôi muốn tài trợ ngay
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Story Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary">
                Sứ Mệnh Của Chúng Tôi
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                ARC HOPE không chỉ là một lớp học tiếng Anh. Chúng tôi là cầu nối giữa những hoàn cảnh khó khăn với cơ hội thay đổi cuộc đời. Mỗi học viên của chúng tôi đều có một câu chuyện, một ước mơ, một quyết tâm.
              </p>
              
              <div className="bg-muted p-8 rounded-2xl border-l-4 border-primary shadow-soft">
                <h3 className="font-playfair text-2xl font-semibold text-primary mb-4">
                  Câu Chuyện Thật  
                </h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  <span className="font-semibold">Anh Tuấn</span>, 28 tuổi, công nhân nhà máy với mức lương 7 triệu/tháng. Sau 6 tháng học tại Arc Hope với sự mentoring tận tâm 1-1, anh đã chuyển sang làm việc cho công ty nước ngoài với mức lương 25 triệu/tháng.
                </p>
                <p className="text-primary font-medium italic">
                  "Arc Hope đã không chỉ dạy tôi tiếng Anh, mà còn cho tôi niềm tin để thay đổi cuộc đời."
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img src={successStory} alt="Câu chuyện thành công" className="rounded-3xl shadow-warm w-full h-auto animate-float" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* Sponsors Section */}
      <SponsorsSection />

      {/* Impact Counter */}
      <ImpactCounter />
      {/* Model Section - Infographic */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">
            Mô Hình Kép Độc Đáo
          </h2>
          <p className="text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
            Arc Hope vận hành dựa trên mô hình 5 trụ cột tương hỗ, tạo nên một hệ sinh thái bền vững
          </p>
          
          <div className="relative">
            {/* Center Circle */}
            <div className="flex justify-center mb-12">
              <div className="bg-accent rounded-full w-48 h-48 flex items-center justify-center shadow-warm">
                <div className="text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="font-playfair text-xl font-bold text-primary">ARC HOPE</p>
                  <p className="text-sm text-foreground/70">Trung tâm</p>
                </div>
              </div>
            </div>
            
            {/* Five Petals */}
            <div className="grid md:grid-cols-5 gap-6">
              {[{
              icon: BookOpen,
              title: "Giáo Trình",
              desc: "Chuẩn quốc tế, phù hợp người Việt"
            }, {
              icon: Users,
              title: "Mentoring 1-1",
              desc: "Hỗ trợ cá nhân hóa"
            }, {
              icon: TrendingUp,
              title: "Theo Dõi Tiến Độ",
              desc: "Đánh giá định kỳ"
            }, {
              icon: Award,
              title: "Kết Nối Việc Làm",
              desc: "Cơ hội nghề nghiệp"
            }, {
              icon: Heart,
              title: "Cộng Đồng",
              desc: "Hỗ trợ lâu dài"
            }].map((petal, index) => <div key={index} className="bg-secondary p-6 rounded-2xl shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                  <petal.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-playfair text-lg font-semibold text-primary mb-2">
                    {petal.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {petal.desc}
                  </p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary text-center mb-16">
            Chúng Tôi Phục Vụ Ai?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Học viên */}
            <div className="bg-background p-8 rounded-3xl shadow-soft">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-accent p-4 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-3xl font-bold text-primary">
                  Học Viên
                </h3>
              </div>
              
              <ul className="space-y-4">
                {["Thu nhập gia đình dưới 15 triệu/tháng", "Có động lực học tập và quyết tâm thay đổi", "Cam kết tham gia đầy đủ các buổi học", "Sẵn sàng học tập nghiêm túc và đóng góp cộng đồng"].map((item, index) => <li key={index} className="flex items-start gap-3">
                    <div className="bg-accent rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <span className="text-foreground/80">{item}</span>
                  </li>)}
              </ul>
            </div>
            
            {/* Nhà tài trợ */}
            <div className="bg-background p-8 rounded-3xl shadow-soft">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-accent p-4 rounded-full">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-3xl font-bold text-primary">
                  Nhà Tài Trợ
                </h3>
              </div>
              
              <ul className="space-y-4">
                {["Tin tương vào sức mạnh của giáo dục", "Muốn tạo tác động xã hội có ý nghĩa", "Mong muốn đồng hành cùng học viên", "Nhận báo cáo minh bạch về kết quả sử dụng"].map((item, index) => <li key={index} className="flex items-start gap-3">
                    <div className="bg-accent rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <span className="text-foreground/80">{item}</span>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Finance Structure Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary text-center mb-6">
            Cơ Cấu Tài Chính & Nguồn Lực
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
            Minh bạch, rõ ràng, hiệu quả - mọi đồng đóng góp đều đến đúng nơi cần đến
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-accent p-8 rounded-3xl shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="text-center mb-6">
                <div className="font-playfair text-5xl font-bold text-primary mb-2">
                  40%
                </div>
                <h3 className="font-playfair text-2xl font-semibold text-primary">
                  Học Phí Từ Học Viên Trả Phí
                </h3>
              </div>
              <p className="text-foreground/80 text-center leading-relaxed">
                Học viên có điều kiện tốt hơn đóng góp để hỗ trợ học viên nghèo
              </p>
            </div>
            
            <div className="bg-primary p-8 rounded-3xl shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="text-center mb-6">
                <div className="font-playfair text-5xl font-bold text-primary-foreground mb-2">
                  50%
                </div>
                <h3 className="font-playfair text-2xl font-semibold text-primary-foreground">
                  Tài Trợ & Quyên Góp
                </h3>
              </div>
              <p className="text-primary-foreground/90 text-center leading-relaxed">
                Từ cá nhân, doanh nghiệp và tổ chức có tâm hướng thiện
              </p>
            </div>
            
            <div className="bg-muted p-8 rounded-3xl shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="text-center mb-6">
                <div className="font-playfair text-5xl font-bold text-primary mb-2">
                  10%
                </div>
                <h3 className="font-playfair text-2xl font-semibold text-primary">
                  Nguồn Lực Tình Nguyện
                </h3>
              </div>
              <p className="text-foreground/80 text-center leading-relaxed">
                Giáo viên tình nguyện, cựu học viên đóng góp lại cộng đồng
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-background p-8 rounded-3xl shadow-soft text-center">
            <p className="text-lg text-foreground/80">
              <span className="font-semibold text-primary">100% minh bạch:</span> Mọi khoản thu chi đều được báo cáo công khai hàng quý
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src={graduationImage} alt="Lễ tốt nghiệp đầy cảm xúc" className="rounded-3xl shadow-warm w-full h-auto" />
            </div>
            
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary">
                Cùng Nhau Tạo Nên Kỳ Tích
              </h2>
              
              <div className="bg-accent p-8 rounded-2xl border-l-4 border-primary">
                <p className="font-playfair text-2xl text-primary font-semibold italic leading-relaxed">
                  "Arc Hope – Chúng tôi không bán khóa học. Chúng tôi bán hy vọng."
                </p>
              </div>
              
              <p className="text-lg text-foreground/80 leading-relaxed">
                Mỗi học viên tốt nghiệp không chỉ mang theo kiến thức tiếng Anh, mà còn mang theo niềm tin, sự tự tin, và khả năng thay đổi vận mệnh của chính mình và gia đình.
              </p>
              
              <div className="pt-4">
                <Button variant="hero" size="lg" className="text-lg px-10 py-7 rounded-xl" onClick={() => document.getElementById('registration-form')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  Bắt đầu hành trình của bạn ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Registration Form */}
      <section id="registration-form" className="py-20 px-4 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
              Đăng Ký Ngay Hôm Nay
            </h2>
            <p className="text-lg text-muted-foreground">
              Hãy để chúng tôi đồng hành cùng bạn trên hành trình thay đổi
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-background p-8 rounded-3xl shadow-soft space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Họ và Tên <span className="text-destructive">*</span>
              </Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} placeholder="Nguyễn Văn A" required className="border-border focus:border-primary" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">
                Số Điện Thoại <span className="text-destructive">*</span>
              </Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({
              ...formData,
              phone: e.target.value
            })} placeholder="0901234567" required className="border-border focus:border-primary" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} placeholder="email@example.com" required className="border-border focus:border-primary" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-foreground font-medium">
                Mục Tiêu Của Bạn <span className="text-destructive">*</span>
              </Label>
              <Textarea id="goal" value={formData.goal} onChange={e => setFormData({
              ...formData,
              goal: e.target.value
            })} placeholder="Chia sẻ mục tiêu và ước mơ của bạn..." required className="border-border focus:border-primary min-h-[100px]" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="income" className="text-foreground font-medium">
                Thu Nhập Gia Đình <span className="text-destructive">*</span>
              </Label>
              <select id="income" value={formData.income} onChange={e => setFormData({
              ...formData,
              income: e.target.value
            })} required className="w-full h-10 px-3 py-2 rounded-md border border-border bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Chọn mức thu nhập</option>
                <option value="under-10">Dưới 10 triệu/tháng</option>
                <option value="10-20">10-20 triệu/tháng</option>
                <option value="over-20">Trên 20 triệu/tháng</option>
              </select>
            </div>
            
            <Button type="submit" variant="hero" size="lg" className="w-full text-lg py-6">
              Gửi Đăng Ký
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              Chúng tôi sẽ liên hệ với bạn trong vòng 48 giờ làm việc
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-playfair text-2xl font-bold mb-4">ARC HOPE</h3>
              <p className="text-primary-foreground/80 mb-4">
                Tiếng Anh miễn phí cho người nghèo - Một dự án của Arc Blaze Ecosystem
              </p>
              <div className="bg-primary-foreground/10 rounded-xl p-4">
                <NewsletterSignup />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Liên Hệ</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Email: contact@archope.vn</li>
                <li>Zalo: 0901234567</li>
                <li>Fanpage: fb.com/archope</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tham Gia</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <Link to="/portal" className="hover:text-primary-foreground transition-colors">
                    Cổng Học Viên
                  </Link>
                </li>
                <li>
                  <Link to="/volunteer" className="hover:text-primary-foreground transition-colors">
                    Đăng Ký Tình Nguyện
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-primary-foreground transition-colors">
                    Blog & Tin tức
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Về Chúng Tôi</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Arc Blaze Ecosystem</li>
                <li>Dự án phi lợi nhuận</li>
                <li>Minh bạch - Hiệu quả - Nhân văn</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2025 ARC HOPE | Arc Blaze Ecosystem | Tất cả quyền được bảo lưu</p>
          </div>
        </div>
      </footer>

      {/* AI ChatBot */}
      <ChatBot />
    </div>;
};
export default Index;