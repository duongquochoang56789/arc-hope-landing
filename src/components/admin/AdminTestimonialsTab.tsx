import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Star } from "lucide-react";

type Testimonial = {
  id: string;
  student_name: string;
  student_story: string;
  old_job: string | null;
  new_job: string | null;
  old_salary: string | null;
  new_salary: string | null;
  avatar_url: string | null;
  year_graduated: number | null;
  is_featured: boolean | null;
  display_order: number | null;
};

const AdminTestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    student_name: "",
    student_story: "",
    old_job: "",
    new_job: "",
    old_salary: "",
    new_salary: "",
    avatar_url: "",
    year_graduated: new Date().getFullYear(),
    is_featured: false,
    display_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách testimonials.",
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
        student_name: formData.student_name,
        student_story: formData.student_story,
        old_job: formData.old_job || null,
        new_job: formData.new_job || null,
        old_salary: formData.old_salary || null,
        new_salary: formData.new_salary || null,
        avatar_url: formData.avatar_url || null,
        year_graduated: formData.year_graduated,
        is_featured: formData.is_featured,
        display_order: formData.display_order,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: "Đã cập nhật câu chuyện" });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert(payload);

        if (error) throw error;
        toast({ title: "Đã thêm câu chuyện mới" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu câu chuyện.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      student_name: item.student_name,
      student_story: item.student_story,
      old_job: item.old_job || "",
      new_job: item.new_job || "",
      old_salary: item.old_salary || "",
      new_salary: item.new_salary || "",
      avatar_url: item.avatar_url || "",
      year_graduated: item.year_graduated || new Date().getFullYear(),
      is_featured: item.is_featured || false,
      display_order: item.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa câu chuyện này?")) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Đã xóa câu chuyện" });
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa câu chuyện.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      student_name: "",
      student_story: "",
      old_job: "",
      new_job: "",
      old_salary: "",
      new_salary: "",
      avatar_url: "",
      year_graduated: new Date().getFullYear(),
      is_featured: false,
      display_order: 0,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Quản lý Testimonials</CardTitle>
          <CardDescription>Câu chuyện thành công của học viên</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm câu chuyện
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Sửa câu chuyện" : "Thêm câu chuyện mới"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="student_name">Tên học viên</Label>
                <Input
                  id="student_name"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="student_story">Câu chuyện</Label>
                <Textarea
                  id="student_story"
                  value={formData.student_story}
                  onChange={(e) => setFormData({ ...formData, student_story: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="old_job">Công việc cũ</Label>
                  <Input
                    id="old_job"
                    value={formData.old_job}
                    onChange={(e) => setFormData({ ...formData, old_job: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new_job">Công việc mới</Label>
                  <Input
                    id="new_job"
                    value={formData.new_job}
                    onChange={(e) => setFormData({ ...formData, new_job: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="old_salary">Lương cũ</Label>
                  <Input
                    id="old_salary"
                    value={formData.old_salary}
                    onChange={(e) => setFormData({ ...formData, old_salary: e.target.value })}
                    placeholder="VD: 5 triệu/tháng"
                  />
                </div>
                <div>
                  <Label htmlFor="new_salary">Lương mới</Label>
                  <Input
                    id="new_salary"
                    value={formData.new_salary}
                    onChange={(e) => setFormData({ ...formData, new_salary: e.target.value })}
                    placeholder="VD: 15 triệu/tháng"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year_graduated">Năm tốt nghiệp</Label>
                  <Input
                    id="year_graduated"
                    type="number"
                    value={formData.year_graduated}
                    onChange={(e) => setFormData({ ...formData, year_graduated: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="avatar_url">URL ảnh đại diện</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Đánh dấu nổi bật</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingItem ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học viên</TableHead>
              <TableHead>Công việc mới</TableHead>
              <TableHead>Lương mới</TableHead>
              <TableHead>Năm</TableHead>
              <TableHead>Nổi bật</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.student_name}</TableCell>
                <TableCell>{item.new_job || "-"}</TableCell>
                <TableCell>{item.new_salary || "-"}</TableCell>
                <TableCell>{item.year_graduated || "-"}</TableCell>
                <TableCell>
                  {item.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
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
        {testimonials.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có câu chuyện nào
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTestimonialsTab;
