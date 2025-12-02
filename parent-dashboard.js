/* ========================================
   PARENT DASHBOARD LOGIC
   ======================================== */

(function () {
    'use strict';

    console.log('📊 Loading Parent Dashboard...');

    let currentWordTab = 'mastered';
    let wordMasteryData = null;

    // ========== INIT ==========
    async function init() {
        // Check auth
        await checkAuth();

        // Load data
        await loadAllData();

        // Setup event listeners
        setupEventListeners();

        // Hide loading
        document.getElementById('loading').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }

    // ========== CHECK AUTH ==========
    async function checkAuth() {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!window.SupabaseConfig || !window.SupabaseConfig.getCurrentUser) {
                console.warn('⚠️ SupabaseConfig not ready');
                return;
            }

            const user = await window.SupabaseConfig.getCurrentUser();
            if (!user) {
                console.log('ℹ️ No user logged in, using local data');
            }
        } catch (error) {
            console.error('Check auth error:', error);
        }
    }

    // ========== LOAD DATA ==========
    async function loadAllData() {
        try {
            // Load today stats
            await loadTodayStats();

            // Load weekly stats
            await loadWeeklyStats();

            // Load word mastery
            await loadWordMastery();

            // Load recent sessions
            await loadRecentSessions();

        } catch (error) {
            console.error('❌ Load data error:', error);
            showError('Không thể tải dữ liệu. Vui lòng thử lại.');
        }
    }

    // ========== TODAY STATS ==========
    async function loadTodayStats() {
        const stats = await window.AnalyticsService.getTodayStats();

        if (stats) {
            document.getElementById('todayWords').textContent = stats.words_learned || 0;
            document.getElementById('todayGames').textContent = stats.games_played || 0;
            document.getElementById('todayTime').textContent = Math.floor((stats.total_time_seconds || 0) / 60);
            document.getElementById('todayStars').textContent = stats.stars_earned || 0;
        }
    }

    // ========== WEEKLY STATS ==========
    async function loadWeeklyStats() {
        // Tính ngày bắt đầu tuần (7 ngày trước)
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);

        const stats = await window.AnalyticsService.getWeeklyStats(weekStart);

        if (stats) {
            document.getElementById('weekWords').textContent = stats.totalWords || 0;
            document.getElementById('weekGames').textContent = stats.totalGames || 0;
            document.getElementById('weekTime').textContent = formatTime(stats.totalTime || 0);
            document.getElementById('weekStars').textContent = stats.totalStars || 0;

            // Render chart
            renderProgressChart(stats.dailyData);
        }
    }

    // ========== PROGRESS CHART ==========
    function renderProgressChart(dailyData) {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        // Chuẩn bị data cho 7 ngày
        const labels = [];
        const wordsData = [];
        const gamesData = [];

        // Tạo array 7 ngày
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Format label
            const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            labels.push(dayNames[date.getDay()] + ' ' + date.getDate() + '/' + (date.getMonth() + 1));

            // Tìm data cho ngày này
            const dayData = dailyData.find(d => d.date === dateStr);
            wordsData.push(dayData ? dayData.words_learned : 0);
            gamesData.push(dayData ? dayData.games_played : 0);
        }

        // Destroy existing chart
        if (window.progressChartInstance) {
            window.progressChartInstance.destroy();
        }

        // Create new chart
        window.progressChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Từ đã học',
                        data: wordsData,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Trò chơi',
                        data: gamesData,
                        borderColor: '#f5576c',
                        backgroundColor: 'rgba(245, 87, 108, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // ========== WORD MASTERY ==========
    async function loadWordMastery() {
        wordMasteryData = await window.AnalyticsService.getWordMasteryReport();

        if (wordMasteryData) {
            document.getElementById('masteredCount').textContent = wordMasteryData.mastered.length;
            document.getElementById('learningCount').textContent = wordMasteryData.learning.length;
            document.getElementById('practiceCount').textContent = wordMasteryData.needsPractice.length;

            // Render words list
            renderWordsList(currentWordTab);
        }
    }

    function renderWordsList(tab) {
        const container = document.getElementById('wordsList');
        if (!container || !wordMasteryData) return;

        let words = [];
        switch (tab) {
            case 'mastered':
                words = wordMasteryData.mastered;
                break;
            case 'learning':
                words = wordMasteryData.learning;
                break;
            case 'practice':
                words = wordMasteryData.needsPractice;
                break;
        }

        if (words.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">Chưa có từ nào trong danh mục này</div>
                </div>
            `;
            return;
        }

        container.innerHTML = words.map(word => `
            <div class="word-item">
                <div class="word-text">${word.word}</div>
                <div class="word-mastery">${word.mastery_level}% chính xác</div>
                <div class="mastery-bar">
                    <div class="mastery-fill" style="width: ${word.mastery_level}%"></div>
                </div>
                <div style="font-size: 11px; color: #999; margin-top: 4px;">
                    ${word.times_practiced} lần luyện
                </div>
            </div>
        `).join('');
    }

    // ========== RECENT SESSIONS ==========
    async function loadRecentSessions() {
        const sessions = await window.AnalyticsService.getRecentSessions(10);
        const container = document.getElementById('sessionsList');

        if (!container) return;

        if (sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">Chưa có lịch sử học tập</div>
                </div>
            `;
            return;
        }

        container.innerHTML = sessions.map(session => {
            const startTime = new Date(session.started_at);
            const duration = session.duration_seconds || 0;
            const wordsCount = session.words_learned ? session.words_learned.length : 0;

            return `
                <div class="session-item">
                    <div class="session-info">
                        <div class="session-time">
                            ${formatDateTime(startTime)}
                        </div>
                        <div class="session-details">
                            ${getThemeEmoji(session.theme)} ${getThemeName(session.theme)} - Level ${session.level}
                        </div>
                    </div>
                    <div class="session-stats">
                        <div class="session-stat">
                            <div class="session-stat-value">${wordsCount}</div>
                            <div class="session-stat-label">Từ học</div>
                        </div>
                        <div class="session-stat">
                            <div class="session-stat-value">${Math.floor(duration / 60)}'</div>
                            <div class="session-stat-label">Thời gian</div>
                        </div>
                        <div class="session-stat">
                            <div class="session-stat-value">${session.stars_earned || 0}</div>
                            <div class="session-stat-label">Sao</div>
                        </div>
                        <div class="session-stat">
                            <div class="session-stat-value">${session.accuracy_percent || 0}%</div>
                            <div class="session-stat-label">Chính xác</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========== EVENT LISTENERS ==========
    function setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', async function () {
            this.disabled = true;
            this.textContent = '⏳ Đang tải...';

            await loadAllData();

            this.disabled = false;
            this.textContent = '🔄 Làm mới';
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', function () {
            window.location.href = 'index.html';
        });

        // Word tabs
        document.querySelectorAll('.word-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                // Update active tab
                document.querySelectorAll('.word-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Update current tab
                currentWordTab = this.getAttribute('data-tab');

                // Render words
                renderWordsList(currentWordTab);
            });
        });
    }

    // ========== HELPERS ==========
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return hours + 'h ' + minutes + 'm';
        }
        return minutes + ' phút';
    }

    function formatDateTime(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return 'Hôm nay ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Hôm qua ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
    }

    function getThemeEmoji(theme) {
        const emojis = {
            'animals': '🐾',
            'colors': '🎨',
            'numbers': '🔢',
            'family': '👨‍👩‍👧‍👦',
            'food': '🍎',
            'body': '👋',
            'nature': '🌳',
            'vehicles': '🚗'
        };
        return emojis[theme] || '📚';
    }

    function getThemeName(theme) {
        const names = {
            'animals': 'Động vật',
            'colors': 'Màu sắc',
            'numbers': 'Số đếm',
            'family': 'Gia đình',
            'food': 'Thức ăn',
            'body': 'Cơ thể',
            'nature': 'Thiên nhiên',
            'vehicles': 'Phương tiện'
        };
        return names[theme] || theme;
    }

    function showError(message) {
        alert(message);
    }

    // ========== START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ Parent Dashboard loaded');

})();
