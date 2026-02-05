import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Eye, Sparkles, TrendingUp, Users, Target, Download } from "lucide-react";

type Conversation = {
  id: string;
  session_id: string;
  student_name: string | null;
  student_email: string | null;
  classification: string | null;
  recommended_courses: string[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  created_at: string;
  message_count?: number;
};

type ChatMessage = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

const CLASSIFICATION_LABELS: Record<string, { label: string; color: string }> = {
  HIGH_POTENTIAL: { label: "Tiềm năng cao", color: "bg-green-500" },
  POTENTIAL: { label: "Tiềm năng", color: "bg-blue-500" },
  NEEDS_SUPPORT: { label: "Cần hỗ trợ", color: "bg-yellow-500" },
  SPONSOR: { label: "Nhà tài trợ", color: "bg-purple-500" },
};

const AdminConversationsTab = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  const exportToCSV = () => {
    const headers = ['Thời gian', 'Tên', 'Email', 'Phân loại', 'Khóa học đề xuất', 'Số tin nhắn'];
    const rows = conversations.map(c => [
      new Date(c.created_at).toLocaleString('vi-VN'),
      c.student_name || '',
      c.student_email || '',
      CLASSIFICATION_LABELS[c.classification || '']?.label || '',
      c.recommended_courses?.join('; ') || '',
      c.message_count || 0
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: "Xuất file thành công", description: `Đã xuất ${conversations.length} cuộc trò chuyện ra file CSV` });
  };

  const fetchConversations = async () => {
    try {
      // Fetch conversations
      const { data: convData, error: convError } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (convError) throw convError;

      // Get message counts
      const conversationsWithCounts = await Promise.all(
        (convData || []).map(async (conv) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          return {
            ...conv,
            message_count: count || 0,
          };
        })
      );

      setConversations(conversationsWithCounts);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách cuộc trò chuyện.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    setLoadingMessages(true);

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải tin nhắn.",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  // Calculate stats
  const stats = {
    total: conversations.length,
    highPotential: conversations.filter(c => c.classification === 'HIGH_POTENTIAL').length,
    potential: conversations.filter(c => c.classification === 'POTENTIAL').length,
    sponsors: conversations.filter(c => c.classification === 'SPONSOR').length,
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng cuộc trò chuyện</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiềm năng cao</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highPotential}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiềm năng</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.potential}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhà tài trợ</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.sponsors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Lịch sử trò chuyện AI
              </CardTitle>
              <CardDescription>
                Xem và phân tích các cuộc trò chuyện với chatbot
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Xuất CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead>Khóa học đề xuất</TableHead>
                <TableHead>Tin nhắn</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.map((conv) => (
                <TableRow key={conv.id}>
                  <TableCell className="text-sm">
                    {new Date(conv.created_at).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {conv.student_name || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {conv.student_email || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {conv.classification ? (
                      <Badge className={CLASSIFICATION_LABELS[conv.classification]?.color}>
                        {CLASSIFICATION_LABELS[conv.classification]?.label}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Chưa phân loại</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {conv.recommended_courses?.slice(0, 2).map((course, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {course}
                        </Badge>
                      )) || <span className="text-muted-foreground">-</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{conv.message_count}</Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => viewConversation(conv)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Chi tiết cuộc trò chuyện</DialogTitle>
                        </DialogHeader>
                        {selectedConversation && (
                          <div className="space-y-4">
                            {/* Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Tên:</span>{' '}
                                {selectedConversation.student_name || 'Chưa có'}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Email:</span>{' '}
                                {selectedConversation.student_email || 'Chưa có'}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Phân loại:</span>{' '}
                                {selectedConversation.classification ? (
                                  <Badge className={CLASSIFICATION_LABELS[selectedConversation.classification]?.color}>
                                    {CLASSIFICATION_LABELS[selectedConversation.classification]?.label}
                                  </Badge>
                                ) : 'Chưa phân loại'}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Thời gian:</span>{' '}
                                {new Date(selectedConversation.created_at).toLocaleString('vi-VN')}
                              </div>
                            </div>

                            {/* Courses */}
                            {selectedConversation.recommended_courses?.length > 0 && (
                              <div>
                                <span className="text-sm text-muted-foreground">Khóa học đề xuất:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {selectedConversation.recommended_courses.map((course, idx) => (
                                    <Badge key={idx} variant="secondary">{course}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Messages */}
                            <ScrollArea className="h-[400px] border rounded-lg p-4">
                              {loadingMessages ? (
                                <div className="text-center py-4">Đang tải...</div>
                              ) : (
                                <div className="space-y-4">
                                  {messages.map((msg) => (
                                    <div
                                      key={msg.id}
                                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                      <div
                                        className={`max-w-[80%] rounded-lg p-3 ${
                                          msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                        }`}
                                      >
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                          {new Date(msg.created_at).toLocaleTimeString('vi-VN')}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </ScrollArea>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {conversations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có cuộc trò chuyện nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConversationsTab;
