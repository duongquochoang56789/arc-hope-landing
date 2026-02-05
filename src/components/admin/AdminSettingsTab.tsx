import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bell, Shield, Palette } from "lucide-react";

const AdminSettingsTab = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "ARC HOPE",
    contactEmail: "info@archope.org",
    phoneNumber: "0123 456 789",
    enableNotifications: true,
    enableAutoApprove: false,
    maintenanceMode: false,
  });

  const handleSave = () => {
    // In a real app, this would save to database or edge function
    localStorage.setItem('archope_settings', JSON.stringify(settings));
    toast({
      title: "Đã lưu cài đặt",
      description: "Các thay đổi đã được áp dụng.",
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Cài đặt chung
          </CardTitle>
          <CardDescription>Thông tin cơ bản của tổ chức</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Tên tổ chức</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email liên hệ</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Thông báo
          </CardTitle>
          <CardDescription>Cấu hình thông báo hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableNotifications">Bật thông báo email</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo qua email khi có học viên đăng ký mới
              </p>
            </div>
            <Switch
              id="enableNotifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableAutoApprove">Tự động duyệt đăng ký</Label>
              <p className="text-sm text-muted-foreground">
                Tự động chấp nhận các đăng ký mới (không khuyến nghị)
              </p>
            </div>
            <Switch
              id="enableAutoApprove"
              checked={settings.enableAutoApprove}
              onCheckedChange={(checked) => setSettings({ ...settings, enableAutoApprove: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Bảo mật & Bảo trì
          </CardTitle>
          <CardDescription>Cài đặt bảo mật và chế độ bảo trì</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">Chế độ bảo trì</Label>
              <p className="text-sm text-muted-foreground">
                Tạm đóng website để bảo trì. Chỉ admin có thể truy cập.
              </p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Giao diện
          </CardTitle>
          <CardDescription>Thông tin về theme hiện tại</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary text-primary-foreground text-center">
              <p className="text-sm">Primary</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary text-secondary-foreground text-center">
              <p className="text-sm">Secondary</p>
            </div>
            <div className="p-4 rounded-lg bg-accent text-accent-foreground text-center">
              <p className="text-sm">Accent</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-muted-foreground text-center">
              <p className="text-sm">Muted</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Theme được thiết kế theo chủ đề tổ chức phi lợi nhuận với tông màu xanh lá ấm áp.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Lưu tất cả cài đặt
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsTab;
