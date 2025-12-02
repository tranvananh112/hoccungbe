/* ========================================
   HỆ THỐNG ĐỘ KHÓ PHÙ HỢP CHO EM BÉ
   ======================================== */

(function () {
    'use strict';

    console.log('📊 Loading Difficulty System...');

    // ========== CẤU HÌNH ĐỘ KHÓ THEO CẤP ==========
    var DIFFICULTY_CONFIG = {
        // CẤP 1: Siêu dễ - Từ 2-3 chữ, KHÔNG có chữ nhiễu
        level1: {
            maxWordLength: 3,        // Tối đa 3 chữ cái
            distractorCount: 0,      // KHÔNG có chữ nhiễu
            showHints: true,         // Hiện gợi ý
            description: 'Siêu dễ - Từ ngắn, không có chữ nhiễu'
        },

        // CẤP 2: Dễ - Từ 3-4 chữ, KHÔNG có chữ nhiễu
        level2: {
            maxWordLength: 4,
            distractorCount: 0,      // KHÔNG có chữ nhiễu (dễ cho trẻ)
            showHints: true,
            description: 'Dễ - Từ ngắn, không có chữ nhiễu'
        },

        // CẤP 3: Trung bình - Từ 4-5 chữ, 2 chữ nhiễu
        level3: {
            maxWordLength: 5,
            distractorCount: 2,      // 2 chữ nhiễu
            showHints: false,
            description: 'Trung bình - Từ vừa, vừa phải chữ nhiễu'
        },

        // CẤP 4: Khó - Từ 5-7 chữ, 3 chữ nhiễu
        level4: {
            maxWordLength: 7,
            distractorCount: 3,      // 3 chữ nhiễu
            showHints: false,
            description: 'Khó - Từ dài, nhiều chữ nhiễu'
        },

        // CẤP 5: Rất khó - Từ 7+ chữ, 4 chữ nhiễu
        level5: {
            maxWordLength: 10,
            distractorCount: 4,      // 4 chữ nhiễu
            showHints: false,
            description: 'Rất khó - Từ rất dài, nhiều chữ nhiễu'
        }
    };

    // ========== LẤY CẤU HÌNH ĐỘ KHÓ ==========
    function getDifficultyConfig(level) {
        var key = 'level' + level;
        return DIFFICULTY_CONFIG[key] || DIFFICULTY_CONFIG.level1;
    }

    // ========== LỌC TỪ PHÙ HỢP VỚI CẤP ĐỘ ==========
    function filterWordsByDifficulty(words, level) {
        var config = getDifficultyConfig(level);

        return words.filter(function (wordObj) {
            var word = wordObj.word || wordObj.sentence || '';
            var cleanWord = word.replace(/\s/g, ''); // Bỏ khoảng trắng
            var length = cleanWord.length;

            // Lọc theo độ dài
            return length <= config.maxWordLength;
        });
    }

    // ========== TẠO CHỮ NHIỄU THÔNG MINH ==========
    function getSmartDistractors(word, count, theme) {
        if (count === 0) return [];

        var cleanWord = word.replace(/\s/g, '').toUpperCase();
        var wordChars = cleanWord.split('');
        var distractors = [];

        // Danh sách chữ cái tiếng Việt
        var allLetters = 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY'.split('');

        // Lọc bỏ chữ đã có trong từ
        var availableLetters = allLetters.filter(function (letter) {
            return wordChars.indexOf(letter) === -1;
        });

        // Chọn ngẫu nhiên từ các chữ còn lại
        for (var i = 0; i < count && availableLetters.length > 0; i++) {
            var randomIndex = Math.floor(Math.random() * availableLetters.length);
            distractors.push(availableLetters[randomIndex]);
            availableLetters.splice(randomIndex, 1); // Xóa để không lặp
        }

        return distractors;
    }

    // ========== HIỂN THỊ GỢI Ý (CHO CẤP 1-2) ==========
    function showHints(word, level) {
        var config = getDifficultyConfig(level);
        if (!config.showHints) return;

        // Hiện 1-2 chữ đầu tiên
        var cleanWord = word.replace(/\s/g, '');
        var hintsCount = Math.min(1, Math.floor(cleanWord.length / 2));

        var slots = document.querySelectorAll('.letter-slot.empty');
        for (var i = 0; i < hintsCount && i < slots.length; i++) {
            var slot = slots[i];
            var char = slot.getAttribute('data-char');

            // Hiện chữ mờ mờ làm gợi ý
            slot.style.opacity = '0.3';
            slot.textContent = char;

            // Sau 2 giây thì ẩn lại
            setTimeout(function (s) {
                s.style.opacity = '1';
                s.textContent = '?';
            }, 2000, slot);
        }
    }

    // ========== ĐÁNH GIÁ ĐỘ KHÓ CỦA TỪ ==========
    function getWordDifficulty(word) {
        var cleanWord = word.replace(/\s/g, '');
        var length = cleanWord.length;

        if (length <= 3) return 1;
        if (length <= 4) return 2;
        if (length <= 5) return 3;
        if (length <= 7) return 4;
        return 5;
    }

    // ========== GỢI Ý CẤP ĐỘ PHÙ HỢP ==========
    function suggestLevel(userAge) {
        // 3-4 tuổi: Cấp 1
        if (userAge <= 4) return 1;
        // 5 tuổi: Cấp 2
        if (userAge === 5) return 2;
        // 6 tuổi: Cấp 3
        if (userAge === 6) return 3;
        // 7+ tuổi: Cấp 4
        return 4;
    }

    // ========== PHÂN TÍCH TIẾN ĐỘ ==========
    function analyzeProgress(gameState) {
        var accuracy = 0;
        var totalAttempts = 0;
        var correctAttempts = 0;

        // Tính độ chính xác từ word progress
        if (gameState.wordProgress) {
            Object.keys(gameState.wordProgress).forEach(function (word) {
                var progress = gameState.wordProgress[word];
                if (progress.attempts) {
                    totalAttempts += progress.attempts;
                    correctAttempts += progress.correct || 0;
                }
            });
        }

        if (totalAttempts > 0) {
            accuracy = (correctAttempts / totalAttempts) * 100;
        }

        // Gợi ý điều chỉnh cấp độ
        var suggestion = '';
        if (accuracy >= 90 && totalAttempts >= 10) {
            suggestion = 'Bé học rất tốt! Có thể tăng cấp độ.';
        } else if (accuracy < 50 && totalAttempts >= 5) {
            suggestion = 'Bé cần luyện thêm. Có thể giảm cấp độ.';
        } else {
            suggestion = 'Cấp độ hiện tại phù hợp.';
        }

        return {
            accuracy: accuracy.toFixed(1),
            totalAttempts: totalAttempts,
            correctAttempts: correctAttempts,
            suggestion: suggestion
        };
    }

    // ========== EXPORT ==========
    window.DifficultySystem = {
        getDifficultyConfig: getDifficultyConfig,
        filterWordsByDifficulty: filterWordsByDifficulty,
        getSmartDistractors: getSmartDistractors,
        showHints: showHints,
        getWordDifficulty: getWordDifficulty,
        suggestLevel: suggestLevel,
        analyzeProgress: analyzeProgress,
        DIFFICULTY_CONFIG: DIFFICULTY_CONFIG
    };

    console.log('✅ Difficulty System loaded');

})();
