import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { z } from "zod";

const volunteerSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
  email: z.string().email("Email không hợp lệ").max(255),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  skills: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 kỹ năng"),
  availability: z.string().min(1, "Vui lòng chọn thời gian rảnh"),
  motivation: z.string().trim().min(20, "Lý do tham gia phải có ít nhất 20 ký tự").max(1000),
});

const SKILL_OPTIONS = [
  { id: "teaching", label: "Giảng dạy tiếng Anh" },
  { id: "mentoring", label: "Mentoring 1-1" },
  { id: "content", label: "Tạo nội dung/Tài liệu" },
  { id: "tech", label: "Hỗ trợ kỹ thuật" },
  { id: "marketing", label: "Marketing/Truyền thông" },
  { id: "admin", label: "Hành chính/Quản lý" },
];

const AVAILABILITY_OPTIONS = [
  { value: "weekday_morning", label: "Ngày thường - Buổi sáng" },
  { value: "weekday_afternoon", label: "Ngày thường - Buổi chiều" },
  { value: "weekday_evening", label: "Ngày thường - Buổi tối" },
  { value: "weekend", label: "Cuối tuần" },
  { value: "flexible", label: "Linh hoạt" },
];

const Volunteer = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: [] as string[],
    availability: "",
    motivation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = volunteerSchema.parse(formData);

      const { error } = await supabase.from('volunteers').insert([{
        full_name: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        skills: validated.skills,
        availability: validated.availability,
        motivation: validated.motivation,
      }]);

      if (error) throw error;

      toast.success("Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm nhất.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        skills: [],
        availability: "",
        motivation: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-playfair text-2xl font-bold">ARC HOPE</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Trở Thành Tình Nguyện Viên
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chia sẻ thời gian và kỹ năng của bạn để thay đổi cuộc đời của những người cần giúp đỡ
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Tạo Tác Động", desc: "Giúp đỡ người thật sự cần" },
              { icon: Users, title: "Kết Nối Cộng Đồng", desc: "Gặp gỡ những người cùng chí hướng" },
              { icon: BookOpen, title: "Phát Triển Bản Thân", desc: "Rèn luyện kỹ năng mềm" },
              { icon: Clock, title: "Linh Hoạt Thời Gian", desc: "Tham gia theo lịch của bạn" },
            ].map((item, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="pt-6">
                  <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 px-4 bg-secondary">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-2xl">Đăng Ký Tình Nguyện Viên</CardTitle>
              <CardDescription>
                Điền thông tin bên dưới để bắt đầu hành trình tình nguyện của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="0901234567"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Kỹ năng bạn muốn đóng góp *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {SKILL_OPTIONS.map((skill) => (
                      <div key={skill.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill.id}
                          checked={formData.skills.includes(skill.id)}
                          onCheckedChange={() => toggleSkill(skill.id)}
                        />
                        <label htmlFor={skill.id} className="text-sm cursor-pointer">
                          {skill.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Thời gian rảnh *</Label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    required
                  >
                    <option value="">Chọn thời gian...</option>
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Lý do bạn muốn tham gia *</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    placeholder="Chia sẻ lý do bạn muốn trở thành tình nguyện viên của ARC HOPE..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "Gửi Đăng Ký"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4 text-center">
        <p>&copy; 2025 ARC HOPE | Arc Blaze Ecosystem</p>
      </footer>
    </div>
  );
};

export default Volunteer;
