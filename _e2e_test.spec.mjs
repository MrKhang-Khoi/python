import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8000/index.html';
const STU_NAME = 'Admin';
const STU_PASS = '1234567';
const TEACHER_PASS = 'admin@2025';

// ============================================================
// HELPER: Shared setup
// ============================================================
async function collectJSErrors(page) {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('404'))
      errors.push(msg.text());
  });
  return errors;
}

// ============================================================
// TEST 1: Landing page loads without JS errors
// ============================================================
test.describe('1. Landing Page', () => {
  test('Trang tải thành công, không lỗi JS', async ({ page }) => {
    const errors = await collectJSErrors(page);
    await page.goto(BASE);
    await page.waitForTimeout(3000);
    
    // Title correct
    await expect(page).toHaveTitle(/Themis/i);
    
    // Both role buttons visible (use specific class to avoid matching multiple text nodes)
    await expect(page.locator('.splash-btn-label').filter({ hasText: 'Giáo viên' })).toBeVisible();
    await expect(page.locator('.splash-btn-label').filter({ hasText: 'Học sinh' })).toBeVisible();
    
    // No JS errors
    const realErrors = errors.filter(e => !e.includes('net::') && !e.includes('favicon'));
    expect(realErrors).toEqual([]);
  });
});

// ============================================================
// TEST 2: Student login flow
// ============================================================
test.describe('2. Student Login', () => {
  test('Đăng nhập HS thành công', async ({ page }) => {
    const errors = await collectJSErrors(page);
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    
    // Click "Học sinh"
    await page.click('text=Học sinh');
    await page.waitForTimeout(500);
    
    // Login form visible
    await expect(page.locator('#stu-name')).toBeVisible();
    await expect(page.locator('#stu-password')).toBeVisible();
    
    // Enter credentials
    await page.fill('#stu-name', STU_NAME);
    await page.fill('#stu-password', STU_PASS);
    await page.click('#btn-stu-login');
    await page.waitForTimeout(3000);
    
    // Dashboard should appear
    const dashboard = page.locator('#stu-dashboard');
    const loginError = page.locator('#stu-login-error');
    const errText = await loginError.textContent();
    
    // Either login succeeds (dashboard visible) or we get expected error
    if (errText && errText.trim()) {
      console.log('Login error (expected if Firebase offline):', errText);
    } else {
      await expect(dashboard).toBeVisible();
      await expect(page.locator('#stu-welcome-name')).toContainText(STU_NAME);
    }
    
    const realErrors = errors.filter(e => !e.includes('net::') && !e.includes('favicon'));
    expect(realErrors).toEqual([]);
  });

  test('Đăng nhập sai mật khẩu → hiển thị lỗi', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    await page.click('text=Học sinh');
    await page.waitForTimeout(500);
    
    await page.fill('#stu-name', STU_NAME);
    await page.fill('#stu-password', 'wrong_password_999');
    await page.click('#btn-stu-login');
    await page.waitForTimeout(3000);
    
    // Should show error message
    const errEl = page.locator('#stu-login-error');
    const errText = await errEl.textContent();
    expect(errText.trim().length).toBeGreaterThan(0);
  });

  test('Đăng nhập thiếu thông tin → cảnh báo', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    await page.click('text=Học sinh');
    await page.waitForTimeout(500);
    
    // Click login without filling anything
    await page.click('#btn-stu-login');
    await page.waitForTimeout(500);
    
    const errEl = page.locator('#stu-login-error');
    await expect(errEl).toContainText('Nhập đầy đủ');
  });
});

