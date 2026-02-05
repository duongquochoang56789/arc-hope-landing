import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Trophy, Clock, ArrowLeft, Search, GraduationCap, Target, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Email không hợp lệ");

type StudentProgress = {
  id: string;
  module_name: string;
  progress_percent: number;
  completed_at: string | null;
  notes: string | null;
};

type Student = {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
};

const Portal = () => {
  const [email, setEmail] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSearched(true);

    try {
      emailSchema.parse(email);

      // Note: This is a public lookup - in production, you'd want proper auth
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (studentError) throw studentError;

      if (!studentData) {
        setStudent(null);
        setProgress([]);
        toast.error("Không tìm thấy học viên với email này");
        return;
      }

      setStudent(studentData);

      // Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentData.id)
        .order('module_name');

      if (progressError) throw progressError;
      setProgress(progressData || []);

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
      setStudent(null);
      setProgress([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      pending: { label: "Đang chờ xét duyệt", variant: "secondary" },
      approved: { label: "Đã được chấp nhận", variant: "default" },
      rejected: { label: "Không được chấp nhận", variant: "destructive" },
    };
    return statusMap[status] || { label: status, variant: "secondary" as const };
  };

  const totalProgress = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / progress.length)
    : 0;

  const completedModules = progress.filter(p => p.completed_at).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-playfair text-2xl font-bold">ARC HOPE</span>
          </Link>
          <span className="text-primary-foreground/80">Cổng Học Viên</span>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Cổng Học Viên
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Theo dõi tiến độ học tập và xem thông tin cá nhân của bạn
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 bg-background">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Tra Cứu Thông Tin</CardTitle>
              <CardDescription className="text-center">
                Nhập email đã đăng ký để xem tiến độ học tập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {searched && (
        <section className="py-8 px-4 bg-secondary">
          <div className="max-w-4xl mx-auto">
            {student ? (
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
                  <TabsTrigger value="progress">Tiến Độ Chi Tiết</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Student Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Thông Tin Học Viên
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Họ tên</Label>
                        <p className="font-medium">{student.full_name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{student.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Trạng thái</Label>
                        <div className="mt-1">
                          <Badge variant={getStatusInfo(student.status).variant}>
                            {getStatusInfo(student.status).label}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Ngày đăng ký</Label>
                        <p className="font-medium">
                          {new Date(student.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Trophy className="w-10 h-10 text-primary mx-auto mb-2" />
                        <p className="text-3xl font-bold text-primary">{totalProgress}%</p>
                        <p className="text-sm text-muted-foreground">Tiến độ tổng</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <BookOpen className="w-10 h-10 text-primary mx-auto mb-2" />
                        <p className="text-3xl font-bold text-primary">{progress.length}</p>
                        <p className="text-sm text-muted-foreground">Module đang học</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
                        <p className="text-3xl font-bold text-primary">{completedModules}</p>
                        <p className="text-sm text-muted-foreground">Module hoàn thành</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Overall Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tiến Độ Học Tập</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tiến độ tổng thể</span>
                          <span className="font-medium">{totalProgress}%</span>
                        </div>
                        <Progress value={totalProgress} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                  {progress.length > 0 ? (
                    progress.map((module) => (
                      <Card key={module.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">{module.module_name}</h3>
                            </div>
                            {module.completed_at ? (
                              <Badge variant="default">Hoàn thành</Badge>
                            ) : (
                              <Badge variant="secondary">Đang học</Badge>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Tiến độ</span>
                              <span className="font-medium">{module.progress_percent}%</span>
                            </div>
                            <Progress value={module.progress_percent || 0} />
                          </div>
                          {module.notes && (
                            <p className="mt-3 text-sm text-muted-foreground italic">
                              Ghi chú: {module.notes}
                            </p>
                          )}
                          {module.completed_at && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Hoàn thành: {new Date(module.completed_at).toLocaleDateString('vi-VN')}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Chưa có dữ liệu tiến độ học tập</p>
                        <p className="text-sm mt-2">
                          Tiến độ sẽ được cập nhật khi bạn bắt đầu học
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Không tìm thấy học viên với email này</p>
                  <p className="text-sm mt-2">
                    Vui lòng kiểm tra lại email hoặc <Link to="/" className="text-primary hover:underline">đăng ký học</Link>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4 text-center mt-auto">
        <p>&copy; 2025 ARC HOPE | Arc Blaze Ecosystem</p>
      </footer>
    </div>
  );
};

export default Portal;
