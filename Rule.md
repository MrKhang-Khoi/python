Hãy đóng vai một Chuyên gia Lập trình Web Frontend và Chuyên gia Ra đề thi Tin học Olympic. Nhiệm vụ của bạn là viết một ứng dụng Single Page Application (SPA) bằng HTML, CSS, JS để tự động sinh bộ test case định dạng Themis cho các bài tập Python.



YÊU CẦU KIẾN TRÚC KỸ THUẬT:

1\. File structure: Gồm đúng 3 file `index.html`, `style.css`, `script.js`.

2\. Kiến trúc 100% Client-side:

&#x20;  - Sử dụng thư viện `Pyodide` (qua CDN: https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js) để thông dịch và chạy code Python trực tiếp trên trình duyệt. Không sử dụng backend.

&#x20;  - Sử dụng `JSZip` và `FileSaver.js` (qua CDN) để nén các file `.inp` và `.out` thành 1 thư mục tải về máy.

3\. Code Javascript phải viết theo chuẩn OOP/Class (VD: `DataGenerator`, `PyodideEngine`, `ThemisManager`) và có BÌNH LUẬN TIẾNG VIỆT siêu chi tiết ở từng hàm để tôi dễ dàng mở rộng.



YÊU CẦU GIAO DIỆN \& LOGIC NGHIỆP VỤ:

1\. Giao diện (UI):

&#x20;  - Form 1: Khu vực dán "Code Python Đáp Án" (Solution).

&#x20;  - Form 2: Cấu hình Sinh Test Case. Giao diện phải cho phép người dùng chọn Tỷ lệ % cho từng nhóm Test (Ví dụ: Tổng 20 tests. 40% Test Cơ bản, 30% Test Biên, 30% Test Hù Dọa/Stress Test).

&#x20;  - Form 3: Cấu hình kiểu dữ liệu. Cho phép người dùng thêm các biến đầu vào (VD: Biến N kiểu Số Nguyên, Mảng A kiểu Array). Cho phép điền giới hạn Min, Max cho từng nhóm test.

&#x20;  - Nút "Bắt đầu sinh Test". Có Loading Spinner báo tiến trình (vì Pyodide load sẽ mất vài giây).



2\. Logic Sinh Dữ Liệu (DataGenerator):

&#x20;  - Phải cài đặt các hàm sinh test thông minh.

&#x20;  - Với Mảng/Dãy số, phải có tùy chọn sinh: Dãy ngẫu nhiên, Dãy toàn số bằng nhau, Dãy tăng dần, Dãy giảm dần.

&#x20;  - Với Số nguyên, tự động chèn các test case tại biên (bằng Min, bằng Max).



3\. Quá trình thực thi (Pipeline):

&#x20;  - Bước 1: Khởi tạo môi trường Pyodide.

&#x20;  - Bước 2: Chạy vòng lặp sinh Input data theo cấu hình.

&#x20;  - Bước 3: Đẩy Input data vào hàm Python qua `pyodide.runPython()` (Lưu ý: Bắt lại sys.stdout để lấy kết quả in ra làm Output).

&#x20;  - Bước 4: Định dạng file thành Test01/bai1.inp, Test01/bai1.out,... TestN/bai1.out.

&#x20;  - Bước 5: Nén thành file `Themis\_Tests.zip` và trigger tải xuống.



Hãy viết mã nguồn chất lượng cao, clean code, và bám sát tuyệt đối các yêu cầu kỹ thuật trên.

