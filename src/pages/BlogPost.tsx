import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  published_at: string | null;
  author_name: string;
  slug: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .not('published_at', 'is', null)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching post:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Không tìm thấy bài viết</h1>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại Blog
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-muted-foreground mb-8 pb-8 border-b">
            <span className="font-medium">{post.author_name}</span>
            {post.published_at && (
              <>
                <span>•</span>
                <time>
                  {format(new Date(post.published_at), 'dd MMMM yyyy', { locale: vi })}
                </time>
              </>
            )}
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-8 bg-accent rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Bạn muốn thay đổi cuộc đời?</h3>
            <p className="text-muted-foreground mb-6">
              Đăng ký học tiếng Anh miễn phí tại ARC HOPE ngay hôm nay
            </p>
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Đăng ký ngay
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
