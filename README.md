# ⚡ Themis Online Judge

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-mrkhang--khoi.github.io-6366f1?style=for-the-badge)](https://mrkhang-khoi.github.io/python/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?style=for-the-badge&logo=github)](https://mrkhang-khoi.github.io/python/)
[![License](https://img.shields.io/badge/License-Free-10b981?style=for-the-badge)](https://github.com/MrKhang-Khoi/python)

**Nền tảng chấm bài lập trình Python trực tuyến miễn phí**, chuẩn Themis, dành cho giáo viên và học sinh Việt Nam. Chấm bài tự động ngay trên trình duyệt bằng Pyodide (WebAssembly) — không cần cài đặt phần mềm.

🔗 **Demo:** [mrkhang-khoi.github.io/python](https://mrkhang-khoi.github.io/python/)

---

## ✨ Tính Năng Chính

### 🧑‍🏫 Dành Cho Giáo Viên
| Tính năng | Mô tả |
|-----------|-------|
| 📝 **Soạn đề** | Editor trực quan, cấu hình subtask, ví dụ I/O |
| 🤖 **AI Gemini** | Tự động sinh code đáp án (brute force + optimal) |
| 🧪 **Stress Test** | So sánh code chính vs brute, phát hiện sai tự động |
| 📊 **Dashboard** | Biểu đồ Chart.js, thống kê theo chủ đề, export Excel |
| 🏆 **Phòng thi** | Tạo kỳ thi real-time, giám sát, BXH tự động |
| 📝 **Trắc nghiệm** | Tạo bộ đề, import Excel, AI sinh câu hỏi |
| 👥 **Quản lý HS** | Tạo hàng loạt, thông báo, thống kê tiến độ |
| 💡 **Tips** | Tips lập trình tự động chạy trên ticker bar |

### 🧑‍🎓 Dành Cho Học Sinh
| Tính năng | Mô tả |
|-----------|-------|
| 📚 **Luyện tập** | Giao diện HackerRank-style, code editor, chạy thử |
| 🏠 **Dashboard** | Tổng quan tiến độ, biểu đồ, gợi ý bài tiếp theo |
| 🏆 **Huy hiệu** | 🌱Tập Sự → 🥉Đồng → 🥈Bạc → 🥇Vàng → 💎Kim Cương → 🏆Huyền Thoại |
| 🤖 **AI Trợ lý** | Chatbot hỗ trợ cú pháp Python (không giải bài) |
| 📝 **Trắc nghiệm** | Làm bài, timer, navigation panel, xem kết quả |
| 🏅 **Bảng xếp hạng** | Ranking theo bài hoàn thành & tổng điểm |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML/CSS/JavaScript (SPA) |
| **Database** | Firebase Realtime Database |
| **Code Runner** | Pyodide (Python via WebAssembly) |
| **AI** | Google Gemini 2.5 Flash |
| **Editor** | CodeMirror 5 |
| **Charts** | Chart.js 4 |
| **Auth** | Google Apps Script + SHA-256 |
| **Hosting** | GitHub Pages |

---

## 🚀 Quick Start

1. Truy cập **[mrkhang-khoi.github.io/python](https://mrkhang-khoi.github.io/python/)**
2. Chọn vai trò: **Giáo viên** hoặc **Học sinh**
3. Giáo viên: nhập mật khẩu quản trị → soạn đề, tạo tài khoản HS
4. Học sinh: đăng nhập bằng tài khoản GV cấp → bắt đầu luyện tập!

---

## 📂 Structure

```
├── index.html      # Single-page app (all views)
├── script.js       # All application logic
├── style.css       # All styling
├── code.gs         # Server-side auth (Apps Script)
├── robots.txt      # SEO crawler rules
├── sitemap.xml     # XML sitemap
├── llms.txt        # AI search engine guidance
└── og-image.png    # Social share preview
```

---

## 🔑 Keywords

`online judge` `chấm bài lập trình` `Python` `HSG` `học sinh giỏi` `tin học` `Themis` `Pyodide` `competitive programming` `giáo dục` `Việt Nam` `miễn phí` `AI` `Gemini`

---

## 📜 License

Free to use for educational purposes. Made with ❤️ for Vietnamese students and teachers.
