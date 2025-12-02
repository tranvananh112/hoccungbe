/* ========================================
   PARENT LESSON CREATOR LOGIC
   ======================================== */

(function () {
    'use strict';

    console.log('✏️ Loading Lesson Creator...');

    // ========== DATA ==========
    let currentLesson = {
        name: '',
        description: '',
        level: 1,
        words: []
    };

    let selectedIcon = '🐱';
    let editingIndex = -1;

    // ========== ICON CATEGORIES ==========
    const iconCategories = {
        animals: ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🪶', '🐓', '🦃', '🦤', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],

        food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'],

        objects: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊', '🚴', '🚵', '🧗', '🤹', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩', '🪅', '🪆', '♠️', '♥️', '♦️', '♣️', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢'],

        nature: ['🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🪹', '🪺', '🍄', '🌰', '🐚', '🪨', '🌍', '🌎', '🌏', '🌐', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '☀️', '🌝', '🌞', '🪐', '⭐', '🌟', '✨', '⚡', '☄️', '💫', '🔥', '💥', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊', '🎄', '🎋', '🎍'],

        people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️', '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔‍♀️', '🧔', '🧔‍♂️', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳', '👳‍♂️', '🧕', '👮‍♀️', '👮', '👮‍♂️', '👷‍♀️', '👷', '👷‍♂️', '💂‍♀️', '💂', '💂‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️', '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🍳', '🧑‍🍳', '👨‍🍳', '👩‍🎓', '🧑‍🎓', '👨‍🎓', '👩‍🎤', '🧑‍🎤', '👨‍🎤', '👩‍🏫', '🧑‍🏫', '👨‍🏫', '👩‍🏭', '🧑‍🏭', '👨‍🏭', '👩‍💻', '🧑‍💻', '👨‍💻', '👩‍💼', '🧑‍💼', '👨‍💼', '👩‍🔧', '🧑‍🔧', '👨‍🔧', '👩‍🔬', '🧑‍🔬', '👨‍🔬', '👩‍🎨', '🧑‍🎨', '👨‍🎨', '👩‍🚒', '🧑‍🚒', '👨‍🚒', '👩‍✈️', '🧑‍✈️', '👨‍✈️', '👩‍🚀', '🧑‍🚀', '👨‍🚀', '👩‍⚖️', '🧑‍⚖️', '👨‍⚖️', '👰‍♀️', '👰', '👰‍♂️', '🤵‍♀️', '🤵', '🤵‍♂️', '👸', '🤴', '🥷', '🦸‍♀️', '🦸', '🦸‍♂️', '🦹‍♀️', '🦹', '🦹‍♂️', '🧙‍♀️', '🧙', '🧙‍♂️', '🧚‍♀️', '🧚', '🧚‍♂️', '🧛‍♀️', '🧛', '🧛‍♂️', '🧜‍♀️', '🧜', '🧜‍♂️', '🧝‍♀️', '🧝', '🧝‍♂️', '🧞‍♀️', '🧞', '🧞‍♂️', '🧟‍♀️', '🧟', '🧟‍♂️', '🙍‍♀️', '🙍', '🙍‍♂️', '🙎‍♀️', '🙎', '🙎‍♂️', '🙅‍♀️', '🙅', '🙅‍♂️', '🙆‍♀️', '🙆', '🙆‍♂️', '💁‍♀️', '💁', '💁‍♂️', '🙋‍♀️', '🙋', '🙋‍♂️', '🧏‍♀️', '🧏', '🧏‍♂️', '🙇‍♀️', '🙇', '🙇‍♂️', '🤦‍♀️', '🤦', '🤦‍♂️', '🤷‍♀️', '🤷', '🤷‍♂️'],

        symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
    };

    // ========== INIT ==========
    function init() {
        setupEventListeners();
        renderIconGrid('animals');
        updateUI();
    }

    // ========== EVENT LISTENERS ==========
    function setupEventListeners() {
        // Icon picker
        document.getElementById('btnIconPicker').addEventListener('click', openIconPicker);

        // Icon tabs
        document.querySelectorAll('.icon-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.icon-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderIconGrid(this.getAttribute('data-category'));
            });
        });

        // Add word
        document.getElementById('btnAddWord').addEventListener('click', addWord);

        // Clear all
        document.getElementById('btnClear').addEventListener('click', clearAll);

        // Save lesson
        document.getElementById('btnSave').addEventListener('click', saveLesson);

        // Play
        document.getElementById('btnPlay').addEventListener('click', playLesson);

        // Preview
        document.getElementById('btnPreview').addEventListener('click', previewLesson);

        // Share
        document.getElementById('btnShare').addEventListener('click', shareLesson);

        // Auto-fill label from word
        document.getElementById('wordInput').addEventListener('input', function () {
            const word = this.value.toUpperCase();
            const label = word.charAt(0) + word.slice(1).toLowerCase();
            document.getElementById('labelInput').value = label;
        });
    }

    // ========== ICON PICKER ==========
    function openIconPicker() {
        document.getElementById('iconPickerModal').classList.add('show');
    }

    window.closeIconPicker = function () {
        document.getElementById('iconPickerModal').classList.remove('show');
    };

    function renderIconGrid(category) {
        const grid = document.getElementById('iconGrid');
        const icons = iconCategories[category] || [];

        grid.innerHTML = icons.map(icon => `
      <button class="icon-option" onclick="selectIcon('${icon}')">
        ${icon}
      </button>
    `).join('');
    }

    window.selectIcon = function (icon) {
        selectedIcon = icon;
        document.getElementById('selectedIcon').textContent = icon;
        closeIconPicker();
    };

    // ========== ADD WORD ==========
    function addWord() {
        const word = document.getElementById('wordInput').value.trim().toUpperCase();
        const label = document.getElementById('labelInput').value.trim();

        if (!word) {
            alert('Vui lòng nhập từ!');
            return;
        }

        if (!label) {
            alert('Vui lòng nhập nhãn hiển thị!');
            return;
        }

        const wordObj = {
            word: word,
            image: selectedIcon,
            label: label
        };

        if (editingIndex >= 0) {
            currentLesson.words[editingIndex] = wordObj;
            editingIndex = -1;
        } else {
            currentLesson.words.push(wordObj);
        }

        // Clear inputs
        document.getElementById('wordInput').value = '';
        document.getElementById('labelInput').value = '';
        selectedIcon = '🐱';
        document.getElementById('selectedIcon').textContent = selectedIcon;

        updateUI();
    }

    // ========== EDIT/DELETE WORD ==========
    window.editWord = function (index) {
        const word = currentLesson.words[index];
        document.getElementById('wordInput').value = word.word;
        document.getElementById('labelInput').value = word.label;
        selectedIcon = word.image;
        document.getElementById('selectedIcon').textContent = selectedIcon;
        editingIndex = index;

        // Scroll to form
        document.querySelector('.panel-add').scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteWord = function (index) {
        if (confirm('Xóa từ này?')) {
            currentLesson.words.splice(index, 1);
            updateUI();
        }
    };

    // ========== CLEAR ALL ==========
    function clearAll() {
        if (confirm('Xóa tất cả từ?')) {
            currentLesson.words = [];
            updateUI();
        }
    }

    // ========== SAVE LESSON ==========
    function saveLesson() {
        currentLesson.name = document.getElementById('lessonName').value.trim();
        currentLesson.description = document.getElementById('lessonDesc').value.trim();
        currentLesson.level = parseInt(document.getElementById('lessonLevel').value);

        if (!currentLesson.name) {
            alert('Vui lòng nhập tên bài học!');
            return;
        }

        if (currentLesson.words.length === 0) {
            alert('Vui lòng thêm ít nhất 1 từ!');
            return;
        }

        // Save to localStorage
        localStorage.setItem('customLesson', JSON.stringify(currentLesson));

        document.getElementById('lessonStatus').textContent = 'Đã lưu ✅';
        setTimeout(() => {
            document.getElementById('lessonStatus').textContent = 'Đã lưu';
        }, 2000);

        alert('Đã lưu bài học thành công! ✅');
    }

    // ========== PLAY LESSON ==========
    function playLesson() {
        if (currentLesson.words.length === 0) {
            alert('Vui lòng thêm từ trước khi chơi!');
            return;
        }

        // Save first
        saveLesson();

        // Redirect to game with custom lesson
        window.location.href = 'index.html?customLesson=true';
    }

    // ========== PREVIEW ==========
    function previewLesson() {
        if (currentLesson.words.length === 0) {
            alert('Chưa có từ để xem trước!');
            return;
        }

        const preview = document.getElementById('previewContent');
        preview.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3>${currentLesson.name || 'Chưa đặt tên'}</h3>
        <p style="color: #666;">${currentLesson.description || 'Chưa có mô tả'}</p>
        <p style="color: #667eea; font-weight: 600;">Cấp độ: ${currentLesson.level} | Số từ: ${currentLesson.words.length}</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
        ${currentLesson.words.map((word, i) => `
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 8px;">${word.image}</div>
            <div style="font-weight: 700; color: #333; margin-bottom: 4px;">${word.word}</div>
            <div style="font-size: 13px; color: #666;">${word.label}</div>
          </div>
        `).join('')}
      </div>
    `;

        document.getElementById('previewModal').classList.add('show');
    }

    window.closePreview = function () {
        document.getElementById('previewModal').classList.remove('show');
    };

    // ========== SHARE ==========
    function shareLesson() {
        if (currentLesson.words.length === 0) {
            alert('Chưa có từ để chia sẻ!');
            return;
        }

        const shareData = JSON.stringify(currentLesson);
        const blob = new Blob([shareData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (currentLesson.name || 'bai-hoc') + '.json';
        a.click();
        URL.revokeObjectURL(url);

        alert('Đã tải file bài học! Bạn có thể chia sẻ file này cho người khác.');
    }

    // ========== UPDATE UI ==========
    function updateUI() {
        const count = currentLesson.words.length;
        document.getElementById('wordCount').textContent = count;
        document.getElementById('listCount').textContent = count;

        const list = document.getElementById('wordList');

        if (count === 0) {
            list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-text">Chưa có từ nào. Hãy thêm từ đầu tiên!</div>
        </div>
      `;
        } else {
            list.innerHTML = currentLesson.words.map((word, i) => `
        <div class="word-item">
          <div class="word-icon">${word.image}</div>
          <div class="word-info">
            <div class="word-text">${word.word}</div>
            <div class="word-label">${word.label}</div>
          </div>
          <div class="word-actions">
            <button class="btn-edit" onclick="editWord(${i})">✏️</button>
            <button class="btn-delete" onclick="deleteWord(${i})">🗑️</button>
          </div>
        </div>
      `).join('');
        }
    }

    // ========== START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ Lesson Creator loaded');

})();