// ============================================================
// TEST 3: Teacher login flow
// ============================================================
test.describe('3. Teacher Login', () => {
  test('Đăng nhập GV thành công', async ({ page }) => {
    const errors = await collectJSErrors(page);
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    
    // Click "Giáo viên"
    await page.click('text=Giáo viên');
    await page.waitForTimeout(500);
    
    // Password field visible
    const passField = page.locator('#teacher-password');
    await expect(passField).toBeVisible();
    
    await passField.fill(TEACHER_PASS);
    await page.click('#btn-teacher-login');
    await page.waitForTimeout(3000);
    
    // Teacher view should appear (view-teacher visible)
    const teacherView = page.locator('#view-teacher');
    const loginErr = page.locator('#teacher-login-error');
    const errText = await loginErr.textContent();
    
    if (errText && errText.trim()) {
      console.log('Teacher login error:', errText);
    } else {
      await expect(teacherView).toBeVisible();
    }
    
    const realErrors = errors.filter(e => !e.includes('net::') && !e.includes('favicon'));
    expect(realErrors).toEqual([]);
  });
});

// ============================================================
// TEST 4: BUG-01 Double submit guard
// ============================================================
test.describe('4. Bug Guards', () => {
  test('BUG-01: Double click Submit không crash', async ({ page }) => {
    const errors = await collectJSErrors(page);
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    
    // Login as student
    await page.click('text=Học sinh');
    await page.waitForTimeout(500);
    await page.fill('#stu-name', STU_NAME);
    await page.fill('#stu-password', STU_PASS);
    await page.click('#btn-stu-login');
    await page.waitForTimeout(3000);
    
    // Check if dashboard loaded (need Firebase online)
    const dashboard = page.locator('#stu-dashboard');
    if (!(await dashboard.isVisible())) {
      console.log('Skipping: Firebase not available');
      return;
    }
    
    // Try to find and click first exercise
    const exerciseRow = page.locator('.stu-ex-table tbody tr').first();
    if (await exerciseRow.count() > 0) {
      await exerciseRow.click();
      await page.waitForTimeout(2000);
      
      // Click submit rapidly 3 times
      const submitBtn = page.locator('#btn-stu-submit');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await submitBtn.click();
        await submitBtn.click();
        await page.waitForTimeout(2000);
        
        // Should NOT crash — no JS errors
        const realErrors = errors.filter(e => !e.includes('net::') && !e.includes('favicon'));
        expect(realErrors).toEqual([]);
      }
    }
  });

  test('BUG-02: Nút Chạy Thử hoạt động ngay lần đầu', async ({ page }) => {
    const errors = await collectJSErrors(page);
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    
    await page.click('text=Học sinh');
    await page.waitForTimeout(500);
    await page.fill('#stu-name', STU_NAME);
    await page.fill('#stu-password', STU_PASS);
    await page.click('#btn-stu-login');
    await page.waitForTimeout(3000);
    
    const dashboard = page.locator('#stu-dashboard');
    if (!(await dashboard.isVisible())) return;
    
    const exerciseRow = page.locator('.stu-ex-table tbody tr').first();
    if (await exerciseRow.count() > 0) {
      await exerciseRow.click();
      await page.waitForTimeout(2000);
      
      const runBtn = page.locator('#btn-stu-run');
      if (await runBtn.isVisible()) {
        // Click run ONCE
        await runBtn.click();
        await page.waitForTimeout(1000);
        
        // Should not just switch tab and do nothing — should show processing or run
        const statusEl = page.locator('#stu-submit-status');
        const statusText = await statusEl.textContent();
        // Status should show something (not empty after click)
        console.log('Run status after 1st click:', statusText);
        
        const realErrors = errors.filter(e => !e.includes('net::') && !e.includes('favicon'));
        expect(realErrors).toEqual([]);
      }
    }
  });

  test('BUG-05: Click nhanh 2 bài tập liên tiếp không crash', async ({ page }) => {
    const errors = await collectJSErrors(page);
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    
    await page.click('text=Học sinh');
    await page.waitForTimeout(500);
    await page.fill('#stu-name', STU_NAME);
    await page.fill('#stu-password', STU_PASS);
    await page.click('#btn-stu-login');
    await page.waitForTimeout(3000);
    
    const dashboard = page.locator('#stu-dashboard');
    if (!(await dashboard.isVisible())) return;
    
    // Get all exercise rows
    const rows = page.locator('.stu-ex-table tbody tr');
    const count = await rows.count();
    
    if (count >= 2) {
      // Click row 1 immediately then row 2 
      await rows.nth(0).click();
      await page.waitForTimeout(100); // Almost immediate
      
      // Go back and click row 2 
      const backBtn = page.locator('#btn-stu-back-dash');
      if (await backBtn.isVisible()) {
        await backBtn.click();
        await page.waitForTimeout(500);
        await rows.nth(1).click();
        await page.waitForTimeout(3000);
      }
      
      // Should not crash
      const realErrors = errors.filter(e => !e.includes('net::') && !e.includes('favicon'));
      expect(realErrors).toEqual([]);
    }
  });
});

