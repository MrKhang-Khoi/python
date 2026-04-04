/**
 * ============================================================
 *  THEMIS ONLINE JUDGE — Google Apps Script Backend
 *  Version: 1.0
 * ============================================================
 *  HƯỚNG DẪN SETUP:
 *  1. Vào https://script.google.com → Dự án mới
 *  2. Xóa nội dung mặc định, paste toàn bộ code này vào
 *  3. Nhấn ▶ chạy hàm "setup" (lần đầu) → Cấp quyền
 *  4. Triển khai → Triển khai mới → Web app
 *     - Thực thi: "Tôi" (Me)
 *     - Ai có quyền: "Bất kỳ ai" (Anyone)
 *  5. Copy URL triển khai → Dán vào APPS_SCRIPT_URL trong script.js
 * ============================================================
 */

// ===== CẤU HÌNH =====
const CONFIG = {
  FOLDER_NAME: 'Themis_Online_Judge_Files',  // Tên folder Google Drive
  SHEET_NAME: 'Themis_Database',              // Tên Google Sheet
  // SHA-256 hash của mật khẩu giáo viên (không lưu plaintext)
  // Đổi mật khẩu: chạy hàm setNewTeacherPassword() 
  TEACHER_HASH: 'e7ec9cbf3dc1a42562a5e500d5768001933624ea8d8f3ea0602092c42d4bc857',
};

// ===== SETUP (CHẠY 1 LẦN ĐẦU) =====
function setup() {
  const folder = _getOrCreateFolder();
  const ss = _getOrCreateSpreadsheet();
  
  Logger.log('✅ Setup hoàn tất!');
  Logger.log('📁 Folder Drive: ' + folder.getUrl());
  Logger.log('📊 Google Sheet: ' + ss.getUrl());
  Logger.log('');
  Logger.log('👉 Tiếp theo: Triển khai → Triển khai mới → Web app');
}

// ===== API ENDPOINTS =====

/**
 * GET handler — Tải file, lấy danh sách, hoặc kiểm tra kết nối
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'ping';
    
    switch (action) {
      case 'ping':
        return _jsonResponse({ ok: true, message: 'Themis Backend đang hoạt động!' });
      
      case 'download':
        return _handleDownload(e.parameter.fileId);
      
      case 'list_files':
        return _handleListFiles();
      
      case 'get_sheet_data':
        return _handleGetSheetData(e.parameter.sheet);
      
      default:
        return _jsonResponse({ ok: false, error: 'Action không hợp lệ' });
    }
  } catch (err) {
    return _jsonResponse({ ok: false, error: err.message });
  }
}

/**
 * POST handler — Upload file, xóa file, ghi dữ liệu
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'verify_teacher':
        return _handleTeacherAuth(data.passwordHash);
      
      case 'upload_file':
        return _handleUpload(data);
      
      case 'delete_file':
        return _handleDelete(data.fileId);
      
      case 'log_data':
        return _handleLogData(data.sheet, data.row);
      
      case 'delete_row':
        return _handleDeleteRow(data.sheet, data.key);
      
      case 'clear_sheet':
        return _handleClearSheet(data.sheet);
        
      default:
        return _jsonResponse({ ok: false, error: 'Action không hợp lệ' });
    }
  } catch (err) {
    return _jsonResponse({ ok: false, error: err.message });
  }
}

// ===== TEACHER AUTH =====

/**
 * Xác thực giáo viên bằng SHA-256 hash
 * Client gửi hash của mật khẩu → so sánh với TEACHER_HASH
 */
function _handleTeacherAuth(passwordHash) {
  if (!passwordHash) return _jsonResponse({ ok: false, error: 'Thiếu mật khẩu' });
  
  if (passwordHash === CONFIG.TEACHER_HASH) {
    return _jsonResponse({ ok: true, role: 'teacher' });
  } else {
    return _jsonResponse({ ok: false, error: 'Mật khẩu sai!' });
  }
}

