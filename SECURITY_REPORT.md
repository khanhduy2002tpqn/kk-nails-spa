# Báo Cáo Kiểm Tra Bảo Mật

Ngày kiểm tra: 2026-05-30  
Dự án: K&K Nails and Spa

## Tóm Tắt

Đã kiểm tra nhanh toàn bộ project theo hướng pentest cơ bản: API public/private, phân quyền admin/technician, xử lý booking, secret/token, email template, cấu hình Next.js và dependency audit.

Kết quả chính: hệ thống có một số lỗi nghiêm trọng liên quan đến việc API booking đang public dữ liệu khách hàng và cho phép xem/sửa/hủy lịch chỉ bằng confirmation ID. Ngoài ra admin auth hiện còn fallback secret mặc định, token không hết hạn, chưa có rate limit, và email HTML chưa escape dữ liệu động.

## Critical

### 1. API public làm lộ toàn bộ booking và thông tin khách hàng

Vị trí:
- `src/app/api/bookings/route.ts:8`
- `src/app/api/bookings/route.ts:11`

Mô tả:
Endpoint `GET /api/bookings` trả về toàn bộ danh sách booking mà không yêu cầu đăng nhập. Dữ liệu gồm tên khách, số điện thoại, email, dịch vụ, ngày giờ hẹn.

Tác động:
Người ngoài có thể lấy toàn bộ dữ liệu khách hàng nếu biết endpoint.

Khuyến nghị:
- Xóa hoặc khóa `GET /api/bookings`.
- Chỉ cho staff lấy booking qua `/api/admin/bookings` với staff token hợp lệ.

### 2. Ai có confirmation ID cũng có thể xem/sửa/hủy lịch

Vị trí:
- `src/app/api/bookings/[id]/route.ts:7`
- `src/app/api/bookings/[id]/route.ts:17`
- `src/app/api/bookings/[id]/route.ts:72`

Mô tả:
Các API `GET`, `PATCH`, `DELETE` cho booking chỉ cần confirmation ID. Nếu ID bị lộ trong email, lịch hẹn có thể bị xem, đổi giờ hoặc hủy.

Tác động:
Kẻ khác có thể phá lịch hẹn của khách hoặc xem thông tin cá nhân.

Khuyến nghị:
- Khi manage booking, yêu cầu thêm email hoặc số điện thoại khách.
- Hoặc tạo signed manage token có thời hạn trong email thay vì dùng ID trực tiếp.
- API hủy/sửa lịch nên xác minh ít nhất 2 yếu tố: confirmation ID + email/phone.

### 3. Có secret/password mặc định nguy hiểm trong production

Vị trí:
- `src/lib/staff-auth.ts:11`
- `src/lib/store.ts:111`
- `src/app/api/admin/blocked/route.ts:7`
- `src/app/api/admin/accounts/route.ts:7`
- `src/app/api/admin/technicians/route.ts:7`

Mô tả:
Nếu thiếu env, app fallback về secret/password mặc định như `kk-admin-2026`.

Tác động:
Nếu deploy thiếu env, người ngoài có thể đăng nhập admin bằng thông tin mặc định.

Khuyến nghị:
- Trong production, nếu thiếu `ADMIN_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` thì app phải throw error.
- Không dùng fallback default credential ở môi trường production.

## High

### 4. API login trả `ADMIN_SECRET` về browser

Vị trí:
- `src/app/api/admin/login/route.ts:24`

Mô tả:
Khi admin login thành công, server trả `ADMIN_SECRET` về client dưới field `key`. Dashboard dùng key này để gọi các API admin.

Tác động:
Nếu trình duyệt bị XSS, extension độc hại, hoặc log client bị lộ, attacker có full quyền admin API.

Khuyến nghị:
- Không trả `ADMIN_SECRET` về browser.
- Dùng staff token cho tất cả admin API.
- Server kiểm tra role từ token, không dùng header `x-admin-key` từ client.

### 5. Staff token không có thời hạn hết hạn

Vị trí:
- `src/lib/staff-auth.ts:22`
- `src/lib/staff-auth.ts:32`

Mô tả:
Token chỉ ký HMAC payload, không có `exp`, không có kiểm tra account còn active trong DB khi gọi API.

