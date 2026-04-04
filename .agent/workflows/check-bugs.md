---
description: Kiểm tra bug code JavaScript bằng công cụ tự động chuẩn công nghiệp (ESLint + JSHint + Custom Scanner)
---

# Quy trình kiểm tra bug tự động

**QUAN TRỌNG**: Khi user yêu cầu kiểm tra bug, tìm lỗi, audit code, hoặc review code — BẮT BUỘC phải chạy các công cụ tự động bên dưới. KHÔNG ĐƯỢC chỉ đọc code bằng mắt rồi đoán.

## Bước 1: Kiểm tra syntax cơ bản
// turbo
```
node --check script.js
```
Nếu có lỗi syntax → fix ngay trước khi chạy các bước tiếp.

## Bước 2: Cài đặt công cụ (nếu chưa có)
```
npm install --save-dev eslint @eslint/js jshint 2>&1 | Select-Object -Last 3
```

## Bước 3: Tạo ESLint config chuyên bắt bug

Tạo file `eslint.config.mjs` với các rules **chỉ tập trung vào bug detection**, KHÔNG phải code style:
- `no-undef`, `no-redeclare`, `no-dupe-keys`, `no-dupe-class-members`
- `no-unreachable`, `use-isnan`, `valid-typeof`, `eqeqeq`
- `no-self-assign`, `no-self-compare`, `no-unused-vars`
- `no-cond-assign`, `no-constant-condition`
- `no-eval`, `no-implied-eval`, `no-prototype-builtins`

Cấu hình globals phù hợp với project (browser, Firebase, CodeMirror, etc.)

## Bước 4: Chạy ESLint
// turbo
```
npx eslint script.js 2>&1 | Out-File -FilePath eslint_output.txt -Encoding utf8
```
Đọc kết quả và phân loại:
- **Real bugs**: Cần fix ngay
- **False positives**: Giải thích tại sao là false positive
- **Warnings**: Đánh giá có cần fix không

## Bước 5: Chạy JSHint
// turbo
```
npx jshint script.js 2>&1 | Out-File -FilePath jshint_output.txt -Encoding utf8
```
Lọc bỏ "Missing semicolon" (style). Tập trung vào:
- `'X' is defined but never used` → dead code
- `Functions declared within loops` → logic risk
- `'X' is not defined` → undefined variable
- `Class properties must be methods` → ES version issue

## Bước 6: Chạy Custom Scanner

Tạo file `_audit.js` với các phân tích chuyên sâu mà ESLint/JSHint KHÔNG thể phát hiện:

### 6.1 Event Listener Leak Detection
Đếm `addEventListener` vs `removeEventListener` cho mỗi event type.

### 6.2 setInterval/setTimeout Leak Detection  
Đếm `setInterval` vs `clearInterval`.

### 6.3 Firebase Listener Imbalance
Đếm `.on('value')` vs `.off()`, phân biệt Firebase vs CodeMirror.

### 6.4 Duplicate Method Detection
Tìm methods được define 2+ lần trong cùng class.

### 6.5 XSS Pattern Detection
Tìm `onclick` với template literals chứa biến user-controlled.

### 6.6 Null Dereference Risk
Tìm `.val().property` mà không có null guard.

### 6.7 Unused Variable Detection
Cross-reference với ESLint results.

### 6.8 Global Variable Leak
Tìm `window.X = ...` ngoài ý muốn.

Chạy scanner:
// turbo
```
node _audit.js 2>&1 | Out-File -FilePath audit_output.txt -Encoding utf8
```

## Bước 7: Tổng hợp và phân loại

Tạo báo cáo dạng bảng:

| Mức | Mô tả | Dòng | Công cụ phát hiện |
|-----|-------|------|-------------------|
| 🔴 Critical | ... | ... | ESLint/Custom |
| 🟡 Medium | ... | ... | JSHint/Custom |
| 🟢 Info | ... | ... | ... |

Với mỗi finding, GHI RÕ:
- Đây là **bug thực** hay **false positive**?
- Nếu false positive, **giải thích tại sao**
- Nếu bug thực, **đề xuất fix cụ thể**

## Bước 8: Fix bugs

Fix từng bug theo thứ tự ưu tiên (Critical → Medium → Low).
Sau mỗi fix, chạy lại `node --check` để đảm bảo không gãy syntax.

## Bước 9: Verify

Chạy lại toàn bộ pipeline (ESLint + Custom Scanner) để xác nhận:
// turbo
```
node --check script.js 2>&1; npx eslint script.js 2>&1 | Out-File -FilePath eslint_final.txt -Encoding utf8; node _audit.js 2>&1 | Out-File -FilePath audit_final.txt -Encoding utf8
```

## Bước 10: Dọn dẹp

Xóa các file tạm sinh ra trong quá trình audit:
```
cmd /c "del eslint_output.txt eslint_final.txt jshint_output.txt audit_output.txt audit_final.txt _audit.js eslint.config.mjs .jshintrc 2>nul"
```

## Bước 11: Commit và Push
```
git add -A
git commit -m "audit: fix N bugs found by ESLint+JSHint+Custom Scanner"
git push origin main
```
