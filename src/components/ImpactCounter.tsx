import { useEffect, useState, useRef } from "react";
import { Users, GraduationCap, Heart, Briefcase } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function for smoother animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={counterRef} className="font-playfair text-5xl md:text-6xl font-bold text-primary">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const impactData = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Học Viên Đã Đào Tạo",
    description: "Từ khắp mọi miền đất nước",
  },
  {
    icon: GraduationCap,
    value: 85,
    suffix: "%",
    label: "Tỷ Lệ Tốt Nghiệp",
    description: "Hoàn thành chương trình",
  },
  {
    icon: Briefcase,
    value: 70,
    suffix: "%",
    label: "Thăng Tiến Nghề Nghiệp",
    description: "Tìm được việc làm tốt hơn",
  },
  {
    icon: Heart,
    value: 50,
    suffix: "+",
    label: "Nhà Tài Trợ",
    description: "Đồng hành cùng sứ mệnh",
  },
];

export const ImpactCounter = () => {
  return (
    <section className="py-20 px-4 bg-accent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Tác Động Xã Hội
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Những con số không chỉ là thống kê - đó là những cuộc đời đã được thay đổi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactData.map((item, index) => (
            <div
              key={index}
              className="bg-background p-8 rounded-3xl shadow-soft text-center hover:shadow-warm transition-all duration-300 hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              
              <AnimatedCounter end={item.value} suffix={item.suffix} />
              
              <h3 className="font-semibold text-foreground mt-4 mb-2">
                {item.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary/10 rounded-3xl p-8 text-center">
          <p className="text-xl text-foreground/90 font-medium">
            <span className="text-primary font-bold">Mỗi năm,</span> chúng tôi giúp hơn{" "}
            <span className="text-primary font-bold">100 gia đình</span> thoát khỏi vòng xoáy nghèo đói
            thông qua giáo dục tiếng Anh
          </p>
        </div>
      </div>
    </section>
  );
};
