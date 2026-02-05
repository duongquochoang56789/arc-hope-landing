import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, CheckCircle, XCircle, Users } from "lucide-react";

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

interface AdminStudentsTabProps {
  students: Student[];
  onRefresh: () => void;
}

const AdminStudentsTab = ({ students, onRefresh }: AdminStudentsTabProps) => {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map(s => s.id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Họ tên', 'Email', 'Điện thoại', 'Mục tiêu', 'Thu nhập', 'Trạng thái', 'Ngày đăng ký'];
    const rows = students.map(s => [
      s.full_name,
      s.email,
      s.phone,
      s.goal.replace(/,/g, ';'),
      s.income,
      s.status,
      new Date(s.created_at).toLocaleDateString('vi-VN')
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: "Xuất file thành công", description: `Đã xuất ${students.length} học viên ra file CSV` });
  };

  const bulkUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (selectedIds.length === 0) {
      toast({ title: "Chưa chọn học viên", description: "Vui lòng chọn ít nhất 1 học viên", variant: "destructive" });
      return;
    }

    setBulkLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({ status })
        .in('id', selectedIds);

      if (error) throw error;

      // Send notifications to all selected students
      const selectedStudents = students.filter(s => selectedIds.includes(s.id));
      await Promise.allSettled(
        selectedStudents.map(student =>
          supabase.functions.invoke('send-notification', {
            body: {
              studentId: student.id,
              emailType: status,
              recipientEmail: student.email,
              studentName: student.full_name,
            },
          })
        )
      );

      toast({
        title: "Cập nhật thành công",
        description: `Đã ${status === 'approved' ? 'chấp nhận' : 'từ chối'} ${selectedIds.length} học viên`,
      });

      setSelectedIds([]);
      onRefresh();
    } catch (error) {
      toast({ title: "Có lỗi xảy ra", description: "Không thể cập nhật trạng thái", variant: "destructive" });
    } finally {
      setBulkLoading(false);
    }
  };

  const updateStudentStatus = async (id: string, status: string) => {
    try {
      const student = students.find(s => s.id === id);
      
      const { error } = await supabase
        .from('students')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      if (student) {
        try {
          await supabase.functions.invoke('send-notification', {
            body: {
              studentId: id,
              emailType: status === 'approved' ? 'approved' : 'rejected',
              recipientEmail: student.email,
              studentName: student.full_name,
            },
          });
        } catch (emailError) {
          console.error('Failed to send notification:', emailError);
        }
      }

      toast({
        title: "Cập nhật thành công",
        description: `Đã ${status === 'approved' ? 'chấp nhận' : 'từ chối'} học viên.`,
      });

      onRefresh();
    } catch (error) {
      toast({ title: "Có lỗi xảy ra", description: "Không thể cập nhật trạng thái.", variant: "destructive" });
    }
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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Danh sách học viên
            </CardTitle>
            <CardDescription>
              Quản lý và xét duyệt các đăng ký học viên mới
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Xuất CSV
            </Button>
            {selectedIds.length > 0 && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => bulkUpdateStatus('approved')}
                  disabled={bulkLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Duyệt ({selectedIds.length})
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => bulkUpdateStatus('rejected')}
                  disabled={bulkLoading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Từ chối ({selectedIds.length})
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedIds.length === students.length && students.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
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
              <TableRow key={student.id} className={selectedIds.includes(student.id) ? "bg-muted/50" : ""}>
                <TableCell>
                  <Checkbox 
                    checked={selectedIds.includes(student.id)}
                    onCheckedChange={() => toggleSelect(student.id)}
                  />
                </TableCell>
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
  );
};

export default AdminStudentsTab;
