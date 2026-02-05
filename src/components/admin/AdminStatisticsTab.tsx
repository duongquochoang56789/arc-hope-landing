import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, UserCheck, UserX, TrendingUp, FileText, Star, Building2 } from "lucide-react";

type Stats = {
  totalStudents: number;
  pendingStudents: number;
  approvedStudents: number;
  rejectedStudents: number;
  totalBlogPosts: number;
  totalTestimonials: number;
  totalSponsors: number;
  monthlyRegistrations: { month: string; count: number }[];
  incomeDistribution: { income: string; count: number }[];
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const AdminStatisticsTab = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch students
      const { data: students } = await supabase.from('students').select('*');
      
      // Fetch blog posts count
      const { count: blogCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
      
      // Fetch testimonials count
      const { count: testimonialsCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });
      
      // Fetch sponsors count
      const { count: sponsorsCount } = await supabase.from('sponsors').select('*', { count: 'exact', head: true });

      if (students) {
        // Calculate monthly registrations
        const monthlyData: Record<string, number> = {};
        students.forEach(student => {
          const month = new Date(student.created_at).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        // Calculate income distribution
        const incomeData: Record<string, number> = {};
        students.forEach(student => {
          incomeData[student.income] = (incomeData[student.income] || 0) + 1;
        });

        setStats({
          totalStudents: students.length,
          pendingStudents: students.filter(s => s.status === 'pending').length,
          approvedStudents: students.filter(s => s.status === 'approved').length,
          rejectedStudents: students.filter(s => s.status === 'rejected').length,
          totalBlogPosts: blogCount || 0,
          totalTestimonials: testimonialsCount || 0,
          totalSponsors: sponsorsCount || 0,
          monthlyRegistrations: Object.entries(monthlyData).map(([month, count]) => ({ month, count })),
          incomeDistribution: Object.entries(incomeData).map(([income, count]) => ({ income, count })),
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải thống kê...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-muted-foreground">Không có dữ liệu</div>;
  }

  const statusData = [
    { name: 'Chờ duyệt', value: stats.pendingStudents },
    { name: 'Đã duyệt', value: stats.approvedStudents },
    { name: 'Từ chối', value: stats.rejectedStudents },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bài viết</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTestimonials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhà tài trợ</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSponsors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Đăng ký theo tháng</CardTitle>
            <CardDescription>Số lượng học viên đăng ký mỗi tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trạng thái học viên</CardTitle>
            <CardDescription>Phân bổ theo trạng thái xét duyệt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Phân bổ thu nhập</CardTitle>
            <CardDescription>Phân bổ học viên theo mức thu nhập gia đình</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.incomeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="income" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatisticsTab;
