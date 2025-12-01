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

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim().toLowerCase();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const submitBtn = this.querySelector('.btn-submit');

        // Validate name
        if (!name || name.length < 2) {
            showError('Tên phải có ít nhất 2 ký tự!');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Email không hợp lệ!');
            return;
        }

        // Validate password
        if (password.length < 6) {
            showError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        if (password !== confirmPassword) {
            showError('Mật khẩu xác nhận không khớp!');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Đang đăng ký...';

        try {
            // Kiểm tra SupabaseConfig có sẵn sàng không
            if (!window.SupabaseConfig || !window.SupabaseConfig.signUp) {
                showError('Hệ thống chưa sẵn sàng. Vui lòng tải lại trang.');
                submitBtn.disabled = false;
                submitBtn.textContent = '📝 Đăng ký';
                return;
            }

            console.log('📝 Đang đăng ký với email:', email);

            const result = await window.SupabaseConfig.signUp(email, password, {
                full_name: name,
                role: 'parent',
                email: email
            });

            console.log('📊 Kết quả đăng ký:', result);

            if (result.success) {
                // Kiểm tra xem có cần confirm email không
                const needsConfirmation = result.data?.user?.identities?.length === 0;

                if (needsConfirmation) {
                    showSuccess('✅ Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
                } else {
                    showSuccess('✅ Đăng ký thành công! Bạn có thể đăng nhập ngay.');
                }

                registerForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = '📝 Đăng ký';

                // Switch to login tab after 3 seconds
                setTimeout(() => {
                    document.querySelector('[data-tab="login"]').click();
                }, 3000);
            } else {
                // Xử lý các loại lỗi cụ thể
                let errorMsg = '❌ Đăng ký thất bại. ';

                const errorStr = (result.error || '').toLowerCase();

                if (errorStr.includes('already registered') || errorStr.includes('already exists') || errorStr.includes('user already registered')) {
                    errorMsg += 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.';
                } else if (errorStr.includes('invalid email')) {
                    errorMsg += 'Email không hợp lệ.';
                } else if (errorStr.includes('weak password') || errorStr.includes('password')) {
                    errorMsg += 'Mật khẩu quá yếu. Vui lòng dùng mật khẩu mạnh hơn (ít nhất 6 ký tự).';
                } else if (errorStr.includes('500') || errorStr.includes('internal')) {
                    errorMsg += 'Lỗi server. Vui lòng thử lại sau hoặc liên hệ admin.';
                } else if (errorStr.includes('network') || errorStr.includes('fetch')) {
                    errorMsg += 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.';
                } else {
                    errorMsg += result.error || 'Lỗi không xác định.';
                }

                showError(errorMsg);
                submitBtn.disabled = false;
                submitBtn.textContent = '📝 Đăng ký';

                // Log lỗi để debug
                console.error('❌ Signup error:', result.error);
            }
        } catch (error) {
            console.error('❌ Signup exception:', error);

            let errorMsg = '❌ Lỗi không xác định. ';
            if (error.message) {
                errorMsg += error.message;
            } else {
                errorMsg += 'Vui lòng thử lại sau.';
            }

            showError(errorMsg);
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

            // Kiểm tra xem SupabaseConfig đã sẵn sàng chưa
            if (!window.SupabaseConfig || !window.SupabaseConfig.getCurrentUser) {
                console.warn('⚠️ SupabaseConfig not ready yet');
                return;
            }

            const user = await window.SupabaseConfig.getCurrentUser();
            if (user) {
                // Already logged in, redirect to app
                console.log('✅ Already logged in, redirecting to app...');
                window.location.href = 'index.html';
            } else {
                console.log('ℹ️ Not logged in, showing auth form');
            }
        } catch (error) {
            // Không log error nếu là AuthSessionMissingError (bình thường)
            if (error.name !== 'AuthSessionMissingError') {
                console.error('Check auth error:', error);
            }
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
