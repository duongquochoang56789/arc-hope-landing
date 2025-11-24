import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  student_name: string;
  student_story: string;
  old_job: string | null;
  new_job: string | null;
  old_salary: string | null;
  new_salary: string | null;
  avatar_url: string | null;
}

export const TestimonialsCarousel = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching testimonials:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold text-foreground mb-3">
          Câu chuyện thay đổi cuộc đời
        </h2>
        <p className="text-muted-foreground">
          Những học viên đã thay đổi số phận nhờ ARC HOPE
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Avatar */}
            {testimonial.avatar_url && (
              <div className="flex-shrink-0">
                <img
                  src={testimonial.avatar_url}
                  alt={testimonial.student_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                {testimonial.student_name}
              </h3>

              <p className="text-foreground leading-relaxed italic">
                "{testimonial.student_story}"
              </p>

              {/* Before/After Stats */}
              {(testimonial.old_job || testimonial.new_job) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {/* Before */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Trước đây</p>
                    {testimonial.old_job && (
                      <p className="font-medium text-foreground">{testimonial.old_job}</p>
                    )}
                    {testimonial.old_salary && (
                      <p className="text-sm text-muted-foreground">{testimonial.old_salary}</p>
                    )}
                  </div>

                  {/* After */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hiện tại</p>
                    {testimonial.new_job && (
                      <p className="font-medium text-primary">{testimonial.new_job}</p>
                    )}
                    {testimonial.new_salary && (
                      <p className="text-sm text-primary font-semibold">{testimonial.new_salary}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={next}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-6">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-primary w-8' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};
