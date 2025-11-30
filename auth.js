/* ========================================
   AUTH LOGIC - Xử lý đăng nhập/đăng ký
   ======================================== */

(function () {
    'use strict';

    console.log('🔐 Loading auth logic...');

    // Initialize Supabase (check if exists first)
    if (window.SupabaseConfig && typeof window.SupabaseConfig.init === 'function') {
        window.SupabaseConfig.init();
    }

    // DOM elements
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabName + 'Form').classList.add('active');

            hideMessages();
        });
    });

    // Login form
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        hideMessages();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = this.querySelector('.btn-submit');

        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Đang đăng nhập...';

        const result = await window.SupabaseConfig.signIn(email, password);

        if (result.success) {
            showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError(result.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
            submitBtn.disabled = false;
            submitBtn.textContent = '🔓 Đăng nhập';
        }
    });

    // Register form
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        hideMessages();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const submitBtn = this.querySelector('.btn-submit');

        // Validate
        if (password !== confirmPassword) {
            showError('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (password.length < 6) {
            showError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Đang đăng ký...';

        const result = await window.SupabaseConfig.signUp(email, password, {
            full_name: name,
            role: 'parent'
        });

        if (result.success) {
            showSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
            registerForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = '📝 Đăng ký';

            // Switch to login tab after 3 seconds
            setTimeout(() => {
                document.querySelector('[data-tab="login"]').click();
            }, 3000);
        } else {
            showError(result.error || 'Đăng ký thất bại. Email có thể đã được sử dụng.');
            submitBtn.disabled = false;
            submitBtn.textContent = '📝 Đăng ký';
        }
    });

    // Helper functions
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
    }

    function hideMessages() {
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
    }

    // Check if already logged in
    async function checkAuth() {
        try {
            // Wait for Supabase to initialize
            await new Promise(resolve => setTimeout(resolve, 500));

            const user = await window.SupabaseConfig.getCurrentUser();
            if (user) {
                // Already logged in, redirect to app
                console.log('✅ Already logged in, redirecting to app...');
                window.location.href = 'index.html';
            } else {
                console.log('ℹ️ Not logged in, showing auth form');
            }
        } catch (error) {
            console.error('Check auth error:', error);
        }
    }

    // Only check auth after page is fully loaded
    if (document.readyState === 'complete') {
        checkAuth();
    } else {
        window.addEventListener('load', checkAuth);
    }

    console.log('✅ Auth logic ready');

})();