Tác động:
Token bị lộ có thể dùng mãi cho đến khi đổi `ADMIN_SECRET`.

Khuyến nghị:
- Thêm `iat` và `exp`, ví dụ hết hạn sau 8-24 giờ.
- Khi verify token, kiểm tra account còn active trong database.
- Có logout/revoke token nếu cần.

### 6. Không có rate limit cho login

Vị trí:
- `src/app/api/admin/login/route.ts:6`

Mô tả:
Endpoint login không giới hạn số lần thử.

Tác động:
Có thể brute force username/password.

Khuyến nghị:
- Rate limit theo IP + username.
- Lock tạm thời sau nhiều lần sai.
- Ghi log các lần login thất bại.

### 7. Booking public POST có thể bị spam

Vị trí:
- `src/app/api/bookings/route.ts:14`

Mô tả:
Ai cũng có thể gọi API tạo booking và gửi email xác nhận, không có rate limit hoặc CAPTCHA.

Tác động:
Có thể spam booking, spam email, làm đầy lịch giả.

Khuyến nghị:
- Rate limit tạo booking theo IP/email/phone.
- Cân nhắc CAPTCHA hoặc verification email/phone.

## Medium

### 8. Email HTML chưa escape dữ liệu động

Vị trí:
- `src/lib/email.ts:42`
- `src/lib/email.ts:47`
- `src/lib/email.ts:51`
- `src/lib/email.ts:55`
- `src/lib/email.ts:59`

Mô tả:
Dữ liệu như tên khách, service name, technician name được đưa thẳng vào HTML email.

Tác động:
Nếu dữ liệu chứa HTML, email có thể hiển thị sai hoặc bị HTML injection trong một số email client.

Khuyến nghị:
- Escape HTML cho tất cả dữ liệu động trước khi đưa vào email HTML.
- Ví dụ escape `&`, `<`, `>`, `"`, `'`.

### 9. Thiếu security headers

Vị trí:
- `next.config.ts`

Mô tả:
Chưa cấu hình các header như CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

Tác động:
Tăng rủi ro XSS, clickjacking, MIME sniffing.

Khuyến nghị:
- Thêm `headers()` trong `next.config.ts`.
- CSP cần cấu hình cẩn thận vì app đang có inline theme script.

### 10. Chính sách mật khẩu yếu

Vị trí:
- `src/lib/validation.ts:34`
- `src/lib/validation.ts:39`
- `src/lib/validation.ts:48`

Mô tả:
Password chỉ yêu cầu tối thiểu 6 ký tự.

Tác động:
Tăng khả năng brute force thành công.

Khuyến nghị:
- Tối thiểu 12 ký tự.
- Khuyến khích password do admin tạo ngẫu nhiên.
- Có flow đổi/reset password.

## Dependency Audit

Lệnh đã chạy:

```bash
npm audit --audit-level=moderate
```

Kết quả:
- Có 2 vulnerability mức `moderate`.
- `postcss <8.5.10` qua dependency của `next`.
- Advisory: XSS via CSS stringify output.

Ghi chú:
`npm audit fix --force` đề xuất thay đổi breaking/downgrade Next, không nên chạy mù.

Khuyến nghị:
- Theo dõi bản Next.js đã vá tương thích.
- Upgrade Next theo release chính thức, sau đó chạy lại build/test.

## Thứ Tự Ưu Tiên Khắc Phục

1. Khóa `GET /api/bookings` và bảo vệ các API `/api/bookings/[id]`.
2. Không dùng default admin secret/password trong production.
3. Không trả `ADMIN_SECRET` về client.
4. Thêm token expiry và verify account active.
5. Thêm rate limit cho login và booking creation.
6. Escape HTML trong email.
7. Thêm security headers.
8. Nâng chính sách mật khẩu.
9. Theo dõi và nâng cấp dependency Next/PostCSS an toàn.

## Kết Luận

Project hiện có nền tảng validation và hashing password tốt hơn trước, nhưng phần authorization của booking và cách xử lý admin secret cần sửa trước khi production. Rủi ro lớn nhất là lộ dữ liệu khách hàng qua API public và khả năng hủy/sửa lịch chỉ bằng confirmation ID.
