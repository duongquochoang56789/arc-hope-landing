import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, GraduationCap } from "lucide-react";

type Student = {
  id: string;
  full_name: string;
  email: string;
};

type StudentProgress = {
  id: string;
  student_id: string;
  module_name: string;
  progress_percent: number;
  notes: string | null;
  completed_at: string | null;
  students?: Student;
};

const MODULES = [
  "Nhập môn Kế toán",
  "Kế toán tài chính cơ bản",
  "Kế toán tài chính nâng cao",
  "Kế toán thuế",
  "Kế toán quản trị",
  "Phần mềm kế toán",
  "Thực hành tổng hợp",
  "Chuẩn bị phỏng vấn",
];

const AdminProgressTab = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentProgress | null>(null);
  const [formData, setFormData] = useState({
    student_id: "",
    module_name: "",
    progress_percent: 0,
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch approved students
      const { data: studentsData } = await supabase
        .from('students')
        .select('id, full_name, email')
        .eq('status', 'approved');

      setStudents(studentsData || []);

      // Fetch progress
      const { data: progressData, error } = await supabase
        .from('student_progress')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map student names to progress
      const progressWithStudents = (progressData || []).map(p => ({
        ...p,
        students: studentsData?.find(s => s.id === p.student_id),
      }));

      setProgressList(progressWithStudents);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu tiến độ.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        student_id: formData.student_id,
        module_name: formData.module_name,
        progress_percent: formData.progress_percent,
        notes: formData.notes || null,
        completed_at: formData.progress_percent === 100 ? new Date().toISOString() : null,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('student_progress')
          .update(payload)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: "Đã cập nhật tiến độ" });
      } else {
        const { error } = await supabase
          .from('student_progress')
          .insert(payload);

        if (error) throw error;
        toast({ title: "Đã thêm tiến độ mới" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu tiến độ.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: StudentProgress) => {
    setEditingItem(item);
    setFormData({
      student_id: item.student_id,
      module_name: item.module_name,
      progress_percent: item.progress_percent,
      notes: item.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tiến độ này?")) return;

    try {
      const { error } = await supabase
        .from('student_progress')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Đã xóa tiến độ" });
      fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa tiến độ.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      student_id: "",
      module_name: "",
      progress_percent: 0,
      notes: "",
    });
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Theo dõi tiến độ học viên
          </CardTitle>
          <CardDescription>Quản lý tiến độ học tập của các học viên đã được duyệt</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button disabled={students.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm tiến độ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Cập nhật tiến độ" : "Thêm tiến độ mới"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="student_id">Học viên</Label>
                <Select 
                  value={formData.student_id} 
                  onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn học viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.full_name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="module_name">Module học tập</Label>
                <Select 
                  value={formData.module_name} 
                  onValueChange={(value) => setFormData({ ...formData, module_name: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn module" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULES.map((module) => (
                      <SelectItem key={module} value={module}>
                        {module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="progress_percent">Tiến độ hoàn thành (%)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="progress_percent"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress_percent}
                    onChange={(e) => setFormData({ ...formData, progress_percent: parseInt(e.target.value) || 0 })}
                    className="w-24"
                  />
                  <Progress value={formData.progress_percent} className="flex-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Nhận xét về tiến độ học tập..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={!formData.student_id || !formData.module_name}>
                  {editingItem ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có học viên nào được duyệt để theo dõi tiến độ
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học viên</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Hoàn thành</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {progressList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.students?.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{item.module_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[150px]">
                        <Progress value={item.progress_percent} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12">
                          {item.progress_percent}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.notes || "-"}
                    </TableCell>
                    <TableCell>
                      {item.completed_at 
                        ? new Date(item.completed_at).toLocaleDateString('vi-VN')
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {progressList.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có dữ liệu tiến độ
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProgressTab;
