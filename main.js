// ========================================
// HỌC ĐỌC - ĐÁNH VẦN GAMESTVA
// Main JavaScript - Version đơn giản, chắc chắn hoạt động
// ========================================

(function () {
  'use strict';

  console.log('🐝 Gamestva loading...');

  // ========== DỮ LIỆU ==========
  var wordData = {
    level1: [
      { word: "BA", image: "👨", label: "Ba" },
      { word: "MẸ", image: "👩", label: "Mẹ" },
      { word: "CÁ", image: "🐟", label: "Cá" },
      { word: "MÈO", image: "🐱", label: "Mèo" },
      { word: "CHÓ", image: "🐕", label: "Chó" },
      { word: "GÀ", image: "🐔", label: "Gà" },
      { word: "VỊT", image: "🦆", label: "Vịt" },
      { word: "BÒ", image: "🐄", label: "Bò" },
      { word: "HOA", image: "🌸", label: "Hoa" },
      { word: "CÂY", image: "🌳", label: "Cây" }
    ],
    level2: [
      { word: "CON VOI", image: "🐘", label: "Con voi" },
      { word: "BẦU TRỜI", image: "🌤️", label: "Bầu trời" },
      { word: "QUẢ TÁO", image: "🍎", label: "Quả táo" },
      { word: "CON ONG", image: "🐝", label: "Con ong" }
    ],
    level3: [
      { word: "MÈO TRẮNG", image: "🐱", label: "Mèo trắng" },
      { word: "BÉ ĂN CƠM", image: "🍚", label: "Bé ăn cơm" }
    ]
  };

  // ========== BIẾN TOÀN CỤC ==========
  var gameState = {
    playerName: 'Bé',
    playerAvatar: '🐝',
    totalStars: 0,
    coins: 0, // Xu để đổi quà
    streak: 0, // Chuỗi làm đúng liên tiếp
    currentLevel: 1,
    currentWordIndex: 0,
    currentTheme: 'animals',
    gameMode: 'word',
    wordsLearned: [],
    wordProgress: {},
    stickers: [],
    ownedCharacters: ['🐝'], // Nhân vật đã sở hữu
    settings: { volume: 80 }
  };

  var currentWord = null;
  var isDragging = false;
  var dragElement = null;
  var dragClone = null;
  var letterAudioLoop = null;
  var audioCache = {};
  var currentAudio = null;

  // ========== FUNCTIONS ==========

  function saveGame() {
    try {
      localStorage.setItem('gamestva', JSON.stringify(gameState));
    } catch (e) { console.error('Save error:', e); }
  }

  function loadGame() {
    try {
      var saved = localStorage.getItem('gamestva');
      if (saved) {
        var loaded = JSON.parse(saved);
        for (var key in loaded) {
          gameState[key] = loaded[key];
        }
      }
    } catch (e) { console.error('Load error:', e); }
  }

  function playSound(type) {
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      var ctx = new AudioContext();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      var sounds = {
        click: { freq: 800, dur: 0.1 },
        correct: { freq: 880, dur: 0.15 },
        wrong: { freq: 300, dur: 0.2 },
        success: { freq: 1000, dur: 0.3 }
      };

      var s = sounds[type] || sounds.click;
      var vol = gameState.settings.volume / 100;
      osc.frequency.value = s.freq;
      gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + s.dur);
      osc.start();
      osc.stop(ctx.currentTime + s.dur);
    } catch (e) { }
  }

  function speakVietnamese(text, priority) {
    if (!text) return;
    var vol = gameState.settings.volume / 100;

    if (priority && currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    if (audioCache[text]) {
      var audio = audioCache[text];
      audio.volume = vol;
      audio.currentTime = 0;
      currentAudio = audio;
      audio.play().catch(function () { });
      return;
    }

    var audio = new Audio('/api/tts?text=' + encodeURIComponent(text));
    audio.volume = vol;
    audioCache[text] = audio;
    currentAudio = audio;
    audio.play().catch(function () { });
  }

  function startLetterSound(letter) {
    stopLetterSound();
    var vol = gameState.settings.volume / 100;
    letterAudioLoop = new Audio('/api/tts?text=' + encodeURIComponent(letter));
    letterAudioLoop.volume = vol;
    letterAudioLoop.play().catch(function () { });
    letterAudioLoop.onended = function () {
      if (isDragging && letterAudioLoop) {
        letterAudioLoop.currentTime = 0;
        letterAudioLoop.play().catch(function () { });
      }
    };
  }

  function stopLetterSound() {
    if (letterAudioLoop) {
      letterAudioLoop.pause();
      letterAudioLoop.onended = null;
      letterAudioLoop = null;
    }
  }

  function beeSay(msg, duration) {
    var speech = document.getElementById('beeSpeech');
    if (!speech) return;
    speech.textContent = msg;
    speech.classList.add('show');
    setTimeout(function () {
      speech.classList.remove('show');
    }, duration || 3000);
  }

  function updateNavInfo() {
    var navStars = document.getElementById('navStars');
    var navAvatar = document.getElementById('navAvatar');
    if (navStars) navStars.textContent = gameState.totalStars;
    if (navAvatar) navAvatar.textContent = gameState.playerAvatar;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }

  function getRandomLetters(count) {
    var letters = 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY';
    var result = [];
    for (var i = 0; i < count; i++) {
      result.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    return result;
  }

  function createConfetti() {
    var container = document.getElementById('confettiContainer');
    if (!container) return;
    container.innerHTML = '';
    var colors = ['#FFB6C1', '#98D8C8', '#FFE66D', '#FF9F43', '#74B9FF', '#DDA0DD'];

    for (var i = 0; i < 60; i++) {
      var c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = Math.random() * 0.5 + 's';
      container.appendChild(c);
    }
    setTimeout(function () {
      container.innerHTML = '';
    }, 3500);
  }

  // ========== NAVIGATION ==========
  function showPage(pageId) {
    console.log('Showing page:', pageId);

    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove('active');
    }

    var navItems = document.querySelectorAll('.nav-item');
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove('active');
    }

    var targetPage = document.getElementById('page' + pageId.charAt(0).toUpperCase() + pageId.slice(1));
    if (targetPage) {
      targetPage.classList.add('active');
    }

    var navItem = document.querySelector('.nav-item[data-page="' + pageId + '"]');
    if (navItem) navItem.classList.add('active');

    updateNavInfo();

    if (pageId === 'home') initHomePage();
    else if (pageId === 'play') initPlayPage();
    else if (pageId === 'shop') initShopPage();
    else if (pageId === 'profile') initProfilePage();
    else if (pageId === 'parent') {
      if (window.initParentPageEnhanced) {
        initParentPageEnhanced();
      } else {
        initParentPage();
      }
    }
  }

  // ========== DRAG & DROP ==========
  function getClientPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function handleDragStart(e) {
    var target = e.target;
    if (!target.classList.contains('draggable-letter')) return;
    if (target.classList.contains('used')) return;

    e.preventDefault();
    e.stopPropagation();

    isDragging = true;
    dragElement = target;

    var pos = getClientPos(e);

    dragClone = document.createElement('div');
    dragClone.className = 'drag-clone';
    dragClone.textContent = target.textContent;
    dragClone.style.cssText = 'position:fixed;left:' + (pos.x - 35) + 'px;top:' + (pos.y - 35) + 'px;width:70px;height:70px;z-index:10000;pointer-events:none;';
    document.body.appendChild(dragClone);

    target.classList.add('dragging-source');
    playSound('click');
    startLetterSound(target.getAttribute('data-char'));
  }

  function handleDragMove(e) {
    if (!isDragging || !dragClone) return;
    e.preventDefault();

    var pos = getClientPos(e);
    dragClone.style.left = (pos.x - 35) + 'px';
    dragClone.style.top = (pos.y - 35) + 'px';

    dragClone.style.display = 'none';
    var elemBelow = document.elementFromPoint(pos.x, pos.y);
    dragClone.style.display = '';

    var highlights = document.querySelectorAll('.letter-slot.highlight');
    for (var i = 0; i < highlights.length; i++) {
      highlights[i].classList.remove('highlight');
    }

    if (elemBelow && elemBelow.classList.contains('letter-slot') && elemBelow.classList.contains('empty')) {
      elemBelow.classList.add('highlight');
    }
  }

  function handleDragEnd(e) {
    if (!isDragging) return;
    e.preventDefault();

    stopLetterSound();

    var pos = getClientPos(e);
    if (dragClone) dragClone.style.display = 'none';
    var elemBelow = document.elementFromPoint(pos.x, pos.y);

    if (elemBelow && elemBelow.classList.contains('letter-slot') && elemBelow.classList.contains('empty')) {
      var draggedChar = dragElement.getAttribute('data-char');
      var expectedChar = elemBelow.getAttribute('data-char');

      if (draggedChar === expectedChar) {
        elemBelow.textContent = draggedChar;
        elemBelow.classList.remove('empty');
        elemBelow.classList.add('filled');
        dragElement.classList.add('used');
        dragElement.classList.remove('dragging-source');

        playSound('correct');
        beeSay('Đúng rồi! Giỏi quá! ⭐', 2000);
        speakVietnamese('Đúng rồi!', true);

        checkWordComplete();
      } else {
        playSound('wrong');
        beeSay('Sai rồi, thử lại nhé! 💪', 2000);
        speakVietnamese('Sai rồi!', true);

        // Reset chuỗi đúng khi sai
        gameState.streak = 0;

        if (dragElement) dragElement.classList.remove('dragging-source');
      }
    } else {
      if (dragElement) dragElement.classList.remove('dragging-source');
    }

    var highlights = document.querySelectorAll('.letter-slot.highlight');
    for (var i = 0; i < highlights.length; i++) {
      highlights[i].classList.remove('highlight');
    }

    if (dragClone) {
      dragClone.remove();
      dragClone = null;
    }
    isDragging = false;
    dragElement = null;
  }

  // ========== SMART WORD SELECTION ==========
  function selectSmartWord(words) {
    var now = Date.now();
    var DAY_MS = 24 * 60 * 60 * 1000; // 1 ngày

    // Phân loại từ
    var newWords = [];
    var oldWords = [];

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var wordKey = word.word || word.sentence;
      var progress = gameState.wordProgress[wordKey];

      if (!progress || !progress.learned) {
        // Từ mới chưa học
        newWords.push(word);
      } else if (progress.lastSeen && (now - progress.lastSeen) > DAY_MS) {
        // Từ cũ đã qua 1 ngày, có thể ôn lại
        oldWords.push(word);
      }
    }

    // Ưu tiên: 80% từ mới, 20% từ cũ
    var random = Math.random();
    if (newWords.length > 0 && (random < 0.8 || oldWords.length === 0)) {
      return newWords[Math.floor(Math.random() * newWords.length)];
    } else if (oldWords.length > 0) {
      return oldWords[Math.floor(Math.random() * oldWords.length)];
    }

    // Nếu không có từ nào, trả về null
    return null;
  }

  function markWordLearned(wordKey) {
    if (!gameState.wordProgress[wordKey]) {
      gameState.wordProgress[wordKey] = {
        learned: false,
        lastSeen: 0,
        count: 0
      };
    }

    var progress = gameState.wordProgress[wordKey];
    progress.count++;
    progress.lastSeen = Date.now();

    // Sau 3 lần làm đúng thì coi như đã học
    if (progress.count >= 3) {
      progress.learned = true;
    }

    saveGame();
  }

  // ========== GAME LOGIC ==========
  function loadWord() {
    // Kiểm tra custom lesson trước
    if (gameState.customLesson && gameState.customLesson.words) {
      loadCustomLessonWord();
      return;
    }

    // Lấy từ theo chủ đề
    var themeData = window.WordThemes && window.WordThemes[gameState.currentTheme];
    if (!themeData) themeData = wordData;

    var words = themeData['level' + gameState.currentLevel];
    if (!words) return;

    // CHỌN TỪ THÔNG MINH: Ưu tiên từ mới, tránh lặp lại
    currentWord = selectSmartWord(words);
    if (!currentWord) {
      // Nếu đã học hết, reset và bắt đầu lại
      gameState.currentWordIndex = 0;
      currentWord = words[0];
    }

    console.log('Loading word:', currentWord.word);

    var gameLevel = document.getElementById('gameLevel');
    var gameWordNum = document.getElementById('gameWordNum');
    var gameTotalWords = document.getElementById('gameTotalWords');
    var gameStars = document.getElementById('gameStars');
    var wordImage = document.getElementById('wordImage');
    var imageLabel = document.getElementById('imageLabel');
    var instructionText = document.getElementById('instructionText');

    if (gameLevel) gameLevel.textContent = gameState.currentLevel;
    if (gameWordNum) gameWordNum.textContent = gameState.currentWordIndex + 1;
    if (gameTotalWords) gameTotalWords.textContent = words.length;
    if (gameStars) gameStars.textContent = gameState.totalStars;
    if (wordImage) wordImage.textContent = currentWord.image;
    if (imageLabel) imageLabel.textContent = currentWord.label;
    if (instructionText) instructionText.textContent = 'Bé hãy ghép chữ: ' + currentWord.label + ' nhé! 💪';

    renderSlots();
    renderLetters();

    setTimeout(function () {
      // Tạo câu nói phù hợp với chủ đề
      var prefix = themeData.prefix || 'Đây là';
      var sentence = prefix + ' ' + currentWord.label.toLowerCase();
      speakVietnamese(sentence);
    }, 500);
  }

  function loadCustomLessonWord() {
    var lesson = gameState.customLesson;
    var index = gameState.customLessonIndex || 0;

    if (index >= lesson.words.length) {
      // Hoàn thành bài học
      if (window.beeSay) window.beeSay('Hoàn thành bài học! 🎉', 3000);
      gameState.customLesson = null;
      gameState.customLessonIndex = 0;
      saveGame();
      showPage('home');
      return;
    }

    currentWord = lesson.words[index];

    var gameLevel = document.getElementById('gameLevel');
    var gameWordNum = document.getElementById('gameWordNum');
    var gameTotalWords = document.getElementById('gameTotalWords');
    var gameStars = document.getElementById('gameStars');
    var wordImage = document.getElementById('wordImage');
    var imageLabel = document.getElementById('imageLabel');
    var instructionText = document.getElementById('instructionText');

    if (gameLevel) gameLevel.textContent = 'Tùy chỉnh';
    if (gameWordNum) gameWordNum.textContent = index + 1;
    if (gameTotalWords) gameTotalWords.textContent = lesson.words.length;
    if (gameStars) gameStars.textContent = gameState.totalStars;
    if (wordImage) wordImage.textContent = currentWord.image;

    var displayText = currentWord.word || currentWord.sentence;
    if (imageLabel) imageLabel.textContent = displayText;
    if (instructionText) {
      var mode = currentWord.type === 'sentence' ? 'ghép câu' : 'ghép chữ';
      instructionText.textContent = 'Bé hãy ' + mode + ': ' + displayText + ' nhé! 💪';
    }

    renderSlots();
    renderLetters();

    setTimeout(function () {
      speakVietnamese(displayText);
    }, 500);
  }

  function renderSlots() {
    var container = document.getElementById('wordSlots');
    if (!container) return;
    container.innerHTML = '';

    // Lấy text từ word hoặc sentence
    var text = currentWord.word || currentWord.sentence || '';
    var chars = text.split('');

    for (var i = 0; i < chars.length; i++) {
      var char = chars[i];
      if (char === ' ') {
        var space = document.createElement('div');
        space.className = 'letter-slot space';
        container.appendChild(space);
      } else {
        var slot = document.createElement('div');
        slot.className = 'letter-slot empty';
        slot.setAttribute('data-index', i);
        slot.setAttribute('data-char', char);
        slot.textContent = '?';
        container.appendChild(slot);
      }
    }
  }

  function renderLetters() {
    var container = document.getElementById('lettersPool');
    if (!container) return;
    container.innerHTML = '';

    // Lấy text từ word hoặc sentence
    var text = currentWord.word || currentWord.sentence || '';
    var wordChars = text.replace(/\s/g, '').split('');
    var extras = getRandomLetters(Math.min(2, wordChars.length));
    var allChars = shuffle(wordChars.concat(extras));

    for (var i = 0; i < allChars.length; i++) {
      var char = allChars[i];
      var letter = document.createElement('div');
      letter.className = 'draggable-letter';
      letter.textContent = char;
      letter.setAttribute('data-char', char);
      container.appendChild(letter);
    }
  }

  function checkWordComplete() {
    // Chỉ đếm các ô trống (empty), không đếm fixed-word
    var slots = document.querySelectorAll('.letter-slot.empty, .letter-slot.filled');
    var filled = document.querySelectorAll('.letter-slot.filled');

    console.log('Check complete:', filled.length, '/', slots.length);

    if (filled.length === slots.length && slots.length > 0) {
      console.log('Word/Sentence complete!');

      gameState.totalStars += 3;
      gameState.coins += 1; // Mỗi câu đúng = 1 xu

      // Tăng chuỗi đúng
      if (!gameState.streak) gameState.streak = 0;
      gameState.streak++;

      // Bonus xu cho chuỗi dài
      if (gameState.streak >= 5) {
        gameState.coins += 2; // Bonus 2 xu
        beeSay('Chuỗi 5 câu! Bonus +2 xu! 🪙🪙', 2000);
      }

      // Đổi sao thành xu (10 sao = 5 xu)
      if (gameState.totalStars >= 10 && gameState.totalStars % 10 === 0) {
        gameState.coins += 5;
        beeSay('10 sao đổi 5 xu! 🌟→🪙', 2000);
      }

      // Lưu từ hoặc câu đã học
      var wordToSave = currentWord.word || currentWord.sentence;
      if (wordToSave) {
        if (gameState.wordsLearned.indexOf(wordToSave) === -1) {
          gameState.wordsLearned.push(wordToSave);
        }
        // Đánh dấu tiến độ học
        markWordLearned(wordToSave);
      }
      saveGame();
      updateNavInfo();

      var gameStars = document.getElementById('gameStars');
      if (gameStars) gameStars.textContent = gameState.totalStars;

      var successPopup = document.getElementById('successPopup');
      var successWord = document.getElementById('successWord');
      var successCharacter = document.getElementById('successCharacter');

      // Hiển thị từ hoặc câu đã hoàn thành
      if (successWord) successWord.textContent = currentWord.word || currentWord.sentence;
      if (successCharacter) successCharacter.textContent = currentWord.image;
      if (successPopup) successPopup.classList.add('show');

      createConfetti();
      playSound('success');

      // Phát âm thanh hiệu ứng
      setTimeout(function () {
        if (window.SoundEffects) {
          window.SoundEffects.applause(0.3);
          setTimeout(function () {
            window.SoundEffects.firework(0.25);
          }, 300);
          setTimeout(function () {
            window.SoundEffects.cheer(0.2);
          }, 600);
        }
      }, 100);

      // Tạo câu khen phù hợp với TÊN BÉ
      var babyName = gameState.playerName || 'Bé';
      var praisesWithName = [
        babyName + ' giỏi lắm!',
        'Tuyệt vời ' + babyName + '!',
        babyName + ' thông minh quá!',
        'Đúng rồi ' + babyName + '!',
        babyName + ' tài giỏi quá!',
        'Xuất sắc ' + babyName + '!',
        babyName + ' học giỏi lắm!'
      ];
      var randomPraise = praisesWithName[Math.floor(Math.random() * praisesWithName.length)];

      // Đọc câu khen với tên bé
      speakVietnamese(randomPraise, true);

      // Sau đó đọc lại từ/câu
      setTimeout(function () {
        if (gameState.gameMode === 'sentence') {
          // Chế độ câu: đọc toàn bộ câu
          speakVietnamese(currentWord.audio || currentWord.sentence);
        } else {
          // Chế độ từ: đọc với prefix
          var themeData = window.WordThemes && window.WordThemes[gameState.currentTheme];
          var prefix = themeData && themeData.prefix ? themeData.prefix : 'Đây là';
          speakVietnamese(prefix + ' ' + currentWord.label.toLowerCase());
        }
      }, 1500);

      if (window.GameAnimations) {
        window.GameAnimations.playCharacterAnimation(currentWord.image, currentWord.label);
      }

      if (gameState.totalStars > 0 && gameState.totalStars % 10 === 0) {
        setTimeout(function () {
          var treasureModal = document.getElementById('treasureModal');
          if (treasureModal) treasureModal.classList.add('show');
        }, 2500);
      }

      // ĐỒNG HỒ ĐẾM NGƯỢC 4 → 3 → 2 → 1
      startCountdown();
    }
  }

  function nextWord() {
    var successPopup = document.getElementById('successPopup');
    if (successPopup) successPopup.classList.remove('show');

    // Custom lesson
    if (gameState.customLesson) {
      gameState.customLessonIndex = (gameState.customLessonIndex || 0) + 1;
      saveGame();
      loadWord();
      return;
    }

    gameState.currentWordIndex++;

    if (gameState.gameMode === 'sentence') {
      var sentences = window.SentenceData && window.SentenceData[gameState.currentTheme];
      if (sentences && gameState.currentWordIndex >= sentences.length) {
        gameState.currentWordIndex = 0;
        beeSay('Bé đã học hết câu trong chủ đề này! 🎉', 4000);
      }
      loadSentence();
    } else {
      var words = wordData['level' + gameState.currentLevel];
      if (gameState.currentWordIndex >= words.length) {
        gameState.currentWordIndex = 0;
        beeSay('Bé đã học hết cấp này! 🎉', 4000);
      }
      loadWord();
    }
  }

  // ========== COUNTDOWN TIMER ==========
  function startCountdown() {
    var countdownNumber = document.getElementById('countdownNumber');
    if (!countdownNumber) return;

    var timeLeft = 4;
    countdownNumber.textContent = timeLeft;

    var countdownInterval = setInterval(function () {
      timeLeft--;

      if (timeLeft > 0) {
        countdownNumber.textContent = timeLeft;

        // Thêm class urgent khi còn 2 giây
        if (timeLeft <= 2) {
          countdownNumber.classList.add('urgent');
        }

        // Phát âm thanh tick
        if (window.SoundEffects) {
          window.SoundEffects.pop(0.15);
        }
      } else {
        clearInterval(countdownInterval);
        nextWord();
      }
    }, 1000);
  }

  // ========== SENTENCE MODE ==========
  function loadSentence() {
    var sentences = window.SentenceData && window.SentenceData[gameState.currentTheme];
    if (!sentences || sentences.length === 0) {
      beeSay('Chủ đề này chưa có câu! Chọn chủ đề khác nhé!', 3000);
      return;
    }

    // CHỌN CÂU THÔNG MINH: Ưu tiên câu mới
    currentWord = selectSmartWord(sentences);
    if (!currentWord) {
      gameState.currentWordIndex = 0;
      currentWord = sentences[0];
    }

    console.log('Loading sentence:', currentWord.sentence);

    var gameLevel = document.getElementById('gameLevel');
    var gameWordNum = document.getElementById('gameWordNum');
    var gameTotalWords = document.getElementById('gameTotalWords');
    var gameStars = document.getElementById('gameStars');
    var wordImage = document.getElementById('wordImage');
    var imageLabel = document.getElementById('imageLabel');
    var instructionText = document.getElementById('instructionText');

    if (gameLevel) gameLevel.textContent = 'Câu';
    if (gameWordNum) gameWordNum.textContent = gameState.currentWordIndex + 1;
    if (gameTotalWords) gameTotalWords.textContent = sentences.length;
    if (gameStars) gameStars.textContent = gameState.totalStars;
    if (wordImage) wordImage.textContent = currentWord.image;
    if (imageLabel) imageLabel.textContent = currentWord.sentence;
    if (instructionText) instructionText.textContent = 'Bé hãy kéo từ vào chỗ trống nhé! 💪';

    renderSentenceSlots();
    renderSentenceWords();

    setTimeout(function () {
      speakVietnamese(currentWord.audio || currentWord.sentence);
    }, 500);
  }

  function renderSentenceSlots() {
    var container = document.getElementById('wordSlots');
    if (!container) return;
    container.innerHTML = '';
    container.parentElement.classList.add('sentence-mode');

    var words = currentWord.sentence.split(' ');
    var blankIndices = [];

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var isBlank = false;

      for (var j = 0; j < currentWord.blanks.length; j++) {
        if (word === currentWord.blanks[j]) {
          isBlank = true;
          blankIndices.push(i);
          break;
        }
      }

      if (isBlank) {
        var slot = document.createElement('div');
        slot.className = 'letter-slot empty word-blank';
        slot.dataset.index = i;
        slot.dataset.char = word;
        slot.textContent = '___';
        container.appendChild(slot);
      } else {
        var fixedWord = document.createElement('div');
        fixedWord.className = 'letter-slot fixed-word';
        fixedWord.textContent = word;
        fixedWord.style.cssText = 'border:none;background:transparent;color:#333;font-weight:600;';
        container.appendChild(fixedWord);
      }
    }
  }

  function renderSentenceWords() {
    var container = document.getElementById('lettersPool');
    if (!container) return;
    container.innerHTML = '';

    var blanks = shuffle(currentWord.blanks.slice());

    blanks.forEach(function (word) {
      var wordEl = document.createElement('div');
      wordEl.className = 'draggable-letter';
      wordEl.textContent = word;
      wordEl.dataset.char = word;
      container.appendChild(wordEl);
    });
  }

  // ========== PAGE INITIALIZERS ==========
  function initHomePage() {
    console.log('Init home page');
    loadGame();

    var avatarBtns = document.querySelectorAll('.avatar-btn');
    for (var i = 0; i < avatarBtns.length; i++) {
      var btn = avatarBtns[i];
      if (btn.getAttribute('data-avatar') === gameState.playerAvatar) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }

      btn.onclick = (function (button) {
        return function () {
          playSound('click');
          var allBtns = document.querySelectorAll('.avatar-btn');
          for (var j = 0; j < allBtns.length; j++) {
            allBtns[j].classList.remove('selected');
          }
          button.classList.add('selected');
          gameState.playerAvatar = button.getAttribute('data-avatar');
          saveGame();
          updateNavInfo();
        };
      })(btn);
    }

    var nameInput = document.getElementById('playerName');
    if (nameInput) {
      nameInput.value = gameState.playerName !== 'Bé' ? gameState.playerName : '';
      nameInput.oninput = function () {
        gameState.playerName = nameInput.value || 'Bé';
        saveGame();
      };
    }

    updateProgressBars();

    var levelBoxes = document.querySelectorAll('.level-box');
    for (var i = 0; i < levelBoxes.length; i++) {
      var box = levelBoxes[i];
      box.onclick = (function (levelBox) {
        return function () {
          playSound('click');
          gameState.currentLevel = parseInt(levelBox.getAttribute('data-level'));
          gameState.currentWordIndex = 0;
          saveGame();
          showPage('play');
        };
      })(box);
    }
  }

  function updateProgressBars() {
    for (var level = 1; level <= 3; level++) {
      var words = wordData['level' + level];
      var learned = 0;
      for (var i = 0; i < gameState.wordsLearned.length; i++) {
        for (var j = 0; j < words.length; j++) {
          if (words[j].word === gameState.wordsLearned[i]) {
            learned++;
            break;
          }
        }
      }
      var percent = Math.min((learned / words.length) * 100, 100);

      var bar = document.getElementById('homeProgress' + level);
      if (bar) bar.style.width = percent + '%';
    }
  }

  function initPlayPage() {
    console.log('Init play page');

    // Mode switcher
    var btnModeWord = document.getElementById('btnModeWord');
    var btnModeSentence = document.getElementById('btnModeSentence');

    if (btnModeWord) {
      btnModeWord.onclick = function () {
        playSound('click');
        gameState.gameMode = 'word';
        gameState.currentWordIndex = 0;
        saveGame();
        btnModeWord.classList.add('active');
        btnModeSentence.classList.remove('active');
        var container = document.getElementById('wordSlots');
        if (container) container.parentElement.classList.remove('sentence-mode');
        beeSay('Chế độ ghép chữ! 🔤', 2000);
        loadWord();
      };
    }

    if (btnModeSentence) {
      btnModeSentence.onclick = function () {
        playSound('click');
        gameState.gameMode = 'sentence';
        gameState.currentWordIndex = 0;
        saveGame();
        btnModeSentence.classList.add('active');
        btnModeWord.classList.remove('active');
        beeSay('Chế độ ghép câu! 📝', 2000);
        loadSentence();
      };
    }

    // Kiểm tra custom lesson trước
    var btnExitLesson = document.getElementById('btnExitLesson');

    if (gameState.customLesson) {
      // Ẩn mode switcher khi chơi custom lesson
      var modeSwitcher = document.querySelector('.mode-switcher');
      if (modeSwitcher) modeSwitcher.style.display = 'none';

      // Hiện nút thoát
      if (btnExitLesson) btnExitLesson.style.display = 'block';

      beeSay('Bài học: ' + gameState.customLesson.name + '! 🎮', 2000);
      loadWord(); // loadWord sẽ tự động load custom lesson
    } else {
      // Hiện mode switcher
      var modeSwitcher = document.querySelector('.mode-switcher');
      if (modeSwitcher) modeSwitcher.style.display = 'flex';

      // Ẩn nút thoát
      if (btnExitLesson) btnExitLesson.style.display = 'none';

      // Load theo mode hiện tại
      if (gameState.gameMode === 'sentence') {
        if (btnModeSentence) btnModeSentence.classList.add('active');
        if (btnModeWord) btnModeWord.classList.remove('active');
        loadSentence();
      } else {
        if (btnModeWord) btnModeWord.classList.add('active');
        if (btnModeSentence) btnModeSentence.classList.remove('active');
        loadWord();
      }
    }

    var btnHint = document.getElementById('btnHint');
    if (btnHint) {
      btnHint.onclick = function () {
        playSound('click');
        var emptySlot = document.querySelector('.letter-slot.empty');
        if (emptySlot) {
          var char = emptySlot.getAttribute('data-char');
          beeSay('Gợi ý: Chữ tiếp theo là "' + char + '"', 3000);
          speakVietnamese(char);

          var letters = document.querySelectorAll('.draggable-letter');
          for (var i = 0; i < letters.length; i++) {
            var l = letters[i];
            if (l.getAttribute('data-char') === char && !l.classList.contains('used')) {
              l.style.transform = 'scale(1.4)';
              l.style.boxShadow = '0 0 25px #FF6B6B';
              setTimeout((function (letter) {
                return function () {
                  letter.style.transform = '';
                  letter.style.boxShadow = '';
                };
              })(l), 2000);
            }
          }
        }
      };
    }

    var btnSpeak = document.getElementById('btnSpeak');
    if (btnSpeak) {
      btnSpeak.onclick = function () {
        playSound('click');
        if (currentWord) speakVietnamese(currentWord.label);
      };
    }

    var btnSkip = document.getElementById('btnSkip');
    if (btnSkip) {
      btnSkip.onclick = function () {
        playSound('click');
        nextWord();
      };
    }

    var btnExitLesson = document.getElementById('btnExitLesson');
    if (btnExitLesson) {
      btnExitLesson.onclick = function () {
        if (confirm('Thoát bài học và về trang chủ?')) {
          playSound('click');
          gameState.customLesson = null;
          gameState.customLessonIndex = 0;
          saveGame();
          showPage('home');
        }
      };
    }
  }

  function initProfilePage() {
    console.log('Init profile page');
    var profileAvatar = document.getElementById('profileAvatar');
    var profileName = document.getElementById('profileName');
    var statWords = document.getElementById('statWords');
    var statStars = document.getElementById('statStars');
    var statBadges = document.getElementById('statBadges');

    if (profileAvatar) profileAvatar.textContent = gameState.playerAvatar;
    if (profileName) profileName.textContent = gameState.playerName;
    if (statWords) statWords.textContent = gameState.wordsLearned.length;
    if (statStars) statStars.textContent = gameState.totalStars;
    if (statBadges) statBadges.textContent = Math.floor(gameState.wordsLearned.length / 5);

    var badgesRow = document.getElementById('badgesRow');
    if (badgesRow) {
      badgesRow.innerHTML = '';
      var badgeIcons = ['🌟', '🏅', '🏆', '👑', '💎', '🎖️'];
      for (var i = 0; i < badgeIcons.length; i++) {
        var badge = document.createElement('div');
        badge.className = 'badge-item' + (gameState.wordsLearned.length >= (i + 1) * 5 ? '' : ' locked');
        badge.textContent = badgeIcons[i];
        badgesRow.appendChild(badge);
      }
    }

    var learnedWordsGrid = document.getElementById('learnedWordsGrid');
    if (learnedWordsGrid) {
      learnedWordsGrid.innerHTML = '';
      if (gameState.wordsLearned.length === 0) {
        learnedWordsGrid.innerHTML = '<p style="color:#888">Bé chưa học từ nào!</p>';
      } else {
        var recentWords = gameState.wordsLearned.slice(-20);
        for (var i = 0; i < recentWords.length; i++) {
          var word = recentWords[i];
          var w = document.createElement('span');
          w.className = 'learned-word';
          w.textContent = word;
          w.onclick = (function (text) {
            return function () { speakVietnamese(text); };
          })(word);
          learnedWordsGrid.appendChild(w);
        }
      }
    }

    var stickersRow = document.getElementById('stickersRow');
    if (stickersRow) {
      stickersRow.innerHTML = '';
      if (gameState.stickers.length === 0) {
        stickersRow.innerHTML = '<p style="color:#888">Gom đủ 10 sao để nhận sticker!</p>';
      } else {
        for (var i = 0; i < gameState.stickers.length; i++) {
          var st = document.createElement('div');
          st.className = 'sticker-item';
          st.textContent = gameState.stickers[i];
          stickersRow.appendChild(st);
        }
      }
    }
  }

  function initParentPage() {
    console.log('Init parent page');
    var parentWords = document.getElementById('parentWords');
    var parentTime = document.getElementById('parentTime');
    var parentAccuracy = document.getElementById('parentAccuracy');
    var parentMaxLevel = document.getElementById('parentMaxLevel');

    if (parentWords) parentWords.textContent = gameState.wordsLearned.length;
    if (parentTime) parentTime.textContent = '~';
    if (parentAccuracy) parentAccuracy.textContent = '~';

    var maxLevel = 1;
    for (var i = 0; i < gameState.wordsLearned.length; i++) {
      var w = gameState.wordsLearned[i];
      for (var j = 0; j < wordData.level2.length; j++) {
        if (wordData.level2[j].word === w) { maxLevel = 2; break; }
      }
      for (var j = 0; j < wordData.level3.length; j++) {
        if (wordData.level3[j].word === w) { maxLevel = 3; break; }
      }
    }
    if (parentMaxLevel) parentMaxLevel.textContent = maxLevel;

    var volumeSlider = document.getElementById('volumeSlider');
    var volumeValue = document.getElementById('volumeValue');
    if (volumeSlider) {
      volumeSlider.value = gameState.settings.volume;
      if (volumeValue) volumeValue.textContent = gameState.settings.volume + '%';

      volumeSlider.oninput = function () {
        gameState.settings.volume = parseInt(volumeSlider.value);
        if (volumeValue) volumeValue.textContent = gameState.settings.volume + '%';
        saveGame();
      };
    }

    var btnResetProgress = document.getElementById('btnResetProgress');
    if (btnResetProgress) {
      btnResetProgress.onclick = function () {
        if (confirm('Đặt lại toàn bộ tiến độ?')) {
          gameState.totalStars = 0;
          gameState.wordsLearned = [];
          gameState.stickers = [];
          gameState.currentWordIndex = 0;
          saveGame();
          initParentPage();
          updateNavInfo();
          beeSay('Đã đặt lại!');
        }
      };
    }

    // Render themes
    renderThemes();
  }

  function renderThemes() {
    var themesGrid = document.getElementById('themesGrid');
    if (!themesGrid || !window.WordThemes) return;

    themesGrid.innerHTML = '';

    for (var themeKey in window.WordThemes) {
      var theme = window.WordThemes[themeKey];
      var totalWords = (theme.level1 ? theme.level1.length : 0) +
        (theme.level2 ? theme.level2.length : 0) +
        (theme.level3 ? theme.level3.length : 0);

      var card = document.createElement('div');
      card.className = 'theme-card' + (gameState.currentTheme === themeKey ? ' active' : '');
      card.setAttribute('data-theme', themeKey);
      card.innerHTML = '<span class="theme-icon">' + theme.icon + '</span>' +
        '<span class="theme-name">' + theme.name + '</span>' +
        '<span class="theme-count">' + totalWords + ' từ</span>';

      card.onclick = (function (key) {
        return function () {
          gameState.currentTheme = key;
          gameState.currentWordIndex = 0;
          saveGame();
          playSound('click');
          beeSay('Đã chọn chủ đề: ' + window.WordThemes[key].name + '! 🎉', 2000);
          renderThemes();
        };
      })(themeKey);

      themesGrid.appendChild(card);
    }
  }

  // ========== SHOP PAGE ==========
  function initShopPage() {
    console.log('Init shop page');

    var shopCoins = document.getElementById('shopCoins');
    var shopStars = document.getElementById('shopStars');
    if (shopCoins) shopCoins.textContent = gameState.coins;
    if (shopStars) shopStars.textContent = gameState.totalStars;

    renderShopCategories();
    renderShopItems('all');
  }

  function renderShopCategories() {
    var container = document.getElementById('shopCategories');
    if (!container || !window.ShopData) return;

    container.innerHTML = '';

    // Nút "Tất cả"
    var allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.innerHTML = '<span>🛍️</span> Tất cả';
    allBtn.onclick = function () {
      document.querySelectorAll('.category-btn').forEach(function (b) { b.classList.remove('active'); });
      allBtn.classList.add('active');
      renderShopItems('all');
    };
    container.appendChild(allBtn);

    // Các category
    for (var catKey in window.ShopData.categories) {
      var cat = window.ShopData.categories[catKey];
      var btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.innerHTML = '<span>' + cat.icon + '</span> ' + cat.name;
      btn.onclick = (function (key) {
        return function () {
          document.querySelectorAll('.category-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          renderShopItems(key);
        };
      })(catKey);
      container.appendChild(btn);
    }
  }

  function renderShopItems(category) {
    var container = document.getElementById('shopItemsGrid');
    if (!container || !window.ShopData) return;

    container.innerHTML = '';

    var items = window.ShopData.items;
    if (category !== 'all') {
      items = items.filter(function (item) { return item.category === category; });
    }

    items.forEach(function (item) {
      var itemEl = document.createElement('div');
      var isOwned = gameState.ownedCharacters.indexOf(item.icon) !== -1;
      var canAfford = gameState.coins >= item.price;

      itemEl.className = 'shop-item';
      if (isOwned) itemEl.classList.add('owned');
      if (!canAfford && !isOwned) itemEl.classList.add('locked');

      itemEl.innerHTML =
        '<div class="shop-item-icon">' + item.icon + '</div>' +
        '<div class="shop-item-name">' + item.name + '</div>' +
        '<div class="shop-item-price">' +
        (isOwned ? 'Đã có ✓' : (item.price === 0 ? 'Miễn phí' : item.price + ' xu 🪙')) +
        '</div>';

      if (!isOwned && canAfford) {
        itemEl.onclick = function () {
          buyItem(item);
        };
      } else if (!isOwned && !canAfford) {
        itemEl.onclick = function () {
          beeSay('Chưa đủ xu! Cần ' + item.price + ' xu. Làm thêm câu nhé! 💪', 3000);
          playSound('wrong');
        };
      }

      container.appendChild(itemEl);
    });
  }

  function buyItem(item) {
    if (gameState.coins >= item.price && gameState.ownedCharacters.indexOf(item.icon) === -1) {
      gameState.coins -= item.price;
      gameState.ownedCharacters.push(item.icon);
      saveGame();
      updateNavInfo();

      playSound('success');
      beeSay('Đã mua ' + item.name + '! 🎉 Vào Hồ sơ để đổi avatar!', 3000);

      // Refresh shop
      var shopCoins = document.getElementById('shopCoins');
      if (shopCoins) shopCoins.textContent = gameState.coins;

      // Re-render current category
      var activeBtn = document.querySelector('.category-btn.active');
      var currentCategory = 'all';
      if (activeBtn && !activeBtn.textContent.includes('Tất cả')) {
        for (var key in window.ShopData.categories) {
          if (activeBtn.textContent.includes(window.ShopData.categories[key].name)) {
            currentCategory = key;
            break;
          }
        }
      }
      renderShopItems(currentCategory);
    }
  }

  function initTreasure() {
    var stickerPicks = document.querySelectorAll('.sticker-pick');
    for (var i = 0; i < stickerPicks.length; i++) {
      var btn = stickerPicks[i];
      btn.onclick = (function (button) {
        return function () {
          var sticker = button.getAttribute('data-sticker');
          if (gameState.stickers.indexOf(sticker) === -1) {
            gameState.stickers.push(sticker);
            saveGame();
          }
          beeSay('Bé nhận được ' + sticker + '! 🎉', 3000);
          var treasureModal = document.getElementById('treasureModal');
          if (treasureModal) treasureModal.classList.remove('show');
          playSound('success');
        };
      })(btn);
    }
  }

  // ========== SETUP ==========
  function setupGlobalListeners() {
    console.log('Setting up listeners');

    // Navigation
    var navItems = document.querySelectorAll('.nav-item');
    for (var i = 0; i < navItems.length; i++) {
      var item = navItems[i];
      item.onclick = (function (navItem) {
        return function () {
          playSound('click');
          showPage(navItem.getAttribute('data-page'));
        };
      })(item);
    }

    // Start game button
    var btnStartGame = document.getElementById('btnStartGame');
    if (btnStartGame) {
      btnStartGame.onclick = function () {
        playSound('click');
        beeSay('Chúng ta cùng học nào! 🎉');
        setTimeout(function () { showPage('play'); }, 500);
      };
    }

    // Bee mascot
    var beeMascot = document.getElementById('beeMascot');
    if (beeMascot) {
      beeMascot.onclick = function () {
        var msgs = ['Chào bé yêu! 🌸', 'Bé giỏi lắm! ⭐', 'Cùng học chữ nào! 📚', 'Cố lên nào! 💪'];
        var msg = msgs[Math.floor(Math.random() * msgs.length)];
        beeSay(msg);
        speakVietnamese(msg.replace(/[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi, ''));
      };
    }

    // Global drag listeners
    document.addEventListener('mousemove', handleDragMove, false);
    document.addEventListener('mouseup', handleDragEnd, false);
    document.addEventListener('touchmove', handleDragMove, false);
    document.addEventListener('touchend', handleDragEnd, false);
    document.addEventListener('touchcancel', handleDragEnd, false);

    document.addEventListener('mousedown', function (e) {
      if (e.target.classList.contains('draggable-letter')) {
        handleDragStart(e);
      }
    });

    document.addEventListener('touchstart', function (e) {
      if (e.target.classList.contains('draggable-letter')) {
        handleDragStart(e);
      }
    }, false);

    console.log('Listeners ready');
  }

  // ========== INIT ==========
  function init() {
    console.log('🎉 DOM loaded!');

    loadGame();
    setupGlobalListeners();
    initTreasure();
    createFloatingIcons();
    showPage('home');

    setTimeout(function () {
      beeSay('Chào bé yêu! Hôm nay mình cùng ghép chữ nào! 🌈', 4000);
      speakVietnamese('Chào bé yêu!');
    }, 1000);

    console.log('✅ Gamestva ready!');
  }

  // ========== FLOATING ICONS ==========
  function createFloatingIcons() {
    var container = document.createElement('div');
    container.className = 'floating-icons';
    document.body.appendChild(container);

    var icons = ['⭐', '🌟', '✨', '💫', '🎈', '🎨', '🌈', '🦋', '🌸', '🍀'];

    for (var i = 0; i < 15; i++) {
      var icon = document.createElement('div');
      icon.className = 'floating-icon';
      icon.textContent = icons[Math.floor(Math.random() * icons.length)];
      icon.style.left = Math.random() * 100 + '%';
      icon.style.animationDelay = Math.random() * 15 + 's';
      icon.style.animationDuration = (15 + Math.random() * 10) + 's';
      container.appendChild(icon);
    }
  }

  // Export functions for external use
  window.showPage = showPage;
  window.saveGame = saveGame;
  window.gameState = gameState;

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

console.log('✅ Main.js loaded');
