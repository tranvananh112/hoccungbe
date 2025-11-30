/* Admin Dashboard - Full Features with IP Tracking */
(function () {
    'use strict';

    const ADMIN_USERNAME = 'Admin';
    const ADMIN_PASSWORD = '093701';
    let currentUserId = null;
    let refreshInterval = null;
    let notificationCount = 0;
    let isDarkMode = false;

    window.SupabaseConfig.init();

    const adminLogin = document.getElementById('adminLogin');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    const btnLogout = document.getElementById('btnLogout');
    const btnLogoutSidebar = document.getElementById('btnLogoutSidebar');
    const btnRefresh = document.getElementById('btnRefresh');
    const btnNotifications = document.getElementById('btnNotifications');
    const btnTheme = document.getElementById('btnTheme');

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
                if (loginError) loginError.textContent = '❌ Sai tên đăng nhập hoặc mật khẩu!';
            }
        });
    }

    // Logout
    function handleLogout() {
        sessionStorage.removeItem('adminLoggedIn');
        if (refreshInterval) clearInterval(refreshInterval);
        if (adminDashboard) adminDashboard.style.display = 'none';
        if (adminLogin) adminLogin.style.display = 'flex';
    }

    if (btnLogout) btnLogout.addEventListener('click', handleLogout);
    if (btnLogoutSidebar) btnLogoutSidebar.addEventListener('click', handleLogout);

    // Refresh Button
    if (btnRefresh) {
        btnRefresh.addEventListener('click', function () {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 0.5s linear';
            setTimeout(() => {
                icon.style.animation = '';
            }, 500);
            loadAllData();
            showNotification('✅ Đã làm mới dữ liệu!');
        });
    }

    // Notifications Button
    if (btnNotifications) {
        btnNotifications.addEventListener('click', function () {
            showNotificationsPanel();
        });
    }

    // Theme Toggle Button
    if (btnTheme) {
        btnTheme.addEventListener('click', function () {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            const icon = this.querySelector('i');
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('adminDarkMode', isDarkMode);
            showNotification(isDarkMode ? '🌙 Đã bật chế độ tối' : '☀️ Đã bật chế độ sáng');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('adminDarkMode');
        if (savedTheme === 'true') {
            isDarkMode = true;
            document.body.classList.add('dark-mode');
            btnTheme.querySelector('i').className = 'fas fa-sun';
        }
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function showNotificationsPanel() {
        const panel = document.createElement('div');
        panel.className = 'notifications-panel';
        panel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 9999;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
        `;

        panel.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid #eee;">
                <h3 style="margin: 0; display: flex; justify-content: space-between; align-items: center;">
                    <span>🔔 Thông báo</span>
                    <button onclick="this.closest('.notifications-panel').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                </h3>
            </div>
            <div id="notificationsList" style="padding: 15px;">
                <div style="text-align: center; color: #999; padding: 20px;">
                    <p>🔔 Không có thông báo mới</p>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Load recent notifications
        loadRecentNotifications(panel.querySelector('#notificationsList'));

        // Close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closePanel(e) {
                if (!panel.contains(e.target) && !btnNotifications.contains(e.target)) {
                    panel.remove();
                    document.removeEventListener('click', closePanel);
                }
            });
        }, 100);
    }

    async function loadRecentNotifications(container) {
        try {
            // Get recent activities as notifications
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const result = await window.SupabaseConfig.client()
                .from('activity_stats')
                .select('*')
                .gte('created_at', today.toISOString())
                .order('created_at', { ascending: false })
                .limit(10);

            if (result.data && result.data.length > 0) {
                container.innerHTML = '';
                result.data.forEach(activity => {
                    const item = document.createElement('div');
                    item.style.cssText = `
                        padding: 12px;
                        border-bottom: 1px solid #f0f0f0;
                        cursor: pointer;
                        transition: background 0.2s;
                    `;
                    item.onmouseover = () => item.style.background = '#f8f8f8';
                    item.onmouseout = () => item.style.background = 'white';

                    const time = new Date(activity.created_at);
                    const timeStr = time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                    const icon = activity.activity_type === 'game_complete' ? '🎮' : '📚';

                    item.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">${icon}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 500;">${activity.activity_type}</div>
                                <div style="font-size: 12px; color: #666;">${timeStr}</div>
                            </div>
                        </div>
                    `;
                    container.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Load notifications error:', error);
        }
    }

    async function showDashboard() {
        if (adminLogin) adminLogin.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        await loadAllData();

        // Auto refresh mỗi 10 giây (thay vì 30 giây)
        refreshInterval = setInterval(() => {
            loadAllData();
        }, 10000);

        // Setup realtime subscriptions
        setupRealtimeSubscriptions();
    }

    // Realtime subscriptions để cập nhật tự động
    function setupRealtimeSubscriptions() {
        const client = window.SupabaseConfig.client();
        if (!client) return;

        // Subscribe to device_tracking changes
        const deviceChannel = client
            .channel('device_tracking_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'device_tracking'
            }, (payload) => {
                console.log('🔄 Device tracking changed:', payload);
                // Reload data khi có thay đổi
                const activeTab = document.querySelector('.nav-item.active');
                const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'overview';
                if (tabName === 'overview' || tabName === 'devices') {
                    loadAllData();
                }
            })
            .subscribe();

        // Subscribe to user_sessions changes
        const sessionChannel = client
            .channel('user_sessions_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'user_sessions'
            }, (payload) => {
                console.log('🔄 Session changed:', payload);
                const activeTab = document.querySelector('.nav-item.active');
                const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'overview';
                if (tabName === 'overview' || tabName === 'users') {
                    loadAllData();
                }
            })
            .subscribe();

        // Subscribe to activity_stats changes
        const activityChannel = client
            .channel('activity_stats_changes')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'activity_stats'
            }, (payload) => {
                console.log('🔄 New activity:', payload);
                const activeTab = document.querySelector('.nav-item.active');
                const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'overview';
                if (tabName === 'activity') {
                    loadAllData();
                }
                // Update notification count
                updateNotificationBadge();
            })
            .subscribe();

        console.log('✅ Realtime subscriptions setup complete');
    }

    function updateNotificationBadge() {
        const badge = document.querySelector('.notification-dot');
        if (badge) {
            badge.style.display = 'block';
        }
    }

    // Auto cleanup offline devices
    async function cleanupOfflineDevices() {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

            // Đánh dấu offline các thiết bị không hoạt động > 5 phút
            const { error } = await window.SupabaseConfig.client()
                .from('device_tracking')
                .update({ is_online: false })
                .eq('is_online', true)
                .lt('last_seen', fiveMinutesAgo);

            if (error) {
                console.error('Cleanup error:', error);
            } else {
                console.log('🧹 Cleaned up offline devices');
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }

    // Chạy cleanup mỗi 1 phút
    setInterval(cleanupOfflineDevices, 60 * 1000);

    async function loadAllData() {
        const activeTab = document.querySelector('.nav-item.active');
        const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'overview';

        if (tabName === 'overview') await loadOverviewData();
        else if (tabName === 'users') await loadUsersData();
        else if (tabName === 'devices') await loadDevicesData();
        else if (tabName === 'activity') await loadActivityData();
        else if (tabName === 'stats') await loadStatsData();
    }

    async function loadOverviewData() {
        try {
            console.log('📊 Loading overview data...');

            // Get users
            const usersResult = await window.SupabaseConfig.getAllUsers();
            const users = usersResult.success ? usersResult.data : [];
            console.log('👥 Users:', users.length, usersResult);

            // Get progress
            const progressResult = await window.SupabaseConfig.client().from('user_progress').select('*');
            const progressData = progressResult.data || [];
            console.log('⭐ Progress records:', progressData.length);

            // Calculate total stars and coins
            const totalStars = progressData.reduce((sum, p) => sum + (p.total_stars || 0), 0);
            const totalCoins = progressData.reduce((sum, p) => sum + (p.coins || 0), 0);
            console.log('💰 Total stars:', totalStars, 'Total coins:', totalCoins);

            // Lấy devices online (is_online = true VÀ last_seen trong vòng 2 phút)
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
            const devicesResult = await window.SupabaseConfig.client()
                .from('device_tracking')
                .select('*')
                .eq('is_online', true)
                .gte('last_seen', twoMinutesAgo)
                .order('last_seen', { ascending: false });

            const onlineDevices = devicesResult.data || [];
            const onlineUserIds = new Set(onlineDevices.map(d => d.user_id));
            console.log('🟢 Online devices:', onlineDevices.length, 'Unique users:', onlineUserIds.size);

            // Get today's sessions
            const today = new Date().toISOString().split('T')[0];
            const sessionsResult = await window.SupabaseConfig.client()
                .from('user_sessions')
                .select('*')
                .gte('session_start', today);
            const todaySessions = sessionsResult.data || [];
            const activeToday = new Set(todaySessions.map(s => s.user_id)).size;
            console.log('📱 Today sessions:', todaySessions.length, 'Active users:', activeToday);

            // Update UI
            updateElement('totalUsers', users.length);
            updateElement('onlineNow', onlineUserIds.size);
            updateElement('activeToday', activeToday);
            updateElement('totalStars', totalStars);
            updateElement('totalCoins', totalCoins);
            updateElement('totalSessions', todaySessions.length);
            updateElement('usersBadge', users.length);

            // Render charts
            renderDeviceBreakdown(onlineDevices);
            renderBrowserBreakdown(onlineDevices);
            renderOnlineDevices(onlineDevices);

            console.log('✅ Overview data loaded successfully');
        } catch (error) {
            console.error('❌ Load overview error:', error);
            showNotification('❌ Lỗi tải dữ liệu: ' + error.message, 'error');
        }
    }

    async function loadUsersData() {
        try {
            console.log('👥 Loading users data...');

            const usersResult = await window.SupabaseConfig.getAllUsers();
            if (!usersResult.success) {
                console.error('❌ Failed to get users:', usersResult.error);
                showNotification('❌ Không thể tải danh sách users', 'error');
                return;
            }

            console.log('✅ Got users:', usersResult.data.length);

            // Get progress
            const progressResult = await window.SupabaseConfig.client().from('user_progress').select('*');
            const progressMap = {};
            if (progressResult.data) {
                progressResult.data.forEach(p => {
                    progressMap[p.user_id] = p;
                    console.log('⭐ User progress:', p.user_id.substring(0, 8), 'Stars:', p.total_stars, 'Coins:', p.coins);
                });
            }
            console.log('📊 Progress records:', Object.keys(progressMap).length);

            // Get all devices with IP info
            const devicesResult = await window.SupabaseConfig.client()
                .from('device_tracking')
                .select('*')
                .order('last_seen', { ascending: false });

            const devicesByUser = {};
            const onlineUserIds = new Set();
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

            if (devicesResult.data) {
                devicesResult.data.forEach(d => {
                    if (!devicesByUser[d.user_id]) {
                        devicesByUser[d.user_id] = [];
                    }
                    devicesByUser[d.user_id].push(d);

                    // Check if truly online (is_online = true AND last_seen < 2 minutes)
                    const lastSeen = new Date(d.last_seen);
                    if (d.is_online && lastSeen > twoMinutesAgo) {
                        onlineUserIds.add(d.user_id);
                    }
                });
            }

            console.log('👥 Total users:', usersResult.data.length);
            console.log('🟢 Online users:', onlineUserIds.size);
            console.log('📱 Total devices:', devicesResult.data?.length || 0);

            renderUsersTable(usersResult.data, progressMap, onlineUserIds, devicesByUser);
            console.log('✅ Users data loaded successfully');
        } catch (error) {
            console.error('❌ Load users error:', error);
            showNotification('❌ Lỗi tải users: ' + error.message, 'error');
        }
    }

    async function loadDevicesData() {
        try {
            const result = await window.SupabaseConfig.client()
                .from('device_tracking')
                .select('*')
                .order('last_seen', { ascending: false });

            if (!result.data) return;

            console.log('📱 Total devices:', result.data.length);

            // Đếm theo loại thiết bị
            const counts = { mobile: 0, desktop: 0, tablet: 0 };
            result.data.forEach(d => {
                const type = d.device_type || 'desktop';
                counts[type]++;
            });

            updateElement('mobileCount', counts.mobile);
            updateElement('desktopCount', counts.desktop);
            updateElement('tabletCount', counts.tablet);

            renderDevicesList(result.data);
        } catch (error) {
            console.error('Load devices error:', error);
        }
    }

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

            const gameCount = result.data.filter(a => a.activity_type === 'game_complete').length;
            const wordCount = result.data.filter(a => a.activity_type === 'word_learned').length;
            const avgTime = result.data.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) / (result.data.length || 1);

            updateElement('totalGames', gameCount);
            updateElement('totalWords', wordCount);
            updateElement('avgDuration', Math.round(avgTime / 60));

            renderActivityFeed(result.data);
        } catch (error) {
            console.error('Load activity error:', error);
        }
    }

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

    function updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function renderDeviceBreakdown(devices) {
        const container = document.getElementById('deviceBreakdown');
        if (!container) return;

        const counts = { mobile: 0, desktop: 0, tablet: 0 };
        devices.forEach(d => counts[d.device_type || 'desktop']++);

        const total = devices.length || 1;
        container.innerHTML = '';
        const icons = { mobile: '📱', desktop: '💻', tablet: '📟' };

        Object.entries(counts).forEach(([type, count]) => {
            const percent = Math.round((count / total) * 100);
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            item.innerHTML = `
                <div class="breakdown-icon">${icons[type]}</div>
                <div class="breakdown-bar">
                    <div class="breakdown-label">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                    <div class="breakdown-fill" style="width: ${percent}%">${count}</div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    function renderBrowserBreakdown(devices) {
        const container = document.getElementById('browserBreakdown');
        if (!container) return;

        const browserCounts = {};
        devices.forEach(d => {
            const browser = d.browser || 'Unknown';
            browserCounts[browser] = (browserCounts[browser] || 0) + 1;
        });

        const total = devices.length || 1;
        container.innerHTML = '';

        const browserIcons = {
            'Chrome': '🌐',
            'Firefox': '🦊',
            'Safari': '🧭',
            'Edge': '🌊',
            'Unknown': '❓'
        };

        Object.entries(browserCounts).forEach(([browser, count]) => {
            const percent = Math.round((count / total) * 100);
            const icon = browserIcons[browser] || '🌐';
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            item.innerHTML = `
                <div class="breakdown-icon">${icon}</div>
                <div class="breakdown-bar">
                    <div class="breakdown-label">${browser}</div>
                    <div class="breakdown-fill" style="width: ${percent}%">${count}</div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    function renderOnlineDevices(devices) {
        const container = document.getElementById('onlineDevicesList');
        const countEl = document.getElementById('onlineCount');
        if (!container) return;

        if (countEl) countEl.textContent = devices.length;

        container.innerHTML = '';
        if (devices.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Không có thiết bị nào đang online</p>';
            return;
        }

        devices.forEach(device => {
            const item = document.createElement('div');
            item.className = 'device-item';
            item.style.cssText = `
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr;
                gap: 15px;
                padding: 12px;
                background: white;
                border-radius: 8px;
                margin-bottom: 8px;
                border: 1px solid #e0e0e0;
                align-items: center;
            `;

            const icon = device.device_type === 'mobile' ? '📱' : device.device_type === 'tablet' ? '📟' : '💻';
            const lastSeen = new Date(device.last_seen).toLocaleTimeString('vi-VN');
            const ip = device.ip_address || 'N/A';

            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">${icon}</span>
                    <div>
                        <div style="font-weight: 500;">${device.device_name || 'Unknown'}</div>
                        <div style="font-size: 12px; color: #666;">${device.browser || 'N/A'}</div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <span class="device-status online" style="background: #4CAF50; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">🟢 Online</span>
                </div>
                <div style="text-align: center; font-size: 13px; color: #666;">
                    <div>🌐 ${ip}</div>
                </div>
                <div style="text-align: right; font-size: 13px; color: #999;">
                    ${lastSeen}
                </div>
            `;
            container.appendChild(item);
        });
    }

    function renderUsersTable(users, progressMap, onlineUserIds, devicesByUser) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        users.forEach(user => {
            const progress = progressMap[user.id] || {};
            const isOnline = onlineUserIds.has(user.id);
            const userDevices = devicesByUser[user.id] || [];
            const latestDevice = userDevices[0];
            const deviceInfo = latestDevice ? `${latestDevice.device_type || 'desktop'} - ${latestDevice.browser || 'N/A'}` : 'N/A';
            const lastSeen = latestDevice ? new Date(latestDevice.last_seen).toLocaleString('vi-VN') : 'N/A';
            const ipAddress = latestDevice?.ip_address || 'N/A';

            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.onclick = () => showUserDetail(user.id);

            row.innerHTML = `
                <td>
                    <div style="font-weight: 500;">${user.username || 'N/A'}</div>
                    <div style="font-size: 11px; color: #999;">ID: ${user.id.substring(0, 8)}...</div>
                </td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="status-badge ${isOnline ? 'online' : 'offline'}" style="padding: 4px 12px; border-radius: 12px; font-size: 12px;">${isOnline ? '🟢 Online' : '⚫ Offline'}</span></td>
                <td>
                    <div>${deviceInfo}</div>
                    <div style="font-size: 11px; color: #666;">🌐 ${ipAddress}</div>
                </td>
                <td style="font-size: 12px;">${lastSeen}</td>
                <td>
                    <div>⭐ ${progress.total_stars || 0} | 🪙 ${progress.coins || 0}</div>
                    <div style="font-size: 11px; color: #666;">Level ${progress.current_level || 1}</div>
                </td>
                <td>
                    <button onclick="event.stopPropagation(); showUserDetail('${user.id}')" style="background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                        👁️ Xem
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async function showUserDetail(userId) {
        try {
            showNotification('🔍 Đang tải thông tin user...');
            console.log('Show detail for user:', userId);

            // Get user info
            const { data: userData, error: userError } = await window.SupabaseConfig.client()
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (userError) {
                console.error('Get user error:', userError);
                showNotification('❌ Không thể tải thông tin user', 'error');
                return;
            }

            if (!userData) {
                showNotification('⚠️ Không tìm thấy thông tin user', 'error');
                return;
            }

            // Get progress
            const { data: progressData } = await window.SupabaseConfig.client()
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            // Get devices
            const { data: devicesData } = await window.SupabaseConfig.client()
                .from('device_tracking')
                .select('*')
                .eq('user_id', userId)
                .order('last_seen', { ascending: false });

            // Show modal with info
            const modal = document.getElementById('userDetailModal');
            if (modal) {
                const userInfo = document.getElementById('userInfo');
                if (userInfo) {
                    userInfo.innerHTML = `
                        <h3>👤 ${userData.full_name || 'N/A'}</h3>
                        <p>📧 ${userData.email || 'N/A'}</p>
                        <p>🆔 ${userId}</p>
                    `;
                }

                const userStatsInfo = document.getElementById('userStatsInfo');
                if (userStatsInfo && progressData) {
                    userStatsInfo.innerHTML = `
                        <p>⭐ Sao: ${progressData.total_stars || 0}</p>
                        <p>🪙 Xu: ${progressData.coins || 0}</p>
                        <p>📊 Level: ${progressData.current_level || 1}</p>
                        <p>🔥 Streak: ${progressData.streak || 0}</p>
                    `;
                }

                const userDevicesList = document.getElementById('userDevicesList');
                if (userDevicesList && devicesData) {
                    userDevicesList.innerHTML = devicesData.map(d => `
                        <div style="padding: 10px; border: 1px solid #eee; margin: 5px 0; border-radius: 6px;">
                            <p><strong>${d.device_type}</strong> - ${d.browser}</p>
                            <p>🌐 IP: ${d.ip_address || 'N/A'}</p>
                            <p>Status: ${d.is_online ? '🟢 Online' : '⚫ Offline'}</p>
                            <p>Last seen: ${new Date(d.last_seen).toLocaleString('vi-VN')}</p>
                        </div>
                    `).join('');
                }

                modal.style.display = 'block';
            }

            showNotification('✅ Đã tải thông tin user', 'success');
        } catch (error) {
            console.error('Show user detail error:', error);
            showNotification('❌ Lỗi: ' + error.message, 'error');
        }
    }

    // Close modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.onclick = () => {
            const modal = document.getElementById('userDetailModal');
            if (modal) modal.style.display = 'none';
        };
    }

    function renderDevicesList(devices) {
        const container = document.getElementById('devicesList');
        if (!container) return;

        container.innerHTML = '';

        if (devices.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Không có thiết bị nào</p>';
            return;
        }

        const table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse;';
        table.innerHTML = `
            <thead>
                <tr style="background: #f5f5f5; text-align: left;">
                    <th style="padding: 12px; border-bottom: 2px solid #ddd;">Thiết bị</th>
                    <th style="padding: 12px; border-bottom: 2px solid #ddd;">Loại</th>
                    <th style="padding: 12px; border-bottom: 2px solid #ddd;">Trình duyệt</th>
                    <th style="padding: 12px; border-bottom: 2px solid #ddd;">IP Address</th>
                    <th style="padding: 12px; border-bottom: 2px solid #ddd;">Trạng thái</th>
                    <th style="padding: 12px; border-bottom: 2px solid #ddd;">Lần cuối</th>
                </tr>
            </thead>
            <tbody id="devicesTableBody"></tbody>
        `;

        container.appendChild(table);

        const tbody = table.querySelector('tbody');
        devices.forEach(device => {
            const isOnline = device.is_online;
            const lastSeen = new Date(device.last_seen).toLocaleString('vi-VN');
            const icon = device.device_type === 'mobile' ? '📱' : device.device_type === 'tablet' ? '📟' : '💻';
            const ipAddress = device.ip_address || 'N/A';

            const row = document.createElement('tr');
            row.style.cssText = 'border-bottom: 1px solid #eee;';
            row.innerHTML = `
                <td style="padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">${icon}</span>
                        <div>
                            <div style="font-weight: 500;">${device.device_name || 'Unknown'}</div>
                            <div style="font-size: 11px; color: #999;">ID: ${device.id.substring(0, 8)}...</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 12px;">${device.device_type || 'desktop'}</td>
                <td style="padding: 12px;">${device.browser || 'N/A'}</td>
                <td style="padding: 12px;">
                    <div style="font-family: monospace; background: #f5f5f5; padding: 4px 8px; border-radius: 4px; display: inline-block;">
                        🌐 ${ipAddress}
                    </div>
                </td>
                <td style="padding: 12px;">
                    <span class="status-badge ${isOnline ? 'online' : 'offline'}" style="padding: 4px 12px; border-radius: 12px; font-size: 12px; background: ${isOnline ? '#4CAF50' : '#999'}; color: white;">
                        ${isOnline ? '🟢 Online' : '⚫ Offline'}
                    </span>
                </td>
                <td style="padding: 12px; font-size: 13px; color: #666;">${lastSeen}</td>
            `;
            tbody.appendChild(row);
        });
    }

    function renderActivityFeed(activities) {
        const container = document.getElementById('activityFeed');
        if (!container) return;

        container.innerHTML = '';
        activities.slice(0, 20).forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            const time = new Date(activity.created_at).toLocaleTimeString('vi-VN');
            const icon = activity.activity_type === 'game_complete' ? '🎮' : '📚';
            item.innerHTML = `
                <span>${icon} ${activity.activity_type}</span>
                <span>${activity.details || ''}</span>
                <span>${time}</span>
            `;
            container.appendChild(item);
        });
    }

    function renderTimelineChart(data) {
        const container = document.getElementById('timelineChart');
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Không có dữ liệu</p>';
            return;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth || 800;
        canvas.height = 300;
        canvas.style.width = '100%';
        canvas.style.height = '300px';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        ctx.clearRect(0, 0, width, height);

        const maxValue = Math.max(...data.map(d => d.active_users || 0), 1);
        const step = (width - padding * 2) / (data.length - 1 || 1);

        // Draw grid lines
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - padding * 2) * i / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw line
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + index * step;
            const y = height - padding - ((point.active_users || 0) / maxValue) * (height - padding * 2);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#4CAF50';
        data.forEach((point, index) => {
            const x = padding + index * step;
            const y = height - padding - ((point.active_users || 0) / maxValue) * (height - padding * 2);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw value label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(point.active_users || 0, x, y - 10);
        });

        console.log('✅ Timeline chart rendered with', data.length, 'points');
    }

    function renderTimelineTable(data) {
        const tbody = document.getElementById('timelineTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(row.date).toLocaleDateString('vi-VN')}</td>
                <td>${row.active_users || 0}</td>
                <td>${row.total_sessions || 0}</td>
                <td>${row.total_games || 0}</td>
                <td>${row.total_words || 0}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Tab navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.admin-content').forEach(t => t.classList.remove('active'));

            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            const tabContent = document.getElementById('content' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
            if (tabContent) {
                tabContent.classList.add('active');
            }

            // Update page title
            const titles = {
                'overview': 'Tổng quan',
                'users': 'Người dùng',
                'devices': 'Thiết bị',
                'activity': 'Hoạt động',
                'stats': 'Thống kê',
                'settings': 'Cài đặt'
            };
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = titles[tabName] || 'Dashboard';

            loadAllData();
        });
    });

    // Timeline range change
    const timelineRange = document.getElementById('timelineRange');
    if (timelineRange) {
        timelineRange.addEventListener('change', () => loadStatsData());
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        /* Dark Mode Styles */
        body.dark-mode {
            background: #1a1a1a;
            color: #e0e0e0;
        }
        body.dark-mode .admin-dashboard-pro {
            background: #1a1a1a;
        }
        body.dark-mode .admin-sidebar {
            background: #2d2d2d;
            border-right-color: #404040;
        }
        body.dark-mode .admin-main {
            background: #1a1a1a;
        }
        body.dark-mode .top-bar {
            background: #2d2d2d;
            border-bottom-color: #404040;
        }
        body.dark-mode .stat-card-large,
        body.dark-mode .chart-card,
        body.dark-mode .stat-card {
            background: #2d2d2d;
            border-color: #404040;
        }
        body.dark-mode .search-box {
            background: #404040;
            border-color: #555;
        }
        body.dark-mode .search-box input {
            background: transparent;
            color: #e0e0e0;
        }
        body.dark-mode .icon-btn {
            background: #404040;
            color: #e0e0e0;
        }
        body.dark-mode .icon-btn:hover {
            background: #555;
        }
        body.dark-mode .device-item {
            background: #2d2d2d !important;
            border-color: #404040 !important;
        }
        body.dark-mode table {
            background: #2d2d2d;
        }
        body.dark-mode thead tr {
            background: #404040 !important;
        }
        body.dark-mode tbody tr {
            border-bottom-color: #404040 !important;
        }
        body.dark-mode tbody tr:hover {
            background: #353535;
        }
        
        /* Notification dot animation */
        .notification-dot {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            background: #f44336;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);

    // Expose showUserDetail to window for inline onclick
    window.showUserDetail = showUserDetail;

    // Check login status
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

})();
