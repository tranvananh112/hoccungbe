/* ========================================
   PARENT PAGE LOGIC - Xử lý trang phụ huynh
   ======================================== */

(function () {
    'use strict';

    console.log('👨‍👩‍👧 Loading parent page logic...');

    var selectedIcon = '🐱';
    var selectedIconCategory = 'animals';

    // Init parent page
    window.initParentPageEnhanced = function () {
        console.log('Init enhanced parent page');
        setupParentTabs();
        loadStatsTab();
        loadWordsTab();
        loadCustomWordsTab();
        loadTimeControlTab();
        loadThemesTab();
    };

    // Setup tabs
    function setupParentTabs() {
        var tabs = document.querySelectorAll('.parent-tab');
        var contents = document.querySelectorAll('.parent-tab-content');

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var tabName = this.getAttribute('data-tab');
                tabs.forEach(function (t) { t.classList.remove('active'); });
                contents.forEach(function (c) { c.classList.remove('active'); });
                this.classList.add('active');
                var content = document.getElementById('tab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
                if (content) content.classList.add('active');
                if (window.playSound) window.playSound('click');
            });
        });
    }

    // Tab 1: Stats
    function loadStatsTab() {
        if (!window.gameState) return;
        var parentWords = document.getElementById('parentWords');
        var parentTime = document.getElementById('parentTime');
        var parentAccuracy = document.getElementById('parentAccuracy');
        var parentMaxLevel = document.getElementById('parentMaxLevel');

        if (parentWords) parentWords.textContent = window.gameState.wordsLearned.length;
        if (parentTime) parentTime.textContent = Math.floor((window.gameState.totalPlayTime || 0) / 60);
        if (parentAccuracy) parentAccuracy.textContent = '~';
        if (parentMaxLevel) parentMaxLevel.textContent = window.gameState.maxLevel || 1;
    }

    // Tab 2: Words learned
    function loadWordsTab() {
        var container = document.getElementById('wordsLearnedList');
        if (!container || !window.gameState) return;

        container.innerHTML = '';

        if (window.gameState.wordsLearned.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Chưa có từ nào được học</p>';
            return;
        }

        window.gameState.wordsLearned.forEach(function (word) {
            var icon = '📖';
            if (window.WordThemes) {
                for (var themeKey in window.WordThemes) {
                    var theme = window.WordThemes[themeKey];
                    ['level1', 'level2', 'level3'].forEach(function (level) {
                        if (theme[level]) {
                            theme[level].forEach(function (item) {
                                if (item.word === word || item.sentence === word) {
                                    icon = item.image;
                                }
                            });
                        }
                    });
                }
            }

            var item = document.createElement('div');
            item.className = 'word-learned-item';
            item.innerHTML =
                '<span class="word-learned-icon">' + icon + '</span>' +
                '<span class="word-learned-text">' + word + '</span>';
            container.appendChild(item);
        });

        var btnExport = document.getElementById('btnExportWords');
        if (btnExport) {
            btnExport.onclick = function () {
                var text = 'Danh sách từ đã học:\n\n';
                window.gameState.wordsLearned.forEach(function (word, i) {
                    text += (i + 1) + '. ' + word + '\n';
                });

                var blob = new Blob([text], { type: 'text/plain' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'tu-da-hoc.txt';
                a.click();

                if (window.beeSay) window.beeSay('Đã xuất danh sách! 📥', 2000);
                if (window.playSound) window.playSound('success');
            };
        }
    }

    // Tab 3: Custom words
    function loadCustomWordsTab() {
        loadIconPickerWithCategories();
        renderCustomWords();
        setupLearningModeToggle();
        setupAddWordButton();
        setupCreateLessonButton();
        renderCustomLessons();
    }

    function setupLearningModeToggle() {
        var modeToggle = document.getElementById('learningModeToggle');
        if (!modeToggle || !window.ParentalControls) return;

        modeToggle.value = window.ParentalControls.settings.learningMode;

        modeToggle.onchange = function () {
            window.ParentalControls.setLearningMode(this.value);
            updateFormLabels(this.value);
            if (window.beeSay) {
                var msg = this.value === 'word' ? 'Chế độ: Ghép chữ 🔤' : 'Chế độ: Ghép câu 📝';
                window.beeSay(msg, 2000);
            }
        };

        updateFormLabels(modeToggle.value);
    }

    function updateFormLabels(mode) {
        var wordLabel = document.querySelector('label[for="customWordInput"]');
        var syllableLabel = document.querySelector('label[for="customSyllablesInput"]');

        if (wordLabel) {
            wordLabel.textContent = mode === 'word' ? 'Từ cần học:' : 'Câu cần học:';
        }
        if (syllableLabel) {
            syllableLabel.textContent = mode === 'word' ? 'Chia âm tiết:' : 'Chia từ trong câu:';
        }
    }

    function loadIconPickerWithCategories() {
        var categoriesContainer = document.getElementById('iconCategories');
        var picker = document.getElementById('iconPicker');

        if (!categoriesContainer || !picker || !window.ParentalControls) return;

        // Render categories
        categoriesContainer.innerHTML = '';
        for (var catKey in window.ParentalControls.iconCategories) {
            var cat = window.ParentalControls.iconCategories[catKey];
            var btn = document.createElement('button');
            btn.className = 'icon-category-btn';
            if (catKey === selectedIconCategory) btn.classList.add('active');
            btn.innerHTML = cat.icon + ' ' + cat.name;
            btn.onclick = (function (key) {
                return function () {
                    selectedIconCategory = key;
                    document.querySelectorAll('.icon-category-btn').forEach(function (b) {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                    renderIconsForCategory(key);
                    if (window.playSound) window.playSound('click');
                };
            })(catKey);
            categoriesContainer.appendChild(btn);
        }

        // Render initial icons
        renderIconsForCategory(selectedIconCategory);
    }

    function renderIconsForCategory(category) {
        var picker = document.getElementById('iconPicker');
        if (!picker || !window.ParentalControls) return;

        picker.innerHTML = '';
        var icons = window.ParentalControls.iconCategories[category].items;

        icons.forEach(function (icon) {
            var btn = document.createElement('button');
            btn.className = 'icon-option';
            if (icon === selectedIcon) btn.classList.add('selected');
            btn.textContent = icon;
            btn.onclick = function () {
                selectedIcon = icon;
                document.querySelectorAll('.icon-option').forEach(function (b) {
                    b.classList.remove('selected');
                });
                this.classList.add('selected');

                var selectedIconEl = document.getElementById('selectedIcon');
                if (selectedIconEl) selectedIconEl.textContent = icon;

                if (window.playSound) window.playSound('click');
            };
            picker.appendChild(btn);
        });
    }

    function setupAddWordButton() {
        var btnAdd = document.getElementById('btnAddCustomWord');
        if (!btnAdd) return;

        btnAdd.onclick = function () {
            var wordInput = document.getElementById('customWordInput');
            var syllablesInput = document.getElementById('customSyllablesInput');
            var modeToggle = document.getElementById('learningModeToggle');

            if (!wordInput || !wordInput.value.trim()) {
                if (window.beeSay) window.beeSay('Vui lòng nhập từ/câu cần học! ✏️', 2000);
                return;
            }

            var word = wordInput.value.trim();
            var syllables = syllablesInput && syllablesInput.value.trim()
                ? syllablesInput.value.trim().split(' ')
                : word.split(' ');
            var type = modeToggle ? modeToggle.value : 'word';

            if (window.ParentalControls) {
                window.ParentalControls.addCustomWord(word, selectedIcon, syllables, type);
                if (window.beeSay) {
                    var msg = type === 'word' ? 'Đã thêm từ: ' + word + '! 🎉' : 'Đã thêm câu: ' + word + '! 🎉';
                    window.beeSay(msg, 2000);
                }
                if (window.playSound) window.playSound('success');

                wordInput.value = '';
                if (syllablesInput) syllablesInput.value = '';

                renderCustomWords();
                renderCustomLessons();
            }
        };
    }

    function setupCreateLessonButton() {
        var btnCreate = document.getElementById('btnCreateLesson');
        if (!btnCreate) return;

        btnCreate.onclick = function () {
            if (!window.ParentalControls) return;

            var words = window.ParentalControls.getCustomWords();
            if (words.length === 0) {
                if (window.beeSay) window.beeSay('Chưa có từ nào để tạo bài học! ✏️', 2000);
                return;
            }

            var lessonName = prompt('Tên bài học:', 'Bài học ' + (window.ParentalControls.getCustomLessons().length + 1));
            if (!lessonName) return;

            var lesson = window.ParentalControls.createLessonFromCustomWords(lessonName);
            if (lesson) {
                if (window.beeSay) window.beeSay('Đã tạo bài học: ' + lessonName + '! 📚', 3000);
                if (window.playSound) window.playSound('success');
                renderCustomLessons();
            }
        };
    }

    function renderCustomWords() {
        var container = document.getElementById('customWordsList');
        var countEl = document.getElementById('customWordCount');

        if (!container || !window.ParentalControls) return;

        var words = window.ParentalControls.getCustomWords();

        if (countEl) countEl.textContent = words.length;

        container.innerHTML = '';

        if (words.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px; grid-column: 1/-1;">Chưa có từ tùy chỉnh nào</p>';
            return;
        }

        words.forEach(function (word) {
            var item = document.createElement('div');
            item.className = 'custom-word-item';
            var displayText = word.word || word.sentence;
            var typeLabel = word.type === 'sentence' ? '📝' : '🔤';

            item.innerHTML =
                '<button class="btn-delete-word" data-id="' + word.id + '">×</button>' +
                '<span class="word-type-badge">' + typeLabel + '</span>' +
                '<span class="word-icon">' + word.image + '</span>' +
                '<span class="word-text">' + displayText + '</span>';

            var deleteBtn = item.querySelector('.btn-delete-word');
            deleteBtn.onclick = function () {
                if (confirm('Xóa "' + displayText + '"?')) {
                    window.ParentalControls.deleteCustomWord(word.id);
                    if (window.beeSay) window.beeSay('Đã xóa! 🗑️', 2000);
                    if (window.playSound) window.playSound('click');
                    renderCustomWords();
                    renderCustomLessons();
                }
            };

            container.appendChild(item);
        });
    }

    function renderCustomLessons() {
        var container = document.getElementById('customLessonsList');
        if (!container || !window.ParentalControls) return;

        var lessons = window.ParentalControls.getCustomLessons();

        container.innerHTML = '';

        if (lessons.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Chưa có bài học nào</p>';
            return;
        }

        lessons.forEach(function (lesson) {
            var item = document.createElement('div');
            item.className = 'custom-lesson-item';
            item.innerHTML =
                '<div class="lesson-header">' +
                '<span class="lesson-icon">📚</span>' +
                '<span class="lesson-name">' + lesson.name + '</span>' +
                '<span class="lesson-count">' + lesson.words.length + ' từ</span>' +
                '</div>' +
                '<div class="lesson-actions">' +
                '<button class="btn-play-lesson" data-id="' + lesson.id + '">▶️ Học ngay</button>' +
                '<button class="btn-delete-lesson" data-id="' + lesson.id + '">🗑️ Xóa</button>' +
                '</div>';

            var playBtn = item.querySelector('.btn-play-lesson');
            playBtn.onclick = function () {
                playCustomLesson(lesson);
            };

            var deleteBtn = item.querySelector('.btn-delete-lesson');
            deleteBtn.onclick = function () {
                if (confirm('Xóa bài học "' + lesson.name + '"?')) {
                    window.ParentalControls.deleteLesson(lesson.id);
                    if (window.beeSay) window.beeSay('Đã xóa bài học! 🗑️', 2000);
                    if (window.playSound) window.playSound('click');
                    renderCustomLessons();
                }
            };

            container.appendChild(item);
        });
    }

    function playCustomLesson(lesson) {
        // Chuyển sang chế độ custom lesson
        if (window.gameState) {
            window.gameState.customLesson = lesson;
            window.gameState.customLessonIndex = 0;
            window.saveGame();
        }

        // Chuyển sang trang chơi
        if (window.showPage) {
            window.showPage('play');
        }

        if (window.beeSay) window.beeSay('Bắt đầu bài học: ' + lesson.name + '! 🎮', 2000);
        if (window.playSound) window.playSound('success');
    }

    // Tab 4: Time control
    function loadTimeControlTab() {
        if (!window.ParentalControls) return;

        var toggle = document.getElementById('timeLimitToggle');
        var settings = document.getElementById('timeLimitSettings');
        var input = document.getElementById('timeLimitInput');
        var btnSave = document.getElementById('btnSaveTimeLimit');

        if (toggle) {
            toggle.checked = window.ParentalControls.settings.timeLimitEnabled;
            if (toggle.checked && settings) {
                settings.style.display = 'block';
            }

            toggle.onchange = function () {
                if (settings) {
                    settings.style.display = this.checked ? 'block' : 'none';
                }
            };
        }

        if (input) {
            input.value = window.ParentalControls.settings.timeLimit || 30;
        }

        var presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(function (btn) {
            btn.onclick = function () {
                var minutes = parseInt(this.getAttribute('data-minutes'));
                if (input) input.value = minutes;
                if (window.playSound) window.playSound('click');
            };
        });

        if (btnSave) {
            btnSave.onclick = function () {
                var minutes = parseInt(input.value) || 30;
                var enabled = toggle.checked;

                window.ParentalControls.setTimeLimit(minutes, enabled);

                if (window.beeSay) {
                    if (enabled) {
                        window.beeSay('Đã đặt giới hạn ' + minutes + ' phút/ngày! ⏰', 3000);
                    } else {
                        window.beeSay('Đã tắt giới hạn thời gian! ✓', 2000);
                    }
                }
                if (window.playSound) window.playSound('success');

                updateTimeStatus();
            };
        }

        updateTimeStatus();
    }

    function updateTimeStatus() {
        if (!window.ParentalControls) return;

        var timePlayedEl = document.getElementById('timePlayedToday');
        var timeRemainingEl = document.getElementById('timeRemaining');

        if (window.ParentalControls.settings.playStartTime) {
            var elapsed = (Date.now() - window.ParentalControls.settings.playStartTime) / 1000 / 60;
            var limit = window.ParentalControls.settings.timeLimit;
            var remaining = Math.max(0, limit - elapsed);

            if (timePlayedEl) timePlayedEl.textContent = Math.floor(elapsed);
            if (timeRemainingEl) timeRemainingEl.textContent = Math.floor(remaining);
        } else {
            if (timePlayedEl) timePlayedEl.textContent = '0';
            if (timeRemainingEl) timeRemainingEl.textContent = window.ParentalControls.settings.timeLimit || '30';
        }
    }

    // Tab 5: Themes
    function loadThemesTab() {
        if (window.renderThemes) {
            window.renderThemes();
        }
    }

    console.log('✅ Parent page logic loaded');

})();
