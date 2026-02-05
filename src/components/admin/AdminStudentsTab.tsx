import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const updateStudentStatus = async (id: string, status: string) => {
    try {
      // Find the student to get their info
      const student = students.find(s => s.id === id);
      
      const { error } = await supabase
        .from('students')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Send email notification
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
          // Don't fail the whole operation if email fails
        }
      }

      toast({
        title: "Cập nhật thành công",
        description: `Đã ${status === 'approved' ? 'chấp nhận' : 'từ chối'} học viên. Email thông báo đã được gửi.`,
      });

      onRefresh();
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật trạng thái.",
        variant: "destructive",
      });
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
  );
};

export default AdminStudentsTab;