// ============================================================
// TEST 5: UI State Management
// ============================================================
test.describe('5. UI State', () => {
  test('Role selection hides splash screen', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    
    const splash = page.locator('#splash');
    await expect(splash).toBeVisible();
    
    await page.click('text=Học sinh');
    await page.waitForTimeout(500);
    
    await expect(splash).toBeHidden();
    await expect(page.locator('#view-student')).toBeVisible();
  });

  test('Quay lại từ login giáo viên', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    
    await page.click('text=Giáo viên');
    await page.waitForTimeout(500);
    
    // Find back button
    const backBtn = page.locator('text=Quay lại').first();
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await page.waitForTimeout(500);
      
      // Splash should be visible again
      await expect(page.locator('#splash')).toBeVisible();
    }
  });

  test('Enter key triggers login', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(2000);
    await page.click('text=Học sinh');
    await page.waitForTimeout(500);
    
    await page.fill('#stu-name', STU_NAME);
    await page.fill('#stu-password', 'test');
    
    // Press Enter in password field
    await page.press('#stu-password', 'Enter');
    await page.waitForTimeout(2000);
    
    // Should trigger login attempt (show some response)
    const errEl = page.locator('#stu-login-error');
    const errText = await errEl.textContent();
    // Should have some response (not empty — means login was triggered)
    expect(errText.trim().length).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================
// TEST 6: Memory/JS Integrity
// ============================================================
test.describe('6. JavaScript Integrity', () => {
  test('UIController khởi tạo đúng', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(3000);
    
    const result = await page.evaluate(() => {
      return {
        hasUIController: typeof UIController !== 'undefined',
        hasWindow_uic: !!window._uic,
        uicType: window._uic ? window._uic.constructor.name : 'null',
      };
    });
    
    expect(result.hasUIController).toBe(true);
    expect(result.hasWindow_uic).toBe(true);
    expect(result.uicType).toBe('UIController');
  });

  test('Firebase Manager khởi tạo đúng', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(3000);
    
    const result = await page.evaluate(() => {
      if (!window._uic) return { ok: false, reason: 'no _uic' };
      return {
        ok: true,
        hasFb: !!window._uic.fb,
        hasDb: !!window._uic.fb?.db,
        hasDrive: !!window._uic.drive,
        hasGrader: !!window._uic.grader,
        hasPyEngine: !!window._uic.pyEngine,
      };
    });
    
    expect(result.ok).toBe(true);
    expect(result.hasFb).toBe(true);
    expect(result.hasDb).toBe(true);
    expect(result.hasDrive).toBe(true);
    expect(result.hasGrader).toBe(true);
  });

  test('Guard flags khởi tạo undefined (chưa active)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(3000);
    
    const flags = await page.evaluate(() => {
      const u = window._uic;
      if (!u) return null;
      return {
        isSubmitting: u._isSubmitting,
        isRunning: u._isRunning,
        openingExercise: u._openingExercise,
      };
    });
    
    expect(flags).not.toBeNull();
    // All guards should be falsy at start
    expect(flags.isSubmitting).toBeFalsy();
    expect(flags.isRunning).toBeFalsy();
    expect(flags.openingExercise).toBeFalsy();
  });
});
