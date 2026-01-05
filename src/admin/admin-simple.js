<<<<<<< HEAD
/* Admin Simple - Code đơn giản, chắc chắn hoạt động */
(function () {
    'use strict';

    const ADMIN_USERNAME = 'Admin';
    const ADMIN_PASSWORD = '093701';

    window.SupabaseConfig.init();

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
        await loadDashboardData();
    }

    // Load dashboard data
    async function loadDashboardData() {
        try {
            const result = await window.SupabaseConfig.getAllUsers();

            if (result.success && result.data) {
                const users = result.data;

                const totalUsersEl = document.getElementById('totalUsers');
                const activeUsersEl = document.getElementById('activeUsers');
                const totalStarsEl = document.getElementById('totalStars');

                if (totalUsersEl) totalUsersEl.textContent = users.length;
                if (activeUsersEl) activeUsersEl.textContent = users.filter(u => u.last_sign_in_at).length;

                let totalStars = 0;
                users.forEach(user => {
                    if (user.total_stars) totalStars += user.total_stars;
                });
                if (totalStarsEl) totalStarsEl.textContent = totalStars;

                renderUsersTable(users);
            }
        } catch (error) {
            console.error('Load dashboard error:', error);
        }
    }

    // Render users table
    function renderUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Chưa có người dùng nào</td></tr>';
            return;
        }

        users.forEach(user => {
            const tr = document.createElement('tr');
            const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('vi-VN') : 'Chưa đăng nhập';

            tr.innerHTML = `
                <td>${user.id.substring(0, 8)}...</td>
                <td>${user.full_name || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                <td>${lastSignIn}</td>
                <td>${user.total_stars || 0} ⭐</td>
                <td><button class="btn-view" onclick="alert('Chi tiết user')">Chi tiết</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Check auth
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

})();
=======
/* Admin Simple - Code đơn giản, chắc chắn hoạt động */
(function () {
    'use strict';

    const ADMIN_USERNAME = 'Admin';
    const ADMIN_PASSWORD = '093701';

    window.SupabaseConfig.init();

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
        await loadDashboardData();
    }

    // Load dashboard data
    async function loadDashboardData() {
        try {
            const result = await window.SupabaseConfig.getAllUsers();

            if (result.success && result.data) {
                const users = result.data;

                const totalUsersEl = document.getElementById('totalUsers');
                const activeUsersEl = document.getElementById('activeUsers');
                const totalStarsEl = document.getElementById('totalStars');

                if (totalUsersEl) totalUsersEl.textContent = users.length;
                if (activeUsersEl) activeUsersEl.textContent = users.filter(u => u.last_sign_in_at).length;

                let totalStars = 0;
                users.forEach(user => {
                    if (user.total_stars) totalStars += user.total_stars;
                });
                if (totalStarsEl) totalStarsEl.textContent = totalStars;

                renderUsersTable(users);
            }
        } catch (error) {
            console.error('Load dashboard error:', error);
        }
    }

    // Render users table
    function renderUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Chưa có người dùng nào</td></tr>';
            return;
        }

        users.forEach(user => {
            const tr = document.createElement('tr');
            const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('vi-VN') : 'Chưa đăng nhập';

            tr.innerHTML = `
                <td>${user.id.substring(0, 8)}...</td>
                <td>${user.full_name || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                <td>${lastSignIn}</td>
                <td>${user.total_stars || 0} ⭐</td>
                <td><button class="btn-view" onclick="alert('Chi tiết user')">Chi tiết</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Check auth
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

})();
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
