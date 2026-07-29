# Kết nối form RSVP với Google Sheets

Website đã có giao diện form hoàn chỉnh. Bạn chỉ cần tạo một Google Sheets và triển khai đoạn Apps Script có sẵn.

## 1. Tạo Google Sheets

1. Vào Google Sheets và tạo một bảng tính mới.
2. Đặt tên, ví dụ: `Khách tham dự tốt nghiệp`.
3. Trong bảng tính, chọn **Tiện ích mở rộng → Apps Script**.

## 2. Dán Apps Script

1. Xóa nội dung mặc định trong file `Code.gs`.
2. Mở file `google-apps-script/Code.gs` trong project này.
3. Sao chép toàn bộ nội dung và dán vào Apps Script.
4. Nhấn **Lưu**.

## 3. Triển khai Web App

1. Nhấn **Triển khai → Lần triển khai mới**.
2. Loại triển khai: **Ứng dụng web**.
3. Thực thi với tư cách: **Tôi**.
4. Ai có quyền truy cập: **Bất kỳ ai**.
5. Nhấn **Triển khai** và cho phép quyền truy cập.
6. Sao chép URL kết thúc bằng `/exec`.

## 4. Dán URL vào website

Mở file:

`assets/js/app.js`

Tìm dòng:

```js
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

Thay bằng URL `/exec` vừa sao chép, ví dụ:

```js
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ABC123.../exec';
```

Sau đó upload lại file `assets/js/app.js` lên GitHub và commit.

## 5. Kiểm tra

1. Mở website GitHub Pages.
2. Gửi thử một xác nhận.
3. Mở Google Sheets.
4. Một trang tên `RSVP` sẽ tự tạo, chứa thời gian, họ tên, lựa chọn tham dự và lời nhắn.

> Lưu ý: Mỗi khi chỉnh mã Apps Script, hãy vào **Triển khai → Quản lý các lần triển khai → Chỉnh sửa → Phiên bản mới → Triển khai**.