/**
 * Đổi mật khẩu giáo viên — chạy trong Apps Script editor
 * Bước 1: Sửa mật khẩu mới trong hàm setNewTeacherPassword() bên dưới
 * Bước 2: Chọn hàm setNewTeacherPassword → nhấn ▶ Run
 * Bước 3: Copy hash từ log → paste vào CONFIG.TEACHER_HASH
 * Bước 4: Deploy lại Web App (phiên bản mới)
 */
function setNewTeacherPassword() {
  // 👇👇👇 SỬa MẬT KHẨU MỚI TẠI ĐÂY 👇👇👇
  const NEW_PASSWORD = 'admin@2025';
  // 👆👆👆 SỬa MẬT KHẨU MỚI TẠI ĐÂY 👆👆👆
  
  const hash = _sha256(NEW_PASSWORD);
  Logger.log('✅ Hash cho mật khẩu "' + NEW_PASSWORD + '":');
  Logger.log(hash);
  Logger.log('');
  Logger.log('👉 Paste hash này vào CONFIG.TEACHER_HASH');
  Logger.log('👉 Sau đó Deploy lại Web App (phiên bản mới)');
}

function _sha256(text) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text);
  return raw.map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
}

// ===== FILE HANDLERS =====

/**
 * Upload file lên Google Drive
 * @param {Object} data - { action, fileName, mimeType, base64Data, metadata }
 */
function _handleUpload(data) {
  const folder = _getOrCreateFolder();
  
  // Decode Base64 → Blob
  const decoded = Utilities.base64Decode(data.base64Data);
  const blob = Utilities.newBlob(decoded, data.mimeType, data.fileName);
  
  // Lưu vào Drive
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  const fileId = file.getId();
  const fileUrl = file.getUrl();
  const downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;
  const viewUrl = 'https://drive.google.com/file/d/' + fileId + '/preview';
  
  // Log vào sheet "Files"
  const ss = _getOrCreateSpreadsheet();
  const sheet = _getOrCreateSheet(ss, 'Files', ['FileID', 'FileName', 'MimeType', 'Size(KB)', 'UploadDate', 'Source', 'SourceID']);
  sheet.appendRow([
    fileId,
    data.fileName,
    data.mimeType,
    Math.round(decoded.length / 1024),
    new Date().toISOString(),
    data.metadata?.source || 'unknown',
    data.metadata?.sourceId || ''
  ]);
  
  return _jsonResponse({
    ok: true,
    fileId: fileId,
    fileUrl: fileUrl,
    downloadUrl: downloadUrl,
    viewUrl: viewUrl,
    fileName: data.fileName,
    size: decoded.length
  });
}

/**
 * Tải file từ Drive — redirect về URL download
 */
function _handleDownload(fileId) {
  if (!fileId) return _jsonResponse({ ok: false, error: 'Thiếu fileId' });
  
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setContent(JSON.stringify({
        ok: true,
        fileName: file.getName(),
        mimeType: blob.getContentType(),
        base64Data: Utilities.base64Encode(blob.getBytes()),
        size: blob.getBytes().length
      }));
  } catch (err) {
    return _jsonResponse({ ok: false, error: 'File không tồn tại hoặc đã bị xóa' });
  }
}

/**
 * Xóa file khỏi Drive + Sheet log
 */
function _handleDelete(fileId) {
  if (!fileId) return _jsonResponse({ ok: false, error: 'Thiếu fileId' });
  
  try {
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    
    // Xóa khỏi sheet log
    const ss = _getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName('Files');
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      for (let i = data.length - 1; i >= 1; i--) {
        if (data[i][0] === fileId) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
    }
    
    return _jsonResponse({ ok: true, message: 'Đã xóa file' });
  } catch (err) {
    return _jsonResponse({ ok: false, error: 'Lỗi xóa file: ' + err.message });
  }
}

/**
 * Danh sách tất cả file trong folder
 */
