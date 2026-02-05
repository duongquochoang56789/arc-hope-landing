
# Kế hoạch Hoàn thiện Dự án ARC HOPE

## Tổng quan Dự án Hiện tại

Dự án ARC HOPE đã có những thành phần cốt lõi:
- Landing page hoàn chỉnh với form đăng ký
- Admin Dashboard 8 tabs (Học viên, Tiến độ, AI Chat, Blog, Testimonials, Sponsors, Statistics, Settings)
- AI Chatbot thông minh với phân loại học viên
- Hệ thống Blog và Testimonials
- Database đầy đủ (9 tables)

---

## Các Tính năng Cần Hoàn thiện

### Nhóm 1: UI/UX Enhancement (4-6 credits)

| Tính năng | Vị trí | Mô tả |
|-----------|--------|-------|
| Section Nhà tài trợ | Trang chủ (sau Testimonials) | Hiển thị logo sponsors theo tiers (Gold, Silver, Bronze) |
| Multi-language Support | Header + toàn trang | Toggle EN/VI |
| Dark Mode | Header + Settings | Theme switcher |
| Mobile Navigation | Header | Hamburger menu responsive |

### Nhóm 2: Admin Enhancements (5-8 credits)

| Tính năng | Tab | Mô tả |
|-----------|-----|-------|
| Export CSV/Excel | Students, Conversations | Download danh sách dưới dạng file |
| Bulk Actions | Students | Duyệt/từ chối nhiều học viên cùng lúc |
| Dashboard Analytics | Trang Admin chính | Biểu đồ realtime với trends |
| Image Upload for Blog | Blog Tab | Upload ảnh đại diện bài viết |

### Nhóm 3: User Experience (6-10 credits)

| Tính năng | Vị trí | Mô tả |
|-----------|--------|-------|
| Student Portal | Route /portal | Học viên xem tiến độ cá nhân |
| FAQ Section | Trang chủ (trước Footer) | Accordion với câu hỏi thường gặp |
| Volunteer Registration | Trang chủ hoặc route riêng | Form đăng ký tình nguyện viên |
| Contact Form | Trang chủ (Footer mở rộng) | Form liên hệ chung |

### Nhóm 4: Marketing & Engagement (4-6 credits)

| Tính năng | Vị trí | Mô tả |
|-----------|--------|-------|
| Newsletter Signup | Footer + Popup | Thu thập email subscribers |
| Social Sharing | Blog posts | Chia sẻ Facebook, Zalo |
| Progress Badges | Chatbot + Portal | Gamification cho học viên |
| Impact Counter | Trang chủ | Số học viên, giáo viên, sponsors (animated) |

### Nhóm 5: Advanced Features (8-12 credits)

| Tính năng | Vị trí | Mô tả |
|-----------|--------|-------|
| Resend Email Integration | Edge function | Gửi email thật thay vì chỉ log |
| Calendar/Scheduling | Admin + Portal | Lịch học và sự kiện |
| Document Upload | Form đăng ký | Học viên upload giấy tờ xác minh |
| SMS Notifications | Edge function | Thông báo qua Zalo/SMS |

---

## Ưu tiên Đề xuất (Theo Thứ tự)

### Phase 1: Hoàn thiện Trang chủ (3-5 credits, 1-2 conversations)
1. **Section Sponsors trên trang chủ** - Hiển thị logo nhà tài trợ
2. **FAQ Section** - Accordion với 8-10 câu hỏi phổ biến  
3. **Impact Counter** - Số liệu tác động xã hội (animated counters)

### Phase 2: Nâng cao Admin (4-6 credits, 1-2 conversations)
1. **Export danh sách** - CSV/Excel cho students và conversations
2. **Bulk Actions** - Thao tác hàng loạt
3. **Image Upload** - Quản lý ảnh trong Blog và Testimonials

### Phase 3: Trải nghiệm Người dùng (6-8 credits, 2-3 conversations)
1. **Student Portal** - Dashboard cá nhân cho học viên
2. **Volunteer Form** - Thu hút tình nguyện viên
3. **Newsletter** - Xây dựng cộng đồng email

### Phase 4: Tích hợp Nâng cao (6-10 credits, 2-3 conversations)
1. **Resend Email** - Kích hoạt gửi email thật
2. **Document Upload** - Xác minh hồ sơ học viên
3. **Multi-language** - Hỗ trợ tiếng Anh

---

## Tổng kết Ước tính

| Nhóm | Credits | Conversations |
|------|---------|---------------|
| Phase 1: Trang chủ | 3-5 | 1-2 |
| Phase 2: Admin | 4-6 | 1-2 |
| Phase 3: User Experience | 6-8 | 2-3 |
| Phase 4: Tích hợp | 6-10 | 2-3 |
| **Tổng cộng** | **19-29** | **6-10** |

---

## Chi tiết Kỹ thuật

### Database Changes Needed
```text
+------------------------+----------------------------------+
| Table                  | Purpose                          |
+------------------------+----------------------------------+
| volunteers             | Lưu đăng ký tình nguyện viên     |
| newsletter_subscribers | Email subscribers                |
| site_settings          | Cấu hình động (thay localStorage)|
| documents              | File uploads từ học viên         |
+------------------------+----------------------------------+
```

### Files sẽ được tạo/chỉnh sửa

```text
src/
├── components/
│   ├── SponsorsSection.tsx      [MỚI]
│   ├── FAQSection.tsx           [MỚI]
│   ├── ImpactCounter.tsx        [MỚI]
│   ├── NewsletterSignup.tsx     [MỚI]
│   └── admin/
│       └── (các file hiện có)   [CẬP NHẬT]
├── pages/
│   ├── Index.tsx                [CẬP NHẬT]
│   ├── Portal.tsx               [MỚI]
│   └── Volunteer.tsx            [MỚI]
└── App.tsx                      [CẬP NHẬT routes]

supabase/
├── functions/
│   └── send-notification/       [CẬP NHẬT với Resend]
└── migrations/
    └── [new migrations]         [MỚI]
```

---

## Khuyến nghị Bắt đầu

Tôi đề xuất bắt đầu với **Phase 1** vì đây là các tính năng trực quan nhất, giúp trang chủ trở nên hoàn thiện và chuyên nghiệp hơn ngay lập tức. Sau khi hoàn thành Phase 1, website sẽ sẵn sàng để publish và thu hút người dùng thực tế.
