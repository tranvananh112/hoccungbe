/* Admin Dashboard - Simple Version */
(function () {
    'use strict';

    const ADMIN_USERNAME = 'Admin';
    const ADMIN_PASSWORD = '093701';

    // Wait for Supabase to initialize
    setTimeout(function () {
        if (window.SupabaseConfig) {
            window.SupabaseConfig.init();
        }
    }, 100);

    const adminLogin = document.getElementById('adminLogin');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    const btnLogout = document.getElementById('btnLogout');

    // Login
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;

            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                sessionStorage.setItem('adminLoggedIn', 'true');
                showDashboard();
            } else {
                if (loginError) {
                    loginError.textContent = '❌ Sai tên đăng nhập hoặc mật khẩu!';
                }
            }
        });
    }

    // Logout
    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            sessionStorage.removeItem('adminLoggedIn');
            if (adminDashboard) adminDashboard.style.display = 'none';
            if (adminLogin) adminLogin.style.display = 'flex';
        });
    }

    // Show dashboard
    async function showDashboard() {
        if (adminLogin) adminLogin.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        console.log('✅ Admin dashboard loaded');

        // Load data if available
        try {
            await loadDashboardData();
        } catch (error) {
            console.error('Load data error:', error);
        }
    }

    // Load dashboard data
    async function loadDashboardData() {
        console.log('📊 Loading dashboard data...');

        if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
            console.warn('⚠️ Supabase not ready');
            return;
        }

        try {
            // Get users from Supabase
            const result = await window.SupabaseConfig.getAllUsers();

            if (result.success && result.data) {
                console.log('✅ Loaded', result.data.length, 'users');
                updateStats(result.data);
            } else {
                console.error('❌ Failed to load users:', result.error);
            }
        } catch (error) {
            console.error('❌ Load error:', error);
        }
    }

    // Update stats
    function updateStats(users) {
        const totalUsersEl = document.getElementById('totalUsers');
        if (totalUsersEl) {
            totalUsersEl.textContent = users.length;
        }

        console.log('📊 Stats updated');
    }

    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

    console.log('✅ Admin.js loaded');

})();
