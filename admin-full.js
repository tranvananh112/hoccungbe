/* Admin Full Features - Đầy đủ chức năng, hoạt động mượt mà */
(function () {
    'use strict';

    const ADMIN_USERNAME = 'Admin';
    const ADMIN_PASSWORD = '093701';

    let currentUserId = null;
    let refreshInterval = null;

    window.SupabaseConfig.init();

    const adminLogin = document.getElementById('adminLogin');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    const btnLogout = document.getElementById('btnLogout');
    const btnRefresh = document.getElementById('btnRefresh');
    const userDetailModal = document.getElementById('userDetailModal');
    const closeModal = document.getElementById('closeModal');

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
            if (refreshInterval) clearInterval(refreshInterval);
            if (adminDashboard) adminDashboard.style.display = 'none';
            if (adminLogin) adminLogin.style.display = 'flex';
        });
    }

    // Refresh
    if (btnRefresh) {
        btnRefresh.addEventListener('click', function () {
            loadAllData();
        });
    }

    // Show dashboard
    async function showDashboard() {
        if (adminLogin) adminLogin.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        await loadAllData();

        // Auto refresh every 30 seconds
        refreshInterval = setInterval(() => {
            loadAllData();
        }, 30000);
    }

    // Load all data
    async function loadAllData() {
        const activeTab = document.querySelector('.admin-tab.active, .nav-item.active');
        const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'overview';

        if (tabName === 'overview' || !tabName) {
            await loadOverviewData();
        } else if (tabName === 'users') {
            await loadUsersData();
        } else if (tabName === 'devices') {
            await loadDevicesData();
        } else if (tabName === 'activity') {
            await loadActivityData();
        } else if (tabName === 'stats') {
            await loadStatsData();
        }
    }

    // Load overview data
    async function loadOverviewData() {
        try {
            const result = await window.SupabaseConfig.getAdminDashboardStats();

            if (result.success && result.data) {
                const data = result.data;

                updateElement('totalUsers', data.totalUsers || 0);
                updateElement('onlineNow', data.onlineNow || 0);
                updateElement('activeToday', data.activeToday || 0);
                updateElement('totalStars', data.totalStars || 0);
                updateElement('totalCoins', data.totalCoins || 0);
                updateElement('totalSessions', data.totalSessions || 0);

                renderDeviceBreakdown(data.onlineDevices || []);
                renderOnlineDevices(data.onlineDevices || []);
            }
        } catch (error) {
            console.error('Load overview error:', error);
        }
    }

    // Load users data
    async function loadUsersData() {
        try {
            const authResult = await window.SupabaseConfig.client().auth.admin.listUsers();
            if (!authResult.data) return;

            const users = authResult.data.users;

            const progressResult = await window.SupabaseConfig.client()
                .from('user_progress')
                .select('*');

            const progressMap = {};
            if (progressResult.data) {
                progressResult.data.forEach(p => {
                    progressMap[p.user_id] = p;
                });
            }

            const devicesResult = await window.SupabaseConfig.client()
                .from('device_tracking')
                .select('*')
                .eq('is_online', true);

            const onlineUserIds = new Set();
            if (devicesResult.data) {
                devicesResult.data.forEach(d => onlineUserIds.add(d.user_id));
            }

            renderUsersTable(users, progressMap, onlineUserIds);
        } catch (error) {
            console.error('Load users error:', error);
        }
    }

    // Load devices data
    async function loadDevicesData() {
        try {
            const result = await window.SupabaseConfig.client()
                .from('device_tracking')
                .select('*')
                .order('last_seen', { ascending: false });

            if (!result.data) return;

            const devices = result.data;
            const counts = { mobile: 0, desktop: 0, tablet: 0 };

            devices.forEach(d => {
                const type = d.device_type || 'desktop';
                counts[type]++;
            });

            updateElement('mobileCount', counts.mobile);
            updateElement('desktopCount', counts.desktop);
            updateElement('tabletCount', counts.tablet);

            renderDevicesList(devices);
        } catch (error) {
            console.error('Load devices error:', error);
        }
    }

    // Load activity data
    async function loadActivityData() {
        try {
            const today = new Date().toISOString().split('T')[0];

            const result = await window.SupabaseConfig.client()
                .from('activity_stats')
                .select('*')
                .gte('created_at', today)
                .order('created_at', { ascending: false })
                .limit(100);

            if (!result.data) return;

            const activities = result.data;
            const gameCount = activities.filter(a => a.activity_type === 'game_complete').length;
            const wordCount = activities.filter(a => a.activity_type === 'word_learned').length;
            const avgTime = activities.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) / (activities.length || 1);

            updateElement('totalGames', gameCount);
            updateElement('totalWords', wordCount);
            updateElement('avgDuration', Math.round(avgTime / 60));

            renderActivityFeed(activities);
        } catch (error) {
            console.error('Load activity error:', error);
        }
    }

    // Load stats data
    async function loadStatsData() {
        try {
            const range = parseInt(document.getElementById('timelineRange')?.value || 30);
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const result = await window.SupabaseConfig.getDailyStats(startDate, endDate);

            if (result.success && result.data) {
                renderTimelineChart(result.data);
                renderTimelineTable(result.data);
            }
        } catch (error) {
            console.error('Load stats error:', error);
        }
    }

    // Helper: Update element
    function updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // Render device breakdown
    function renderDeviceBreakdown(devices) {
        const container = document.getElementById('deviceBreakdown');
        if (!container) return;

        const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
        devices.forEach(device => {
            const type = device.device_type || 'desktop';
            deviceCounts[type]++;
        });

        const total = devices.length || 1;
        container.innerHTML = '';
        const deviceIcons = { mobile: '📱', desktop: '💻', tablet: '📟' };

        Object.entries(deviceCounts).forEach(([type, count]) => {
            const percent = Math.round((count / total) * 100);
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            item.innerHTML = `
                <div class="breakdown-icon">${deviceIcons[type]}</div>
                <div class="breakdown-bar">
                    <div class="breakdown-label">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                    <div class="breakdown-fill" style="width: ${percent}%">${count}</div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    // Render online devices
    function renderOnlineDevices(devices) {
        const container = document.getElementById('onlineDevicesList');
        const countEl = document.getElementById('onlineCount');

        if (countEl) countEl.textContent = devices.length;
        if (!container) return;

        if (devices.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Không có thiết bị nào đang online</p>';
            return;
        }

        container.innerHTML = '';
        devices.forEach(device => {
            const card = document.createElement('div');
            card.className = 'online-device-card';

            const icon = device.device_type === 'mobile' ? '📱' :
                device.device_type === 'tablet' ? '📟' : '💻';

            const lastSeen = new Date(device.last_seen);
            const timeAgo = getTimeAgo(lastSeen);

            card.innerHTML = `
                <div class="online-device-icon">${icon}</div>
                <div class="online-device-info">
                    <div class="online-device-name">${device.browser} trên ${device.os}</div>
                    <div class="online-device-details">
                        ${device.screen_resolution} • ${timeAgo}
                    </div>
                </div>
                <div class="online-pulse"></div>
            `;
            container.appendChild(card);
        });
    }

    // Render users table
    function renderUsersTable(users, progressMap, onlineUserIds) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Chưa có người dùng nào</td></tr>';
            return;
        }

        users.forEach(user => {
            const progress = progressMap[user.id] || {};
            const isOnline = onlineUserIds.has(user.id);
            const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${progress.player_name || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>
                    <span class="user-status ${isOnline ? 'online' : 'offline'}">
                        <span class="user-status-dot"></span>
                        ${isOnline ? 'Online' : 'Offline'}
                    </span>
                </td>
                <td>-</td>
                <td>${lastSignIn ? getTimeAgo(lastSignIn) : 'Chưa đăng nhập'}</td>
                <td>${progress.total_stars || 0} ⭐</td>
                <td>
                    <button class="btn-view" onclick="viewUserDetail('${user.id}')">Chi tiết</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Render devices list
    function renderDevicesList(devices) {
        const container = document.getElementById('devicesList');
        if (!container) return;

        if (devices.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Chưa có thiết bị nào</p>';
            return;
        }

        container.innerHTML = '';
        devices.forEach(device => {
            const icon = device.device_type === 'mobile' ? '📱' :
                device.device_type === 'tablet' ? '📟' : '💻';

            const lastSeen = new Date(device.last_seen);
            const isOnline = device.is_online && (Date.now() - lastSeen.getTime() < 5 * 60 * 1000);

            const card = document.createElement('div');
            card.className = 'device-card';
            card.innerHTML = `
                <div class="device-card-icon">${icon}</div>
                <div class="device-card-info">
                    <div class="device-card-title">
                        ${device.browser} trên ${device.os}
                        ${isOnline ? '🟢' : ''}
                    </div>
                    <div class="device-card-details">
                        Màn hình: ${device.screen_resolution}<br>
                        Lần cuối: ${getTimeAgo(lastSeen)}<br>
                        Số lần truy cập: ${device.visit_count || 1}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Render activity feed
    function renderActivityFeed(activities) {
        const container = document.getElementById('activityFeed');
        if (!container) return;

        if (activities.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Chưa có hoạt động nào</p>';
            return;
        }

        container.innerHTML = '';
        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';

            const time = new Date(activity.created_at);
            const typeLabels = {
                game_start: '🎮 Bắt đầu chơi',
                game_complete: '✅ Hoàn thành game',
                word_learned: '📚 Học từ mới',
                level_up: '⬆️ Lên cấp',
                star_earned: '⭐ Nhận sao',
                coin_earned: '💰 Nhận xu'
            };

            item.innerHTML = `
                <div class="activity-item-header">
                    <div class="activity-item-type">${typeLabels[activity.activity_type] || activity.activity_type}</div>
                    <div class="activity-item-time">${getTimeAgo(time)}</div>
                </div>
                <div class="activity-item-details">
                    ${activity.stars_earned > 0 ? `+${activity.stars_earned} ⭐` : ''}
                    ${activity.coins_earned > 0 ? `+${activity.coins_earned} 💰` : ''}
                    ${activity.time_spent_seconds > 0 ? `${Math.round(activity.time_spent_seconds / 60)} phút` : ''}
                </div>
            `;
            container.appendChild(item);
        });
    }

    // Render timeline chart
    function renderTimelineChart(data) {
        const container = document.getElementById('timelineChart');
        if (!container) return;

        container.innerHTML = '<h3>📊 Người dùng hoạt động theo ngày</h3>';

        if (data.length === 0) {
            container.innerHTML += '<p style="text-align: center; color: #999;">Chưa có dữ liệu</p>';
            return;
        }

        const maxUsers = Math.max(...data.map(d => d.active_users || 0));

        data.forEach(day => {
            const date = new Date(day.stat_date).toLocaleDateString('vi-VN');
            const users = day.active_users || 0;
            const percent = maxUsers > 0 ? (users / maxUsers) * 100 : 0;

            const bar = document.createElement('div');
            bar.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 8px;';
            bar.innerHTML = `
                <div style="width: 100px; font-size: 13px; color: #666;">${date}</div>
                <div style="flex: 1; height: 32px; background: #f0f0f0; border-radius: 8px; overflow: hidden;">
                    <div style="height: 100%; width: ${percent}%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; padding: 0 12px; color: white; font-weight: 600; font-size: 14px;">
                        ${users}
                    </div>
                </div>
            `;
            container.appendChild(bar);
        });
    }

    // Render timeline table
    function renderTimelineTable(data) {
        const container = document.getElementById('timelineTable');
        if (!container) return;

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Users mới</th>
                        <th>Users hoạt động</th>
                        <th>Sessions</th>
                        <th>Games</th>
                        <th>Từ học</th>
                        <th>Sao</th>
                    </tr>
                </thead>
                <tbody id="timelineTableBody"></tbody>
            </table>
        `;

        const tbody = document.getElementById('timelineTableBody');

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Chưa có dữ liệu</td></tr>';
            return;
        }

        data.forEach(day => {
            const date = new Date(day.stat_date).toLocaleDateString('vi-VN');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${date}</td>
                <td>${day.new_users || 0}</td>
                <td>${day.active_users || 0}</td>
                <td>${day.total_sessions || 0}</td>
                <td>${day.total_games_played || 0}</td>
                <td>${day.total_words_learned || 0}</td>
                <td>${day.total_stars_earned || 0}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Helper: Get time ago
    function getTimeAgo(date) {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        if (seconds < 60) return 'Vừa xong';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' phút trước';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' giờ trước';
        if (seconds < 604800) return Math.floor(seconds / 86400) + ' ngày trước';
        return date.toLocaleDateString('vi-VN');
    }

    // Tab switching
    document.querySelectorAll('.admin-tab, .nav-item').forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');

            document.querySelectorAll('.admin-tab, .nav-item').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            const content = document.getElementById('content' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
            if (content) content.classList.add('active');

            loadAllData();
        });
    });

    // Check auth
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

})();
