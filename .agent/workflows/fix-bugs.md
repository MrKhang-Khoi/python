---
description: Quy trình fix bug và test Themis Online Judge - chạy ESLint + Custom Scanner + Playwright E2E
---

# Quy Trình Fix Bug & Test Themis

## QUAN TRỌNG: Phải chạy ĐỦ 3 bước, KHÔNG ĐƯỢC bỏ bước nào

---

## Bước 1: Static Analysis (tìm bug bề mặt)

### 1.1 Syntax check

<!-- turbo -->

```bash
node --check "c:\Users\HPZBook\Desktop\TEST PYTHON\script.js"
```

### 1.2 ESLint (cài nếu chưa có)

```bash
npm install --save-dev eslint @eslint/js 2>&1 | Select-Object -Last 3
```

Tạo `eslint.config.mjs` với globals: firebase, CodeMirror, JSZip, marked, hljs, DOMPurify, html2canvas, Sortable, loadPyodide, requestAnimationFrame + tất cả browser globals.

Rules BẮT BUG: no-undef, no-redeclare, no-dupe-keys, no-unreachable, use-isnan, valid-typeof.

<!-- turbo -->

```bash
npx eslint script.js 2>&1 | Out-File -FilePath eslint_output.txt -Encoding utf8
```

### 1.3 Custom Scanner

Tạo `_audit.js` kiểm tra:

1. addEventListener vs removeEventListener balance
2. setInterval vs clearInterval balance
3. Firebase .on('value') vs .off('value') balance
4. Generic ref.off() (PHẢI dùng ref.off('value', cb))
5. JSON.parse không có try/catch
6. innerHTML với template literal chưa _esc()
7. Firebase write không có await hoặc .catch()
8. .val().property không null check

**QUAN TRỌNG**: Dùng `Object.create(null)` cho dictionaries để tránh prototype collision.

<!-- turbo -->

```bash
node _audit.js 2>&1 | Out-File -FilePath audit_output.txt -Encoding utf8
```

---

## Bước 2: Fix bugs

Fix từng bug theo Priority:

1. 🔴 ERRORS trước (crash thật)
2. 🟡 WARNINGS sau (potential issues)
3. Bỏ qua false positives (ghi rõ lý do)

Sau mỗi fix:

<!-- turbo -->

```bash
node --check script.js
```

---

## Bước 3: E2E Testing (tìm bug logic — QUAN TRỌNG NHẤT)

### 3.1 Start server (nếu chưa chạy)

```bash
py -m http.server 8000 --directory "c:\Users\HPZBook\Desktop\TEST PYTHON"
```

### 3.2 Chạy Playwright tests

File test đã có sẵn: `_e2e_test.spec.mjs`
Config đã có sẵn: `playwright.config.mjs`
Credentials: HS = Admin/1234567, GV = admin@2025

<!-- turbo -->

```bash
npx playwright test _e2e_test.spec.mjs --reporter=list 2>&1 | Out-File -FilePath _e2e_results.txt -Encoding utf8
```

### 3.3 Đọc kết quả

<!-- turbo -->

```bash
Get-Content _e2e_results.txt
```

### 3.4 Nếu có test FAIL → fix bug → chạy lại từ 3.2

### 3.5 Nếu fix bug mới → THÊM TEST cho bug đó vào `_e2e_test.spec.mjs`

---

## Bước 4: Dọn dẹp + Commit

### 4.1 Xóa temp files

```bash
cmd /c "del eslint_output.txt audit_output.txt _e2e_results.txt _audit.js eslint.config.mjs .jshintrc 2>nul"
cmd /c "rmdir /s /q test-results 2>nul"
```

### 4.2 Commit và push

```bash
git add -A
git commit -m "fix: [mô tả ngắn bug đã fix]"
git push origin main
```

---

## Nguyên tắc vàng

1. **KHÔNG BAO GIỜ** chỉ đọc code rồi đoán bug — PHẢI chạy tool
2. **KHÔNG BAO GIỜ** báo "OK hết bug" mà không chạy Playwright test
3. **MỖI BUG FIX** → thêm 1 test case vào `_e2e_test.spec.mjs`
4. **Trước khi commit** → tất cả Playwright tests phải PASS
5. **ESLint + Custom Scanner chỉ tìm 20% bug** — Playwright tìm 80% còn lại
6. **Logic bugs** (race condition, state mismatch) → CHỈ CÓ E2E test mới bắt được