function _handleListFiles() {
  const folder = _getOrCreateFolder();
  const files = folder.getFiles();
  const list = [];
  
  while (files.hasNext()) {
    const f = files.next();
    list.push({
      fileId: f.getId(),
      name: f.getName(),
      size: f.getSize(),
      mimeType: f.getMimeType(),
      created: f.getDateCreated().toISOString(),
      url: f.getUrl()
    });
  }
  
  return _jsonResponse({ ok: true, files: list, count: list.length });
}

// ===== SHEET DATA HANDLERS =====

/**
 * Ghi 1 dòng dữ liệu vào sheet chỉ định
 * @param {string} sheetName - Tên sheet (Accounts, Exercises, Theories, Rooms, Submissions)
 * @param {Array} row - Mảng giá trị cho 1 dòng
 */
function _handleLogData(sheetName, row) {
  if (!sheetName || !row) return _jsonResponse({ ok: false, error: 'Thiếu sheet hoặc row' });
  
  const ss = _getOrCreateSpreadsheet();
  const headers = SHEET_SCHEMAS[sheetName];
  if (!headers) return _jsonResponse({ ok: false, error: 'Sheet không hợp lệ: ' + sheetName });
  
  const sheet = _getOrCreateSheet(ss, sheetName, headers);
  
  // Kiểm tra trùng key (cột đầu tiên) → update thay vì thêm mới
  const keyValue = row[0];
  const data = sheet.getDataRange().getValues();
  let updated = false;
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(keyValue)) {
      // Update dòng hiện có
      for (let j = 0; j < row.length; j++) {
        sheet.getRange(i + 1, j + 1).setValue(row[j]);
      }
      updated = true;
      break;
    }
  }
  
  if (!updated) {
    sheet.appendRow(row);
  }
  
  return _jsonResponse({ ok: true, action: updated ? 'updated' : 'created', sheet: sheetName });
}

/**
 * Xóa 1 dòng theo key (cột đầu tiên)
 */
function _handleDeleteRow(sheetName, key) {
  if (!sheetName || !key) return _jsonResponse({ ok: false, error: 'Thiếu thông tin' });
  
  const ss = _getOrCreateSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return _jsonResponse({ ok: false, error: 'Sheet không tồn tại' });
  
  const data = sheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) === String(key)) {
      sheet.deleteRow(i + 1);
      return _jsonResponse({ ok: true, message: 'Đã xóa' });
    }
  }
  
  return _jsonResponse({ ok: false, error: 'Không tìm thấy key: ' + key });
}

/**
 * Lấy toàn bộ dữ liệu từ 1 sheet
 */
function _handleGetSheetData(sheetName) {
  if (!sheetName) return _jsonResponse({ ok: false, error: 'Thiếu tên sheet' });
  
  const ss = _getOrCreateSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return _jsonResponse({ ok: true, data: [], headers: [] });
  
  const all = sheet.getDataRange().getValues();
  if (all.length <= 1) return _jsonResponse({ ok: true, data: [], headers: all[0] || [] });
  
  const headers = all[0];
  const rows = all.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
  
  return _jsonResponse({ ok: true, data: rows, headers: headers, count: rows.length });
}

/**
 * Xóa toàn bộ dữ liệu 1 sheet (giữ header)
 */
function _handleClearSheet(sheetName) {
  if (!sheetName) return _jsonResponse({ ok: false, error: 'Thiếu tên sheet' });
  
  const ss = _getOrCreateSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return _jsonResponse({ ok: false, error: 'Sheet không tồn tại' });
  
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  return _jsonResponse({ ok: true, message: 'Đã xóa dữ liệu ' + sheetName });
}

