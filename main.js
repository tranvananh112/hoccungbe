// ========================================
// HỌC ĐỌC - ĐÁNH VẦN GAMESTVA
// Main JavaScript - Version đơn giản, chắc chắn hoạt động
// ========================================

(function () {
  'use strict';

  console.log('🐝 Gamestva loading...');

  // ========== GLOBAL HELPER: FORCE ENABLE SCROLL ==========
  // Helper function để force enable scroll sau khi đóng modal
  window.forceEnableScrollGlobal = function () {
    try {
      // Force enable scroll immediately
      document.body.style.setProperty('overflow-y', 'visible', 'important');
      document.body.style.setProperty('touch-action', 'pan-y pinch-zoom', 'important');
      document.documentElement.style.setProperty('overflow-y', 'visible', 'important');

      // Call global scroll fix if available
      if (window.SCROLL_FIX && window.SCROLL_FIX.forceEnable) {
        setTimeout(function () {
          window.SCROLL_FIX.forceEnable();
          console.log('✅ Scroll re-enabled globally');
        }, 100);
      }
    } catch (e) {
      console.error('Error forcing scroll:', e);
    }
  };

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
    settings: { volume: 80 },
    sentencesCompleted: {}, // Theo dõi câu đã làm: { "sentence_text": timestamp }
    wordsCompleted: {} // Theo dõi từ đã làm: { "word_text": timestamp }
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
      // Cleanup: Xóa các câu/từ đã làm quá 24 giờ để tiết kiệm bộ nhớ
      cleanupOldCompletions();
      localStorage.setItem('gamestva', JSON.stringify(gameState));

      // Trigger sync lên Supabase (nếu có)
      if (window.SyncManager && window.SyncManager.sync) {
        // Debounce: chỉ sync sau 5 giây không có thay đổi
        clearTimeout(window.syncTimeout);
        window.syncTimeout = setTimeout(function () {
          window.SyncManager.sync();
        }, 5000);
      }
    } catch (e) { console.error('Save error:', e); }
  }

  function cleanupOldCompletions() {
    var now = Date.now();
    var DAY_MS = 24 * 60 * 60 * 1000;

    // Cleanup sentences
    for (var key in gameState.sentencesCompleted) {
      if (now - gameState.sentencesCompleted[key] > DAY_MS) {
        delete gameState.sentencesCompleted[key];
      }
    }

    // Cleanup words
    for (var key in gameState.wordsCompleted) {
      if (now - gameState.wordsCompleted[key] > DAY_MS) {
        delete gameState.wordsCompleted[key];
      }
    }
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

  function speakVietnamese(text, priority, callback) {
    if (!text) return;
    var vol = gameState.settings.volume / 100;

    if (priority && currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    // ✅ ƯU TIÊN: Dùng Web Speech API (hoạt động trên mọi thiết bị)
    // Giọng Microsoft Edge nữ Việt Nam sẽ được ưu tiên
    useBrowserTTS(text, vol, callback);
  }

  // Kiểm tra TTS có khả dụng không
  function checkTTSAvailability() {
    if (window.speechSynthesis) {
      console.log('✅ Hệ thống giọng đọc: Google tiếng Việt');

      // Đợi voices load xong
      setTimeout(function () {
        if (preferredVoice) {
          console.log('🎤 Giọng:', preferredVoice.name);
          console.log('⚡ Tốc độ: Bình thường (1.0x)');
          console.log('💝 Giọng nữ Việt Nam');
        } else {
          console.error('❌ KHÔNG TÌM THẤY GIỌNG VIỆT!');
        }
      }, 1000);
    } else {
      console.error('❌ Trình duyệt không hỗ trợ Web Speech API');
    }
  }

  // Fallback: Sử dụng Web Speech API của trình duyệt
  var cachedVoices = [];
  var preferredVoice = null;

  function loadVoices() {
    if (window.speechSynthesis) {
      cachedVoices = window.speechSynthesis.getVoices();
      if (cachedVoices.length > 0) {
        // ✅ ƯU TIÊN 1: Microsoft Hoa (giọng cô gái Edge - TỐT NHẤT!)
        preferredVoice = cachedVoices.find(function (v) {
          return (v.name.includes('Microsoft Hoa') || v.name.includes('Hoa')) && v.lang.startsWith('vi');
        });

        if (preferredVoice) {
          console.log('✅ Giọng chính (Microsoft Hoa):', preferredVoice.name);
        } else {
          // ✅ ƯU TIÊN 2: Bất kỳ giọng Microsoft tiếng Việt
          preferredVoice = cachedVoices.find(function (v) {
            return v.name.includes('Microsoft') && v.lang.startsWith('vi');
          });

          if (preferredVoice) {
            console.log('✅ Giọng Microsoft:', preferredVoice.name);
          } else {
            // ✅ ƯU TIÊN 3: Google tiếng Việt
            preferredVoice = cachedVoices.find(function (v) {
              return v.name.includes('Google') && v.lang.startsWith('vi');
            });

            if (preferredVoice) {
              console.log('⚠️ Giọng Google:', preferredVoice.name);
            } else {
              // Fallback: Tìm giọng Việt bất kỳ
              preferredVoice = cachedVoices.find(function (v) {
                return v.lang.startsWith('vi');
              });
              if (preferredVoice) {
                console.log('⚠️ Dùng giọng Việt:', preferredVoice.name);
              }
            }
          }
        }
      }
    }
  }

  // Load voices khi có sẵn
  if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
    // Thử load lại sau 500ms (một số browser cần thời gian)
    setTimeout(loadVoices, 500);
  }

  // ✅ HÀM XỬ LÝ VÀ CẢI THIỆN VĂN BẢN cho trẻ em
  function enhanceTextForKids(text) {
    if (!text) return text;

    // Loại bỏ khoảng trắng thừa
    text = text.trim();

    // Nếu là từ đơn (không có khoảng trắng), giữ nguyên
    if (!text.includes(' ')) {
      return text;
    }

    // Nếu là câu hoặc cụm từ, thêm khoảng dừng nhẹ giữa các từ
    // Dùng dấu phẩy để tạo khoảng dừng tự nhiên
    var words = text.split(' ');

    // Với câu ngắn (2-3 từ): thêm dấu phẩy giữa các từ
    if (words.length <= 3) {
      return words.join(', ');
    }

    // Với câu dài hơn: thêm dấu phẩy sau mỗi 2 từ
    var enhanced = [];
    for (var i = 0; i < words.length; i++) {
      enhanced.push(words[i]);
      // Thêm dấu phẩy sau mỗi 2 từ (trừ từ cuối)
      if ((i + 1) % 2 === 0 && i < words.length - 1) {
        enhanced.push(',');
      }
    }

    return enhanced.join(' ');
  }

  function useBrowserTTS(text, volume, callback) {
    if (!window.speechSynthesis) {
      console.error('Trình duyệt không hỗ trợ Web Speech API');
      if (callback) callback();
      return;
    }

    // ✅ Đảm bảo voices đã được load TRƯỚC
    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices();
      if (cachedVoices.length > 0 && !preferredVoice) {
        loadVoices();
      }
    }

    // ✅ Dừng speech hiện tại để phát mới NGAY
    window.speechSynthesis.cancel();

    // ✅ CẢI THIỆN VĂN BẢN - thêm khoảng dừng tự nhiên
    var enhancedText = enhanceTextForKids(text);
    console.log('🎯 Text gốc:', text);
    console.log('✨ Text cải thiện:', enhancedText);

    var utterance = new SpeechSynthesisUtterance(enhancedText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9; // TỐC ĐỘ VỪA PHẢI - không quá chậm nhưng rõ ràng
    utterance.pitch = 1.5; // GIỌNG TRẺ EM - cao hơn, dễ thương hơn
    utterance.volume = 1.0; // ÂM LƯỢNG TỐI ĐA

    // Sử dụng giọng đã tìm được
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else {
      console.warn('⚠️ Không tìm thấy giọng Việt, dùng giọng mặc định');
    }

    // ✅ Callback khi đọc xong
    if (callback) {
      utterance.onend = function () {
        console.log('✅ Đã đọc xong:', text);
        callback();
      };
      utterance.onerror = function (e) {
        // Chỉ log lỗi nếu không phải 'interrupted'
        if (e.error !== 'interrupted') {
          console.error('❌ Lỗi đọc:', e);
        }
        callback();
      };
    }

    // ✅ Phát NGAY không delay
    window.speechSynthesis.speak(utterance);
  }

  var letterSoundInterval = null;
  var currentLetterUtterance = null;

  function startLetterSound(letter) {
    stopLetterSound();

    console.log('🔊 Bắt đầu đọc LIÊN TỤC NGAY:', letter);

    // ✅ Chuyển chữ cái thành phát âm TỰ NHIÊN tiếng Việt
    var pronunciation = getLetterPronunciation(letter);

    // Đánh dấu đang phát TRƯỚC KHI bắt đầu
    letterSoundInterval = true;

    // ✅ Phát âm LIÊN TỤC với giọng trẻ em
    function speakLetterLoop() {
      if (!window.speechSynthesis) {
        console.log('❌ speechSynthesis không khả dụng');
        return;
      }
      if (!letterSoundInterval) {
        console.log('⏹️ Đã dừng loop');
        return;
      }

      var utterance = new SpeechSynthesisUtterance(pronunciation);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0; // TỐC ĐỘ VỪA PHẢI - rõ ràng, không quá chậm
      utterance.pitch = 1.5; // GIỌNG TRẺ EM - cao hơn, dễ thương hơn
      utterance.volume = 1.0; // ÂM LƯỢNG TỐI ĐA

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Khi kết thúc, phát lại NGAY KHÔNG DELAY
      utterance.onend = function () {
        console.log('🔄 Lặp lại:', pronunciation);
        if (letterSoundInterval) {
          // Phát lại NGAY LẬP TỨC không delay
          speakLetterLoop();
        }
      };

      utterance.onerror = function (e) {
        // Chỉ log lỗi nếu không phải 'interrupted' (lỗi bình thường khi user tương tác nhanh)
        if (e.error !== 'interrupted') {
          console.error('❌ Lỗi phát âm:', e);
        }
      };

      currentLetterUtterance = utterance;
      console.log('▶️ Phát âm:', pronunciation);
      window.speechSynthesis.speak(utterance);
    }

    // ✅ Đảm bảo speech synthesis đang hoạt động
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Phát âm NGAY LẬP TỨC
    speakLetterLoop();
  }

  // ✅ Chuyển chữ cái thành cách đọc TỰ NHIÊN tiếng Việt
  function getLetterPronunciation(letter) {
    var upper = letter.toUpperCase();

    // Bảng phát âm chữ cái tiếng Việt - RÚT NGẮN để đọc nhanh đồng đều
    var pronunciationMap = {
      'A': 'a', 'Ă': 'ă', 'Â': 'â',
      'B': 'bờ', 'C': 'cờ', 'D': 'dờ', 'Đ': 'đờ',
      'E': 'e', 'Ê': 'ê',
      'G': 'gờ', 'H': 'hờ', 'I': 'i',  // "hát" → "hờ" để nhanh hơn
      'K': 'cờ', 'L': 'lờ', 'M': 'mờ', 'N': 'nờ',  // "ca" → "cờ" để đồng đều
      'O': 'o', 'Ô': 'ô', 'Ơ': 'ơ',
      'P': 'pờ', 'Q': 'cờ', 'R': 'rờ', 'S': 'sờ', 'T': 'tờ',  // "quy" → "cờ" để nhanh
      'U': 'u', 'Ư': 'ư',
      'V': 'vờ', 'X': 'xờ', 'Y': 'i'  // "y" → "i" để đồng đều
    };

    return pronunciationMap[upper] || letter;
  }

  function stopLetterSound() {
    console.log('⏹️ Dừng đọc chữ');

    // ✅ Dừng flag TRƯỚC để ngăn loop tiếp tục
    letterSoundInterval = null;

    // ✅ Clear utterance callback TRƯỚC
    if (currentLetterUtterance) {
      currentLetterUtterance.onend = null;
      currentLetterUtterance = null;
    }

    // ✅ Dừng speech CUỐI CÙNG
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // ✅ Dừng audio cũ (nếu có)
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

    // Thêm animation cho bee icon
    var beeIcon = document.querySelector('.bee-character');
    if (beeIcon) {
      beeIcon.classList.add('icon-bounce');
      setTimeout(function () {
        beeIcon.classList.remove('icon-bounce');
      }, 600);
    }

    setTimeout(function () {
      speech.classList.remove('show');
    }, duration || 3000);
  }

  // Hàm thêm animation cho icon
  function animateIcon(elementId, animationClass) {
    var element = document.getElementById(elementId);
    if (!element) return;

    // Tìm parent có class nav-info-item hoặc chính element
    var target = element.closest('.nav-info-item') || element;

    target.classList.add(animationClass);
    setTimeout(function () {
      target.classList.remove(animationClass);
    }, 1500);
  }

  function updateNavInfo() {
    var navStars = document.getElementById('navStars');
    var navCoins = document.getElementById('navCoins');
    var navAvatar = document.getElementById('navAvatar');
    if (navStars) navStars.textContent = gameState.totalStars;
    if (navCoins) navCoins.textContent = gameState.coins;
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

  // ========== HIỆU ỨNG VỖ TAY CHÚC MỪNG ==========
  function createClappingHands(container) {
    if (!container) return;

    // Tạo 4 bàn tay vỗ ở 4 góc
    var positions = [
      { top: '20%', left: '15%', delay: '0s' },
      { top: '25%', right: '15%', delay: '0.2s' },
      { top: '60%', left: '10%', delay: '0.4s' },
      { top: '65%', right: '10%', delay: '0.6s' }
    ];

    positions.forEach(function (pos) {
      var hand = document.createElement('div');
      hand.className = 'clapping-hands';
      hand.textContent = '👏';
      hand.style.cssText = 'position:absolute;font-size:4em;animation:clap 0.5s ease-in-out infinite;' +
        'filter:drop-shadow(2px 2px 4px rgba(0,0,0,0.3));z-index:10;' +
        'top:' + (pos.top || 'auto') + ';' +
        'left:' + (pos.left || 'auto') + ';' +
        'right:' + (pos.right || 'auto') + ';' +
        'animation-delay:' + pos.delay + ';';
      container.appendChild(hand);
    });
  }

  function createFloatingClaps(container) {
    if (!container) return;

    // Tạo 3-5 emoji vỗ tay bay lên ngẫu nhiên
    var count = Math.floor(Math.random() * 3) + 3;
    for (var i = 0; i < count; i++) {
      setTimeout(function () {
        var clap = document.createElement('div');
        clap.className = 'floating-clap';
        clap.textContent = '👏';
        clap.style.cssText = 'position:absolute;font-size:3em;' +
          'animation:clapFloat 2s ease-out forwards;pointer-events:none;' +
          'left:' + (Math.random() * 80 + 10) + '%;' +
          'top:' + (Math.random() * 60 + 20) + '%;';
        container.appendChild(clap);

        setTimeout(function () {
          clap.remove();
        }, 2000);
      }, i * 150);
    }
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
    // ✅ Tăng kích thước để dễ nhìn khi kéo: 70px → 90px
    dragClone.style.cssText = 'position:fixed;left:' + (pos.x - 45) + 'px;top:' + (pos.y - 45) + 'px;width:90px;height:90px;z-index:10000;pointer-events:none;';
    document.body.appendChild(dragClone);

    target.classList.add('dragging-source');
    playSound('click');

    // ✅ ĐỌC NGAY chữ cái khi ấn vào và LẶP LẠI LIÊN TỤC khi kéo
    var char = target.getAttribute('data-char');
    console.log('🎯 Ấn vào chữ:', char);
    startLetterSound(char);
  }

  function handleDragMove(e) {
    if (!isDragging || !dragClone) return;
    e.preventDefault();

    var pos = getClientPos(e);
    // ✅ Cập nhật offset cho kích thước mới (90px / 2 = 45px)
    dragClone.style.left = (pos.x - 45) + 'px';
    dragClone.style.top = (pos.y - 45) + 'px';

    dragClone.style.display = 'none';
    var elemBelow = document.elementFromPoint(pos.x, pos.y);
    dragClone.style.display = '';

    // ✅ Xóa highlight và scale cũ
    var highlights = document.querySelectorAll('.letter-slot.highlight');
    for (var i = 0; i < highlights.length; i++) {
      highlights[i].classList.remove('highlight');
      highlights[i].style.transform = ''; // Reset scale
    }

    // ✅ Thêm highlight và PHÓNG TO ô khi kéo vào gần
    if (elemBelow && elemBelow.classList.contains('letter-slot') && elemBelow.classList.contains('empty')) {
      elemBelow.classList.add('highlight');
      elemBelow.style.transform = 'scale(1.3)'; // Phóng to 1.3 lần
      elemBelow.style.transition = 'transform 0.2s ease';
    }
  }

  function handleDragEnd(e) {
    if (!isDragging) return;
    e.preventDefault();

    // ✅ DỪNG GIỌNG ĐỌC CHỮ CÁI NGAY LẬP TỨC
    stopLetterSound();

    // ✅ Reset scale của tất cả ô
    var allSlots = document.querySelectorAll('.letter-slot');
    for (var i = 0; i < allSlots.length; i++) {
      allSlots[i].style.transform = '';
    }

    var pos = getClientPos(e);
    if (dragClone) dragClone.style.display = 'none';
    var elemBelow = document.elementFromPoint(pos.x, pos.y);

    if (elemBelow && elemBelow.classList.contains('letter-slot') && elemBelow.classList.contains('empty')) {
      var draggedChar = dragElement.getAttribute('data-char');
      var expectedChar = elemBelow.getAttribute('data-char');

      if (draggedChar === expectedChar) {
        // ✅ ĐÚNG
        elemBelow.textContent = draggedChar;
        elemBelow.classList.remove('empty');
        elemBelow.classList.add('filled');
        dragElement.classList.add('used');
        dragElement.classList.remove('dragging-source');

        playSound('correct');

        // ✅ Khen với TÊN em bé
        var childName = gameState.playerName || 'bé';
        beeSay('Đúng rồi! ' + childName + ' giỏi quá! ⭐', 2000);

        // ✅ Delay nhỏ để đảm bảo stopLetterSound hoàn tất
        setTimeout(function () {
          speakVietnamese('Đúng rồi! ' + childName + ' giỏi lắm!', true);
        }, 100);

        checkWordComplete();
      } else {
        // ✅ SAI - shake ô đích
        playSound('wrong');
        var childName = gameState.playerName || 'bé';
        beeSay('Sai rồi, ' + childName + ' thử lại nhé! 💪', 2000);

        // ✅ Delay nhỏ để đảm bảo stopLetterSound hoàn tất
        setTimeout(function () {
          speakVietnamese('Sai rồi!', true);
        }, 100);

        // Reset chuỗi đúng khi sai
        gameState.streak = 0;

        // Animation khi sai - shake slot
        elemBelow.classList.add('icon-shake');
        setTimeout(function () {
          elemBelow.classList.remove('icon-shake');
        }, 500);

        if (dragElement) dragElement.classList.remove('dragging-source');
      }
    } else {
      // ✅ THẢ NGOÀI - không làm gì
      if (dragElement) dragElement.classList.remove('dragging-source');
    }

    // ✅ Cleanup
    var highlights = document.querySelectorAll('.letter-slot.highlight');
    for (var i = 0; i < highlights.length; i++) {
      highlights[i].classList.remove('highlight');
    }

    if (dragClone) {
      dragClone.remove();
      dragClone = null;
    }

    // ✅ Reset trạng thái
    isDragging = false;
    dragElement = null;
  }

  // ========== SMART SENTENCE BUILDER ==========
  function getSmartSentence(word, themeData) {
    var label = word.label.toLowerCase();
    var prefix = themeData && themeData.prefix ? themeData.prefix : 'Đây là';

    // ✅ Xử lý đặc biệt cho từng chủ đề
    var theme = gameState.currentTheme;

    // Động vật
    if (theme === 'animals') {
      if (label.startsWith('con ')) {
        return 'Đây là ' + label; // "Đây là con mèo"
      }
      return 'Đây là con ' + label; // "Đây là con mèo"
    }

    // Đồ vật - XỬ LÝ THÔNG MINH
    if (theme === 'objects') {
      // Đã có classifier
      if (label.startsWith('cái ') || label.startsWith('chiếc ') || label.startsWith('quả ') || label.startsWith('quyển ')) {
        return 'Đây là ' + label;
      }
      // Phương tiện
      if (label === 'xe') {
        return 'Đây là chiếc ' + label;
      }
      // Bóng
      if (label === 'bóng') {
        return 'Đây là quả ' + label;
      }
      // Sách
      if (label === 'sách') {
        return 'Đây là quyển ' + label;
      }
      // Nhà
      if (label === 'nhà') {
        return 'Đây là căn ' + label;
      }
      // Đồ vật thông thường
      return 'Đây là cái ' + label;
    }

    // Thức ăn - XỬ LÝ THÔNG MINH
    if (theme === 'food') {
      // Đã có classifier rồi
      if (label.startsWith('quả ') || label.startsWith('trái ') || label.startsWith('bát ') || label.startsWith('ly ') || label.startsWith('bánh ')) {
        return 'Đây là ' + label;
      }

      // Trái cây
      var fruits = ['cam', 'chuối', 'dưa', 'táo', 'xoài', 'ổi', 'mít', 'dừa', 'nho', 'lê', 'đào', 'mận'];
      for (var i = 0; i < fruits.length; i++) {
        if (label.includes(fruits[i])) {
          return 'Đây là trái ' + label;
        }
      }

      // Đồ uống
      if (label === 'sữa' || label === 'nước' || label.includes('nước')) {
        return 'Đây là ly ' + label;
      }

      // Món ăn mặc định
      return 'Đây là món ' + label;
    }

    // Giao thông - XỬ LÝ THÔNG MINH
    if (theme === 'transport') {
      // Đã có classifier
      if (label.startsWith('xe ') || label.startsWith('chiếc ') || label.startsWith('con ')) {
        return 'Đây là ' + label;
      }
      // Phương tiện đơn lẻ cần "chiếc"
      if (label === 'xe' || label === 'tàu' || label === 'thuyền') {
        return 'Đây là chiếc ' + label;
      }
      // Máy bay, xe đạp - không cần thêm
      if (label === 'máy bay' || label === 'xe đạp' || label === 'xe bus' || label === 'tàu hỏa') {
        return 'Đây là ' + label;
      }
      return 'Đây là ' + label;
    }

    // Thiên nhiên - XỬ LÝ THÔNG MINH
    if (theme === 'nature') {
      // Hoa
      if (label.includes('hoa')) {
        if (label.startsWith('hoa ')) return 'Đây là ' + label;
        return 'Đây là hoa ' + label;
      }
      // Cây
      if (label.includes('cây')) {
        if (label.startsWith('cây ')) return 'Đây là ' + label;
        return 'Đây là cây ' + label;
      }
      // Lá
      if (label.includes('lá')) {
        return 'Đây là ' + label;
      }
      // Thiên thể (mặt trời, mặt trăng, ngôi sao...)
      if (label.startsWith('mặt ') || label.startsWith('ngôi ') || label.startsWith('đám ') || label.startsWith('bầu ')) {
        return 'Đây là ' + label;
      }
      // Các yếu tố tự nhiên khác
      if (label === 'đất' || label === 'nước' || label === 'lửa' || label === 'gió') {
        return 'Đây là ' + label;
      }
      return prefix + ' ' + label;
    }

    // Thời tiết - XỬ LÝ THÔNG MINH
    if (theme === 'weather') {
      // Hiện tượng thời tiết đơn giản
      if (label === 'nắng' || label === 'mưa' || label === 'gió') {
        return 'Trời đang ' + label;
      }
      // Đã có "trời" rồi
      if (label.startsWith('trời ')) {
        return 'Đây là ' + label;
      }
      // Các hiện tượng khác
      if (label === 'mây' || label === 'sấm') {
        return 'Đây là ' + label;
      }
      if (label === 'sấm chớp' || label === 'cầu vồng') {
        return 'Đây là ' + label;
      }
      if (label.includes('gió')) {
        return 'Đây là ' + label;
      }
      return prefix + ' ' + label;
    }

    // Mặc định
    return prefix + ' ' + label;
  }

  // ========== SMART WORD SELECTION ==========
  function selectSmartWord(words) {
    var now = Date.now();
    var COOLDOWN_MS = 30 * 60 * 1000; // 30 phút không lặp lại
    var DAY_MS = 24 * 60 * 60 * 1000; // 1 ngày

    // Lọc bỏ câu/từ đã làm trong 30 phút gần đây
    var availableWords = [];
    var recentWords = [];

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var wordKey = word.word || word.sentence;

      // Kiểm tra xem đã làm gần đây chưa
      var completedTime = gameState.gameMode === 'sentence'
        ? gameState.sentencesCompleted[wordKey]
        : gameState.wordsCompleted[wordKey];

      if (completedTime && (now - completedTime) < COOLDOWN_MS) {
        // Đã làm trong 30 phút gần đây - bỏ qua
        recentWords.push(word);
        continue;
      }

      availableWords.push(word);
    }

    // Nếu không còn từ nào khả dụng, reset cooldown và dùng lại
    if (availableWords.length === 0) {
      console.log('⚠️ Đã hết từ mới, reset cooldown...');
      var childName = gameState.playerName || 'bé';
      beeSay(childName + ' đã làm hết rồi! Bây giờ làm lại để ôn bài nhé! 📚', 3000);
      availableWords = words;
      // Xóa các câu/từ đã làm để có thể làm lại
      if (gameState.gameMode === 'sentence') {
        gameState.sentencesCompleted = {};
      } else {
        gameState.wordsCompleted = {};
      }
    }

    // Phân loại từ khả dụng
    var newWords = [];
    var oldWords = [];

    for (var i = 0; i < availableWords.length; i++) {
      var word = availableWords[i];
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

    // Nếu không có từ nào, trả về từ đầu tiên
    return availableWords.length > 0 ? availableWords[0] : null;
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
    // ✨ Thêm loading class để fade out
    var gameDisplay = document.querySelector('.game-display');
    var wordSlots = document.getElementById('wordSlots');
    var lettersPool = document.getElementById('lettersPool');

    if (gameDisplay) gameDisplay.classList.add('loading');
    if (wordSlots) wordSlots.classList.add('loading');
    if (lettersPool) lettersPool.classList.add('loading');

    // ✅ Sử dụng requestAnimationFrame thay vì setTimeout (mượt hơn)
    requestAnimationFrame(function () {
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

      // ✨ Remove loading class ngay sau khi render
      requestAnimationFrame(function () {
        if (gameDisplay) gameDisplay.classList.remove('loading');
        if (wordSlots) wordSlots.classList.remove('loading');
        if (lettersPool) lettersPool.classList.remove('loading');
      });

      // ✅ Phát âm NGAY LẬP TỨC với prefix THÔNG MINH
      var sentence = getSmartSentence(currentWord, themeData);
      speakVietnamese(sentence);
    });
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

    // ✅ Phát âm NGAY LẬP TỨC
    speakVietnamese(displayText);
  }

  function renderSlots() {
    var container = document.getElementById('wordSlots');
    if (!container) return;

    // ✅ TỐI ƯU: Sử dụng DocumentFragment
    var fragment = document.createDocumentFragment();

    // Lấy text từ word hoặc sentence
    var text = currentWord.word || currentWord.sentence || '';
    var chars = text.split('');

    // ✅ Tạo tất cả elements trong fragment
    for (var i = 0; i < chars.length; i++) {
      var char = chars[i];
      if (char === ' ') {
        var space = document.createElement('div');
        space.className = 'letter-slot space';
        fragment.appendChild(space);
      } else {
        var slot = document.createElement('div');
        slot.className = 'letter-slot empty';
        slot.setAttribute('data-index', i);
        slot.setAttribute('data-char', char);
        slot.textContent = '?';
        fragment.appendChild(slot);
      }
    }

    // ✅ Clear và append 1 lần (giảm reflow)
    container.innerHTML = '';
    container.appendChild(fragment);
  }

  function renderLetters() {
    var container = document.getElementById('lettersPool');
    if (!container) return;

    // ✅ TỐI ƯU: Sử dụng DocumentFragment để giảm reflow
    var fragment = document.createDocumentFragment();

    // Lấy text từ word hoặc sentence
    var text = currentWord.word || currentWord.sentence || '';
    var wordChars = text.replace(/\s/g, '').split('');

    // ✅ CẤP 1: KHÔNG thêm chữ phụ, chỉ đúng số chữ cần điền
    var extras = [];
    if (gameState.currentLevel > 1) {
      extras = getRandomLetters(Math.min(2, wordChars.length));
    }

    var allChars = shuffle(wordChars.concat(extras));

    // ✅ Lấy kích thước TRƯỚC khi clear (tránh reflow)
    var containerWidth = container.clientWidth || 800;
    var containerHeight = container.clientHeight || 140;
    var letterSize = window.innerWidth < 768 ? 50 : 60;
    var padding = 15;
    var safeWidth = containerWidth - (padding * 2) - letterSize;
    var safeHeight = containerHeight - (padding * 2) - letterSize - 10;

    // ✅ Clear sau khi lấy kích thước
    container.innerHTML = '';

    // ✅ TỐI ƯU: Tạo tất cả elements trong fragment (1 lần reflow)
    var usedPositions = [];
    for (var i = 0; i < allChars.length; i++) {
      var char = allChars[i];
      var letter = document.createElement('div');
      letter.className = 'draggable-letter';
      letter.textContent = char;
      letter.setAttribute('data-char', char);

      // ✅ Tìm vị trí ngẫu nhiên
      var position = findRandomPosition(safeWidth, safeHeight, letterSize, usedPositions, padding);
      letter.style.left = position.x + 'px';
      letter.style.top = position.y + 'px';
      usedPositions.push(position);

      fragment.appendChild(letter);
    }

    // ✅ Append 1 lần duy nhất (giảm reflow)
    container.appendChild(fragment);
  }

  // ✅ Tìm vị trí ngẫu nhiên - RẢI NGANG GIỐNG BAN ĐẦU
  function findRandomPosition(maxWidth, maxHeight, size, usedPositions, padding) {
    var attempts = 0;
    var maxAttempts = 50;
    var minDistance = size + 10; // Khoảng cách tối thiểu giữa các chữ

    while (attempts < maxAttempts) {
      // Tạo vị trí ngẫu nhiên - RẢI NGANG (toàn bộ chiều rộng, CHỈ 40% chiều cao)
      var x = Math.random() * maxWidth + padding;
      var y = Math.random() * (maxHeight * 0.4) + padding;

      var valid = true;
      for (var i = 0; i < usedPositions.length; i++) {
        var dx = x - usedPositions[i].x;
        var dy = y - usedPositions[i].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          valid = false;
          break;
        }
      }

      if (valid) {
        return { x: x, y: y };
      }
      attempts++;
    }

    // Fallback: vị trí ngẫu nhiên rải ngang - CHỈ 40% chiều cao
    return {
      x: Math.random() * maxWidth + padding,
      y: Math.random() * (maxHeight * 0.4) + padding
    };
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

      // Animation cho star icon
      animateIcon('navStars', 'icon-pulse');
      animateIcon('navCoins', 'icon-bounce');

      // Tăng chuỗi đúng
      if (!gameState.streak) gameState.streak = 0;
      gameState.streak++;

      // Bonus xu cho chuỗi dài
      if (gameState.streak >= 5) {
        gameState.coins += 2; // Bonus 2 xu
        animateIcon('navCoins', 'icon-glow');
        beeSay('Chuỗi 5 câu! Bonus +2 xu! 🪙🪙', 2000);
      }

      // Đổi sao thành xu (10 sao = 5 xu)
      if (gameState.totalStars >= 10 && gameState.totalStars % 10 === 0) {
        gameState.coins += 5;
        animateIcon('navStars', 'icon-spin');
        animateIcon('navCoins', 'icon-glow');
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

        // ✅ LƯU TIMESTAMP ĐỂ TRÁNH LẶP LẠI NGAY
        var now = Date.now();
        if (gameState.gameMode === 'sentence') {
          gameState.sentencesCompleted[wordToSave] = now;
        } else {
          gameState.wordsCompleted[wordToSave] = now;
        }
      }
      saveGame();
      updateNavInfo();

      var gameStars = document.getElementById('gameStars');
      if (gameStars) gameStars.textContent = gameState.totalStars;

      // ✅ KHÔNG hiển thị success popup nữa - dùng celebration overlay
      createConfetti();
      playSound('success');

      // ✅ Câu khen NGAY với TÊN em bé - ĐỌC TO VÀ RÕ
      var childName = gameState.playerName || 'bé';
      var praises = [
        childName + ' giỏi lắm!',
        childName + ' tuyệt vời!',
        childName + ' làm đúng rồi!',
        childName + ' xuất sắc!',
        childName + ' hay lắm!'
      ];
      var randomPraise = praises[Math.floor(Math.random() * praises.length)];

      // Đọc câu khen và sau đó đọc lại từ/câu
      speakVietnamese(randomPraise, true, function () {
        // ✅ Đọc lại từ/câu SAU KHI KHEN XONG
        setTimeout(function () {
          if (gameState.gameMode === 'sentence') {
            speakVietnamese(currentWord.audio || currentWord.sentence);
          } else {
            var themeData = window.WordThemes && window.WordThemes[gameState.currentTheme];
            var sentence = getSmartSentence(currentWord, themeData);
            speakVietnamese(sentence);
          }
        }, 500);
      });

      if (window.GameAnimations) {
        window.GameAnimations.playCharacterAnimation(currentWord.image, currentWord.label);
      }

      if (gameState.totalStars > 0 && gameState.totalStars % 10 === 0) {
        setTimeout(function () {
          var treasureModal = document.getElementById('treasureModal');
          if (treasureModal) treasureModal.classList.add('show');
        }, 2500);
      }

      // ✅ HIỆU ỨNG CHUYỂN CÂU PHONG PHÚ
      showCelebrationTransition();
    }
  }

  function nextWord() {
    var successPopup = document.getElementById('successPopup');
    if (successPopup) successPopup.classList.remove('show');

    // Force enable scroll after closing popup
    forceEnableScrollGlobal();

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
        var childName = gameState.playerName || 'Bé';
        beeSay(childName + ' đã học hết câu trong chủ đề này! 🎉', 4000);
      }
      loadSentence();
    } else {
      var words = wordData['level' + gameState.currentLevel];
      if (gameState.currentWordIndex >= words.length) {
        gameState.currentWordIndex = 0;
        var childName = gameState.playerName || 'Bé';
        beeSay(childName + ' đã học hết cấp này! 🎉', 4000);
      }
      loadWord();
    }
  }

  // ========== CELEBRATION TRANSITION ==========
  function showCelebrationTransition() {
    // ✅ ẨN success popup cũ để không bị chồng
    var successPopup = document.getElementById('successPopup');
    if (successPopup) successPopup.classList.remove('show');

    // Force enable scroll after closing popup
    forceEnableScrollGlobal();

    var overlay = document.getElementById('celebrationOverlay');
    var title = document.getElementById('celebrationTitle');
    var animalsContainer = document.getElementById('celebrationAnimals');
    var message = document.getElementById('celebrationMessage');
    var timer = document.getElementById('countdownTimer');

    if (!overlay) return;

    // ✅ Nếu đang hiển thị, bỏ qua để không chồng
    if (overlay.classList.contains('show')) {
      console.log('⚠️ Celebration đang chạy, bỏ qua');
      return;
    }

    // Danh sách con vật ngẫu nhiên
    var animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈'];

    // Chọn 5 con vật ngẫu nhiên
    var selectedAnimals = [];
    for (var i = 0; i < 5; i++) {
      selectedAnimals.push(animals[Math.floor(Math.random() * animals.length)]);
    }

    // Cập nhật tiêu đề với TÊN em bé
    var completedWord = currentWord.word || currentWord.sentence;
    var childName = gameState.playerName || 'bé';
    if (title) title.textContent = '🎉 ' + completedWord + ' - ' + childName + ' giỏi lắm! 🎉';

    // Tạo con vật chạy
    animalsContainer.innerHTML = '';
    selectedAnimals.forEach(function (animal) {
      var animalEl = document.createElement('div');
      animalEl.className = 'celebration-animal';
      animalEl.textContent = animal;
      animalsContainer.appendChild(animalEl);
    });

    // ✅ THÊM HIỆU ỨNG VỖ TAY CHÚC MỪNG
    createClappingHands(overlay);

    // Hiển thị overlay
    overlay.classList.add('show');

    // ✅ Phát âm thanh VUI NHỘN
    if (window.SoundEffects) {
      window.SoundEffects.applause(0.5);
      setTimeout(function () {
        window.SoundEffects.cheer(0.4);
      }, 200);
      setTimeout(function () {
        window.SoundEffects.firework(0.4);
      }, 400);
      setTimeout(function () {
        window.SoundEffects.sparkle(0.3);
      }, 600);
    }

    // ✅ Phát tiếng động vật THẬT - nhiều lần
    if (window.AnimalSounds) {
      setTimeout(function () {
        window.AnimalSounds.playRandom();
      }, 100);
      setTimeout(function () {
        window.AnimalSounds.playRandom();
      }, 800);
    }

    // ✅ ĐỌC LẠI TỪ TO RÕ NGAY LẬP TỨC VÀ ĐỢI ĐỌC XONG
    setTimeout(function () {
      var wordToRead = currentWord.word || currentWord.sentence;
      var themeData = window.WordThemes && window.WordThemes[gameState.currentTheme];

      // Hàm bắt đầu countdown sau khi đọc xong
      var startCountdownAfterSpeech = function () {
        console.log('✅ Đã đọc xong, bắt đầu countdown...');

        // ✅ Đếm ngược 4 → 3 → 2 → 1 (sau khi đọc xong) - CHẬM HƠN để em bé thấy rõ
        var countdown = 4;
        timer.textContent = countdown;

        var countdownInterval = setInterval(function () {
          countdown--;
          if (countdown > 0) {
            timer.textContent = countdown;
            playSound('click');

            // Tạo hiệu ứng vỗ tay bay lên mỗi giây
            createFloatingClaps(overlay);
          } else {
            clearInterval(countdownInterval);
            // Ẩn overlay và chuyển câu
            overlay.classList.remove('show');

            // Delay nhỏ trước khi load câu mới
            setTimeout(function () {
              nextWord();
            }, 400);
          }
        }, 1000);
      };

      if (gameState.gameMode === 'sentence') {
        // Chế độ câu: đọc toàn bộ câu VÀ ĐỢI XONG
        speakVietnamese(currentWord.audio || wordToRead, true, startCountdownAfterSpeech);
      } else {
        // Chế độ từ: đọc với prefix THÔNG MINH VÀ ĐỢI XONG
        var sentence = getSmartSentence(currentWord, themeData);
        speakVietnamese(sentence, true, startCountdownAfterSpeech);
      }
    }, 500);
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

    // LỌC CÂU THEO CẤP ĐỘ
    var levelSentences = sentences.filter(function (s) {
      return s.level === gameState.currentLevel;
    });

    // Nếu không có câu cho cấp độ này, lấy tất cả
    if (levelSentences.length === 0) {
      levelSentences = sentences;
    }

    // CHỌN CÂU THÔNG MINH: Ưu tiên câu mới
    currentWord = selectSmartWord(levelSentences);
    if (!currentWord) {
      gameState.currentWordIndex = 0;
      currentWord = levelSentences[0];
    }

    console.log('Loading sentence (Level ' + gameState.currentLevel + '):', currentWord.sentence);

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

    // ✅ Phát âm NGAY LẬP TỨC
    speakVietnamese(currentWord.audio || currentWord.sentence);
  }

  function renderSentenceSlots() {
    var container = document.getElementById('wordSlots');
    if (!container) return;
    container.innerHTML = '';
    container.parentElement.classList.add('sentence-mode');

    var words = currentWord.sentence.split(' ');

    // Tạo bản sao của blanks để đếm từ trùng lặp
    var blanksToUse = currentWord.blanks.slice();

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var isBlank = false;

      // Kiểm tra xem từ này có trong danh sách blanks không
      var blankIndex = blanksToUse.indexOf(word);
      if (blankIndex !== -1) {
        isBlank = true;
        // Xóa từ đã dùng để xử lý từ trùng lặp đúng
        blanksToUse.splice(blankIndex, 1);
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

    // Lấy từ cần điền - GIỮ NGUYÊN TẤT CẢ KỂ CẢ TỪ TRÙNG LẶP
    var blanks = currentWord.blanks.slice();

    // Thêm từ nhiễu theo cấp độ
    var distractors = currentWord.distractors || [];
    var numDistractors = 0;

    // Cấp 1: KHÔNG có từ nhiễu
    if (gameState.currentLevel === 1) {
      numDistractors = 0;
    }
    // Cấp 2: 1-2 từ nhiễu
    else if (gameState.currentLevel === 2) {
      numDistractors = Math.min(2, distractors.length);
    }
    // Cấp 3: Nhiều từ nhiễu hơn
    else {
      numDistractors = Math.min(distractors.length, blanks.length);
    }

    // Thêm từ nhiễu vào danh sách
    var allWords = blanks.slice();
    for (var i = 0; i < numDistractors; i++) {
      if (distractors[i]) {
        allWords.push(distractors[i]);
      }
    }

    // Xáo trộn tất cả từ
    allWords = shuffle(allWords);

    // Render từng từ với index duy nhất để xử lý từ trùng lặp
    allWords.forEach(function (word, index) {
      var wordEl = document.createElement('div');
      wordEl.className = 'draggable-letter';
      wordEl.textContent = word;
      wordEl.dataset.char = word;
      wordEl.dataset.wordIndex = index; // Thêm index để phân biệt từ trùng lặp

      // Đánh dấu từ nhiễu (để debug, có thể bỏ)
      var isDistractor = distractors.indexOf(word) !== -1 && blanks.indexOf(word) === -1;
      if (isDistractor) {
        wordEl.dataset.distractor = 'true';
      }

      container.appendChild(wordEl);
    });

    console.log('Rendered words:', blanks.length, 'blanks +', numDistractors, 'distractors');
  }

  // ========== PAGE INITIALIZERS ==========
  function initHomePage() {
    console.log('Init home page');
    loadGame();

    // ✅ Fix emoji icons cho level badges
    var levelBadges = document.querySelectorAll('.level-badge');
    if (levelBadges[0]) levelBadges[0].textContent = '🌱';
    if (levelBadges[1]) levelBadges[1].textContent = '🌿';
    if (levelBadges[2]) levelBadges[2].textContent = '🌳';

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

          // Animation khi đổi avatar
          animateIcon('navAvatar', 'icon-spin');
          beeSay('Avatar mới đẹp quá! ' + gameState.playerAvatar, 2000);
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

    // ✅ Render themes trên trang chủ
    renderThemesHome();

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

  // ✅ Render themes trên trang chủ
  function renderThemesHome() {
    var container = document.getElementById('themesGridHome');
    var currentThemeName = document.getElementById('currentThemeName');
    var currentThemeIcon = document.getElementById('currentThemeIcon');

    if (!container || !window.WordThemes) return;

    container.innerHTML = '';

    // Cập nhật tên chủ đề hiện tại
    var currentTheme = window.WordThemes[gameState.currentTheme];
    if (currentTheme && currentThemeName && currentThemeIcon) {
      currentThemeName.textContent = currentTheme.name;
      currentThemeIcon.textContent = currentTheme.icon;
    }

    // Render tất cả themes
    for (var themeKey in window.WordThemes) {
      var theme = window.WordThemes[themeKey];
      var totalWords = (theme.level1 ? theme.level1.length : 0) +
        (theme.level2 ? theme.level2.length : 0) +
        (theme.level3 ? theme.level3.length : 0);

      var card = document.createElement('div');
      card.className = 'theme-card-home' + (gameState.currentTheme === themeKey ? ' active' : '');
      card.setAttribute('data-theme', themeKey);
      card.innerHTML = '<span class="theme-icon-home">' + theme.icon + '</span>' +
        '<div class="theme-name-home">' + theme.name + '</div>' +
        '<div class="theme-count-home">' + totalWords + ' từ</div>';

      card.onclick = (function (key) {
        return function () {
          gameState.currentTheme = key;
          gameState.currentWordIndex = 0;
          saveGame();
          playSound('click');
          beeSay('Đã chọn chủ đề: ' + window.WordThemes[key].name + '! 🎉', 2000);
          speakVietnamese('Chủ đề ' + window.WordThemes[key].name);
          renderThemesHome(); // Re-render để cập nhật active
        };
      })(themeKey);

      container.appendChild(card);
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

      // Animation khi mua
      animateIcon('shopCoins', 'icon-shake');
      animateIcon('navCoins', 'icon-shake');

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

          // Force enable scroll after closing modal
          forceEnableScrollGlobal();

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
        var childName = gameState.playerName || 'bé';
        beeSay(childName + ', chúng ta cùng học nào! 🎉');
        setTimeout(function () { showPage('play'); }, 500);
      };
    }

    // Bee mascot
    var beeMascot = document.getElementById('beeMascot');
    if (beeMascot) {
      beeMascot.onclick = function () {
        var msgs = ['Chào bé!', 'Xin chào!', 'Hello!', 'Hi bé!', 'Chúc bé học vui!'];
        var msg = msgs[Math.floor(Math.random() * msgs.length)];
        beeSay(msg);
        speakVietnamese(msg);
      };
    }

    // Global drag listeners
    document.addEventListener('mousemove', handleDragMove, false);
    document.addEventListener('mouseup', handleDragEnd, false);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd, false);
    document.addEventListener('touchcancel', handleDragEnd, false);

    document.addEventListener('mousedown', function (e) {
      if (e.target.classList.contains('draggable-letter')) {
        handleDragStart(e);
      }
    });

    document.addEventListener('touchstart', function (e) {
      if (e.target.classList.contains('draggable-letter') && !e.target.classList.contains('used')) {
        e.preventDefault(); // Prevent scroll while dragging
        handleDragStart(e);
      }
    }, { passive: false });

    console.log('Listeners ready');
  }

  // ========== INIT ==========
  async function init() {
    console.log('🎉 DOM loaded!');

    // Check authentication TRƯỚC - BẮT BUỘC
    try {
      await checkAuthentication();
      // Nếu đến đây = đã đăng nhập
      console.log('✅ Auth passed, loading game...');
    } catch (err) {
      console.error('Auth check failed:', err);
      // Redirect sang auth
      window.location.href = 'auth.html';
      return; // Dừng init
    }

    // ✅ PRELOAD voices NGAY để phản hồi nhanh
    loadVoices();
    setTimeout(loadVoices, 100);
    setTimeout(loadVoices, 500);

    loadGame();
    setupGlobalListeners();
    setupAudioUnlockButton();
    setupAudioWelcomeModal();
    initTreasure();
    createFloatingIcons();
    checkTTSAvailability();
    showPage('home');

    // Ẩn loading screen
    setTimeout(function () {
      var loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(function () {
          loadingScreen.remove();
        }, 500);
      }
    }, 500);

    // Hiện modal welcome nếu chưa unlock audio
    setTimeout(function () {
      if (window.AudioManager && !window.AudioManager.isUnlocked()) {
        var modal = document.getElementById('audioWelcomeModal');
        if (modal) modal.classList.add('show');
      } else {
        var childName = gameState.playerName || 'bé yêu';
        beeSay('Chào ' + childName + '! Hôm nay mình cùng ghép chữ nào! 🌈', 4000);
        speakVietnamese('Chào ' + childName + '!');
      }
    }, 1000);

    console.log('✅ Gamestva ready!');
  }

  // Check authentication - BẮT BUỘC ĐĂNG NHẬP
  async function checkAuthentication() {
    // Nếu Supabase chưa load, redirect ngay sang auth
    if (!window.SupabaseConfig) {
      console.log('⚠️ Supabase not loaded, redirecting to auth...');
      window.location.href = 'auth.html';
      return;
    }

    try {
      // Wait for Supabase to initialize
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = await window.SupabaseConfig.getCurrentUser();
      if (!user) {
        // Not logged in, redirect to auth page
        console.log('❌ Not authenticated, redirecting to auth...');
        window.location.href = 'auth.html';
        return; // Dừng execution
      } else {
        console.log('✅ User authenticated:', user.email);

        // Start session tracking nếu chưa có
        if (window.SupabaseConfig.startSession) {
          await window.SupabaseConfig.startSession();
          console.log('📊 Session tracking started');
        }

        // Load user progress from Supabase
        await loadUserProgressFromSupabase(user.id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, CŨNG redirect sang auth (không cho vào)
      console.log('❌ Auth error, redirecting to auth...');
      window.location.href = 'auth.html';
    }
  }

  // Load user progress from Supabase
  async function loadUserProgressFromSupabase(userId) {
    try {
      const result = await window.SupabaseConfig.getUserProgress(userId);
      if (result.success && result.data) {
        // Map database fields to gameState
        const dbData = result.data;
        gameState.totalStars = dbData.total_stars || 0;
        gameState.coins = dbData.coins || 0;
        gameState.wordsLearned = dbData.words_learned || [];
        gameState.ownedCharacters = dbData.owned_characters || [];
        gameState.playerName = dbData.player_name || 'Bé';
        gameState.playerAvatar = dbData.player_avatar || '👦';
        gameState.currentLevel = dbData.current_level || 1;
        gameState.streak = dbData.streak || 0;

        console.log('✅ Progress loaded from Supabase:', gameState);
        updateNavInfo();
      }
    } catch (error) {
      console.error('Load progress error:', error);
    }
  }

  // Save progress to Supabase
  async function saveProgressToSupabase() {
    if (!window.SupabaseConfig) {
      console.warn('⚠️ SupabaseConfig not available, skipping cloud save');
      return;
    }

    try {
      const user = await window.SupabaseConfig.getCurrentUser();
      if (user) {
        const result = await window.SupabaseConfig.saveUserProgress(user.id, gameState);
        if (result.success) {
          console.log('✅ Progress saved to Supabase');
        } else {
          console.error('❌ Failed to save progress:', result.error);
        }
      } else {
        console.warn('⚠️ No user logged in, skipping cloud save');
      }
    } catch (error) {
      console.error('❌ Save progress error:', error);
    }
  }

  // Override saveGame to also save to Supabase
  var originalSaveGame = saveGame;
  saveGame = function () {
    originalSaveGame();
    saveProgressToSupabase();
  };

  // Setup audio welcome modal
  function setupAudioWelcomeModal() {
    var modal = document.getElementById('audioWelcomeModal');
    var btnEnable = document.getElementById('btnEnableAudio');
    var btnSkip = document.getElementById('btnSkipAudio');

    // Helper function to force enable scroll after modal closes
    function forceScrollAfterModal() {
      // Force enable scroll immediately
      document.body.style.setProperty('overflow-y', 'visible', 'important');
      document.body.style.setProperty('touch-action', 'pan-y pinch-zoom', 'important');
      document.documentElement.style.setProperty('overflow-y', 'visible', 'important');

      // Call global scroll fix if available
      if (window.SCROLL_FIX && window.SCROLL_FIX.forceEnable) {
        setTimeout(function () {
          window.SCROLL_FIX.forceEnable();
          console.log('✅ Scroll re-enabled after modal close');
        }, 100);
      }
    }

    if (btnEnable) {
      btnEnable.onclick = function () {
        if (window.AudioManager) {
          window.AudioManager.unlock().then(function () {
            if (modal) modal.classList.remove('show');
            forceScrollAfterModal(); // Force scroll after closing
            playSound('success');
            var childName = gameState.playerName || 'bé yêu';
            beeSay('Chào ' + childName + '! Hôm nay mình cùng ghép chữ nào! 🌈', 4000);
            speakVietnamese('Chào ' + childName + '!');
          });
        }
      };
    }

    if (btnSkip) {
      btnSkip.onclick = function () {
        if (modal) modal.classList.remove('show');
        forceScrollAfterModal(); // Force scroll after closing
        var childName = gameState.playerName || 'bé yêu';
        beeSay('Chào ' + childName + '! Hôm nay mình cùng ghép chữ nào! 🌈', 4000);
      };
    }
  }

  // Setup audio unlock button
  function setupAudioUnlockButton() {
    var btn = document.getElementById('audioUnlockBtn');
    if (!btn) return;

    // Update button state
    function updateButtonState() {
      if (window.AudioManager && window.AudioManager.isUnlocked()) {
        btn.textContent = '🔊';
        btn.classList.add('unlocked');
        btn.title = 'Âm thanh đã bật';
      } else {
        btn.textContent = '🔇';
        btn.classList.remove('unlocked');
        btn.title = 'Nhấn để bật âm thanh';
      }
    }

    // Click handler
    btn.onclick = function () {
      if (window.AudioManager) {
        window.AudioManager.unlock().then(function () {
          updateButtonState();
          playSound('success');
          beeSay('Âm thanh đã bật! 🔊', 2000);
          speakVietnamese('Âm thanh đã bật!');
        });
      }
    };

    // Check every second
    setInterval(updateButtonState, 1000);
    updateButtonState();
  }

  // ========== FLOATING ICONS ==========
  function createFloatingIcons() {
    var container = document.createElement('div');
    container.className = 'floating-icons';
    document.body.appendChild(container);

    var icons = ['⭐', '🌟', '✨', '💫', '🎈', '🎨', '🌈', '🦋', '🌸', '🍀'];

    // ✅ Giảm số lượng icon và phân bổ đều hơn
    for (var i = 0; i < 8; i++) {
      var icon = document.createElement('div');
      icon.className = 'floating-icon';
      icon.textContent = icons[Math.floor(Math.random() * icons.length)];

      // ✅ Phân bổ đều theo cột (8 icon = 8 cột)
      var columnWidth = 100 / 8;
      var minLeft = i * columnWidth;
      var maxLeft = (i + 1) * columnWidth;
      icon.style.left = (minLeft + Math.random() * (maxLeft - minLeft)) + '%';

      // ✅ Bắt đầu từ vị trí khác nhau (không dồn ở bottom)
      icon.style.bottom = (Math.random() * 120 - 20) + 'vh';

      icon.style.animationDelay = (i * 2) + 's'; // Delay đều hơn
      icon.style.animationDuration = (15 + Math.random() * 5) + 's';
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
