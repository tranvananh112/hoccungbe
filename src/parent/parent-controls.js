/* ========================================
   PARENT CONTROLS - Quản lý phụ huynh nâng cao
   ======================================== */

(function () {
    'use strict';

    console.log('👨‍👩‍👧 Loading parent controls...');

    // ========== ICON LIBRARY - Phân loại theo danh mục ==========
    var iconCategories = {
        animals: {
            name: 'Động vật',
            icon: '🐾',
            items: ['🐱', '🐕', '🐰', '🐻', '🐼', '🐨', '🦊', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉', '🦅', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕‍🦺', '🐩', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔']
        },
        food: {
            name: 'Thực phẩm',
            icon: '🍎',
            items: ['🍎', '🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯']
        },
        vehicles: {
            name: 'Phương tiện',
            icon: '🚗',
            items: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚁', '🛸', '🚀', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓']
        },
        sports: {
            name: 'Thể thao',
            icon: '⚽',
            items: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️']
        },
        nature: {
            name: 'Thiên nhiên',
            icon: '🌸',
            items: ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌼', '🌵', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌾', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫️', '⭐', '🌟', '✨', '⚡', '🔥', '💥', '☄️', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌍', '🌎', '🌏', '🪐', '💫']
        },
        emotions: {
            name: 'Cảm xúc',
            icon: '😊',
            items: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐']
        },
        school: {
            name: 'Học tập',
            icon: '📚',
            items: ['📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🔬', '🔭', '📡', '🎓', '🎒', '🏫']
        },
        home: {
            name: 'Đồ gia dụng',
            icon: '🏠',
            items: ['🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🕋', '⛩️', '🛏️', '🛋️', '🪑', '🚪', '🪟', '🪞', '🚿', '🛁', '🚽', '🪠', '🧻', '🪒', '🧴', '🧷', '🧹', '🧺', '🪣', '🧼', '🪥', '🧽', '🧯', '🛒']
        },
        music: {
            name: 'Âm nhạc',
            icon: '🎵',
            items: ['🎵', '🎶', '🎼', '🎹', '🥁', '🪘', '🎸', '🪕', '🎻', '🎺', '🪗', '🎷', '🎤', '🎧', '📻', '🎙️', '📢', '📣', '📯', '🔔', '🔕', '🎚️', '🎛️', '🎬', '🎭', '🎨', '🖼️', '🎪', '🎟️', '🎫']
        },
        colors: {
            name: 'Màu & Hình',
            icon: '🎨',
            items: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '⭐', '🌟', '✨', '💫', '⚡', '🔥', '💥', '✅', '❌', '⭕', '🛑', '⛔', '💯', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲']
        }
    };

    // ========== PARENTAL SETTINGS ==========
    var parentalSettings = {
        timeLimit: 0,
        timeLimitEnabled: false,
        playStartTime: null,
        customWords: [],
        customLessons: [],
        selectedThemes: [],
        learningMode: 'word' // 'word' hoặc 'sentence'
    };

    // Load settings
    function loadParentalSettings() {
        try {
            var saved = localStorage.getItem('parentalSettings');
            if (saved) {
                var data = JSON.parse(saved);
                parentalSettings = Object.assign(parentalSettings, data);
            }
        } catch (e) {
            console.error('Error loading parental settings:', e);
        }
    }

    // Save settings
    function saveParentalSettings() {
        try {
            localStorage.setItem('parentalSettings', JSON.stringify(parentalSettings));
            console.log('✅ Parental settings saved');
        } catch (e) {
            console.error('Error saving parental settings:', e);
        }
    }

    // Kiểm tra giới hạn thời gian
    function checkTimeLimit() {
        if (!parentalSettings.timeLimitEnabled || parentalSettings.timeLimit === 0) {
            return true;
        }

        if (!parentalSettings.playStartTime) {
            parentalSettings.playStartTime = Date.now();
            saveParentalSettings();
        }

        var elapsed = (Date.now() - parentalSettings.playStartTime) / 1000 / 60;
        var remaining = parentalSettings.timeLimit - elapsed;

        if (remaining <= 0) {
            return false;
        }

        if (remaining <= 5 && remaining > 4.9) {
            if (window.beeSay) {
                window.beeSay('Còn 5 phút nữa thôi nhé! ⏰', 3000);
            }
        }

        return true;
    }

    // Reset thời gian chơi
    function resetDailyTime() {
        var lastReset = localStorage.getItem('lastTimeReset');
        var today = new Date().toDateString();

        if (lastReset !== today) {
            parentalSettings.playStartTime = null;
            saveParentalSettings();
            localStorage.setItem('lastTimeReset', today);
        }
    }

    // Export
    window.ParentalControls = {
        settings: parentalSettings,
        iconCategories: iconCategories,
        load: loadParentalSettings,
        save: saveParentalSettings,
        checkTimeLimit: checkTimeLimit,
        resetDailyTime: resetDailyTime,

        // Thêm từ tùy chỉnh
        addCustomWord: function (word, icon, syllables, type) {
            var customWord = {
                id: 'custom_' + Date.now(),
                word: type === 'sentence' ? null : word,
                sentence: type === 'sentence' ? word : null,
                image: icon,
                syllables: syllables || word.split(' '),
                type: type || 'word',
                custom: true,
                createdAt: Date.now()
            };
            parentalSettings.customWords.push(customWord);
            saveParentalSettings();
            return customWord;
        },

        // Xóa từ tùy chỉnh
        deleteCustomWord: function (id) {
            parentalSettings.customWords = parentalSettings.customWords.filter(function (w) {
                return w.id !== id;
            });
            saveParentalSettings();
        },

        // Lấy tất cả từ tùy chỉnh
        getCustomWords: function () {
            return parentalSettings.customWords;
        },

        // Tạo bài học từ từ tùy chỉnh
        createLessonFromCustomWords: function (name) {
            if (parentalSettings.customWords.length === 0) {
                return null;
            }

            var lesson = {
                id: 'lesson_' + Date.now(),
                name: name || 'Bài học tùy chỉnh',
                words: parentalSettings.customWords.slice(),
                createdAt: Date.now()
            };

            parentalSettings.customLessons.push(lesson);
            saveParentalSettings();
            return lesson;
        },

        // Lấy bài học tùy chỉnh
        getCustomLessons: function () {
            return parentalSettings.customLessons;
        },

        // Xóa bài học
        deleteLesson: function (id) {
            parentalSettings.customLessons = parentalSettings.customLessons.filter(function (l) {
                return l.id !== id;
            });
            saveParentalSettings();
        },

        // Cập nhật giới hạn thời gian
        setTimeLimit: function (minutes, enabled) {
            parentalSettings.timeLimit = minutes;
            parentalSettings.timeLimitEnabled = enabled;
            if (enabled && !parentalSettings.playStartTime) {
                parentalSettings.playStartTime = Date.now();
            }
            saveParentalSettings();
        },

        // Chọn/bỏ chọn chủ đề
        toggleTheme: function (themeKey) {
            var index = parentalSettings.selectedThemes.indexOf(themeKey);
            if (index === -1) {
                parentalSettings.selectedThemes.push(themeKey);
            } else {
                parentalSettings.selectedThemes.splice(index, 1);
            }
            saveParentalSettings();
        },

        // Đặt chế độ học
        setLearningMode: function (mode) {
            parentalSettings.learningMode = mode;
            saveParentalSettings();
        }
    };

    // Auto-load
    loadParentalSettings();
    resetDailyTime();

    console.log('✅ Parent controls loaded');

})();
