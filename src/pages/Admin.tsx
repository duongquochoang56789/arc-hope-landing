import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Users, UserCheck, UserX, TrendingUp } from "lucide-react";

type Student = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  goal: string;
  income: string;
  status: string;
  created_at: string;
};

const Admin = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError || !roleData) {
        toast({
          title: "Không có quyền truy cập",
          description: "Bạn không có quyền admin.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchStudents();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate("/auth");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStudents(data || []);
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tải danh sách học viên.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Cập nhật thành công",
        description: `Đã ${status === 'approved' ? 'chấp nhận' : 'từ chối'} học viên.`,
      });

      fetchStudents();
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật trạng thái.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    } as const;

    const labels = {
      pending: "Chờ xét duyệt",
      approved: "Đã chấp nhận",
      rejected: "Đã từ chối",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const stats = {
    total: students.length,
    pending: students.filter(s => s.status === 'pending').length,
    approved: students.filter(s => s.status === 'approved').length,
    rejected: students.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Bảng điều khiển Admin</h1>
            <p className="text-muted-foreground mt-1">Quản lý học viên ARC HOPE</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số đăng ký</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xét duyệt</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã chấp nhận</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã từ chối</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách học viên</CardTitle>
            <CardDescription>
              Quản lý và xét duyệt các đăng ký học viên mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Mục tiêu</TableHead>
                  <TableHead>Thu nhập</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.full_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell className="max-w-xs truncate">{student.goal}</TableCell>
                    <TableCell>{student.income}</TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      {new Date(student.created_at).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {student.status !== 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => updateStudentStatus(student.id, 'approved')}
                          >
                            Chấp nhận
                          </Button>
                        )}
                        {student.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStudentStatus(student.id, 'rejected')}
                          >
                            Từ chối
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {students.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có học viên nào đăng ký
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
