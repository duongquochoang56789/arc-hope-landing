import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  author_name: string;
  slug: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching posts:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
          <h1 className="text-4xl font-serif font-bold text-foreground mt-4">
            Blog ARC HOPE
          </h1>
          <p className="text-muted-foreground mt-2">
            Chia sẻ kiến thức và câu chuyện truyền cảm hứng
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.author_name}</span>
                      {post.published_at && (
                        <>
                          <span>•</span>
                          <time>
                            {format(new Date(post.published_at), 'dd MMM yyyy', { locale: vi })}
                          </time>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