// ===== SHEET SCHEMAS =====
const SHEET_SCHEMAS = {
  'Files': ['FileID', 'FileName', 'MimeType', 'Size(KB)', 'UploadDate', 'Source', 'SourceID'],
  'Accounts': ['Username', 'Password', 'CreatedAt', 'LastLogin', 'Status'],
  'Exercises': ['ExerciseID', 'Title', 'Topic', 'Description', 'TestCount', 'SubtaskCount', 'CreatedAt', 'FileIO', 'TaskName'],
  'Theories': ['TheoryID', 'Title', 'Topic', 'Content', 'FileID', 'FileName', 'FileSize', 'CreatedAt'],
  'Rooms': ['RoomCode', 'Title', 'TimeLimit', 'Status', 'CreatedAt', 'StartTime', 'ProblemCount', 'StudentCount', 'Problems'],
  'Submissions': ['SubmissionID', 'Student', 'ExerciseID', 'ExerciseTitle', 'Score', 'SubmittedAt', 'Verdict'],
  'ContestResults': ['RoomCode', 'Student', 'ProblemIdx', 'Score', 'SubmittedAt'],
};

// ===== HELPER FUNCTIONS =====

/**
 * Tìm hoặc tạo folder trên Drive
 */
function _getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(CONFIG.FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  
  const folder = DriveApp.createFolder(CONFIG.FOLDER_NAME);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  Logger.log('📁 Tạo folder mới: ' + folder.getUrl());
  return folder;
}

/**
 * Tìm hoặc tạo Spreadsheet + tất cả sheet
 */
function _getOrCreateSpreadsheet() {
  // Tìm trong folder Themis
  const folder = _getOrCreateFolder();
  const files = folder.getFilesByName(CONFIG.SHEET_NAME);
  
  let ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    // Tạo mới
    ss = SpreadsheetApp.create(CONFIG.SHEET_NAME);
    // Di chuyển vào folder
    const file = DriveApp.getFileById(ss.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
    Logger.log('📊 Tạo sheet mới: ' + ss.getUrl());
  }
  
  // Đảm bảo tất cả sheet tồn tại
  for (const [name, headers] of Object.entries(SHEET_SCHEMAS)) {
    _getOrCreateSheet(ss, name, headers);
  }
  
  // Xóa sheet mặc định "Sheet1" nếu còn
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) { /* ignore */ }
  }
  
  return ss;
}

/**
 * Tìm hoặc tạo 1 sheet với headers
 */
function _getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (sheet) return sheet;
  
  sheet = ss.insertSheet(name);
  
  // Set headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Style header
  headerRange
    .setBackground('#1a1a2e')
    .setFontColor('#e0e0ff')
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.setColumnWidth(i, 140);
  }
  
  // Set tab color theo loại
  const colors = {
    'Files': '#4285F4',
    'Accounts': '#0F9D58', 
    'Exercises': '#F4B400',
    'Theories': '#DB4437',
    'Rooms': '#AB47BC',
    'Submissions': '#00ACC1',
    'ContestResults': '#FF7043'
  };
  if (colors[name]) sheet.setTabColor(colors[name]);
  
  Logger.log('📋 Tạo sheet: ' + name);
  return sheet;
}

/**
 * JSON response helper
 */
function _jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== TEST FUNCTIONS =====

/**
 * Test upload — chạy thử trong Apps Script editor
 */
function testUpload() {
  const testData = {
    action: 'upload_file',
    fileName: 'test_document.txt',
    mimeType: 'text/plain',
    base64Data: Utilities.base64Encode('Đây là file test từ Themis Online Judge!'),
    metadata: { source: 'test', sourceId: 'test123' }
  };
  
  const result = _handleUpload(testData);
  Logger.log(result.getContent());
}

/**
 * Test list files
 */
function testListFiles() {
  const result = _handleListFiles();
  Logger.log(result.getContent());
}

/**
 * Test sheet data
 */
function testSheetData() {
  const result = _handleLogData('Accounts', ['TestUser', '123456', new Date().toISOString(), '', 'active']);
  Logger.log(result.getContent());
  
  const readResult = _handleGetSheetData('Accounts');
  Logger.log(readResult.getContent());
}
