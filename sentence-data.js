/* ========================================
   SENTENCE DATA - Dữ liệu câu văn
   Ghép từ thành câu hoàn chỉnh
   ======================================== */

(function () {
    'use strict';

    console.log('📝 Loading sentence data...');

    // ========== DỮ LIỆU CÂU VĂN ==========
    var sentenceData = {
        // === GIA ĐÌNH ===
        family: [
            {
                sentence: "Con yêu mẹ nhiều lắm",
                blanks: ["Con", "yêu", "mẹ", "nhiều"],
                image: "❤️",
                audio: "Con yêu mẹ nhiều lắm"
            },
            {
                sentence: "Ba đi làm về nhà",
                blanks: ["Ba", "đi", "làm", "về"],
                image: "👨‍💼",
                audio: "Ba đi làm về nhà"
            },
            {
                sentence: "Mẹ nấu cơm ngon lắm",
                blanks: ["Mẹ", "nấu", "cơm", "ngon"],
                image: "👩‍🍳",
                audio: "Mẹ nấu cơm ngon lắm"
            },
            {
                sentence: "Ông bà thương con nhiều",
                blanks: ["Ông", "bà", "thương", "con"],
                image: "👴👵",
                audio: "Ông bà thương con nhiều"
            },
            {
                sentence: "Anh chị chơi cùng em bé",
                blanks: ["Anh", "chị", "chơi", "em"],
                image: "👦👧",
                audio: "Anh chị chơi cùng em bé"
            },
            {
                sentence: "Cả nhà ăn cơm vui vẻ",
                blanks: ["Cả", "nhà", "ăn", "cơm"],
                image: "🍚",
                audio: "Cả nhà ăn cơm vui vẻ"
            },
            {
                sentence: "Con nghe lời ba mẹ dạy",
                blanks: ["Con", "nghe", "ba", "mẹ"],
                image: "👂",
                audio: "Con nghe lời ba mẹ dạy"
            },
            {
                sentence: "Gia đình vui vẻ hạnh phúc",
                blanks: ["Gia đình", "vui", "hạnh phúc"],
                image: "😊",
                audio: "Gia đình vui vẻ hạnh phúc"
            }
        ],

        // === ĐỘNG VẬT ===
        animals: [
            {
                sentence: "Con mèo kêu meo meo vui",
                blanks: ["Con", "mèo", "kêu", "meo"],
                image: "🐱",
                audio: "Con mèo kêu meo meo vui"
            },
            {
                sentence: "Con chó canh nhà giỏi lắm",
                blanks: ["Con", "chó", "canh", "nhà"],
                image: "🐕",
                audio: "Con chó canh nhà giỏi lắm"
            },
            {
                sentence: "Con gà gáy sáng mỗi ngày",
                blanks: ["Con", "gà", "gáy", "sáng"],
                image: "🐔",
                audio: "Con gà gáy sáng mỗi ngày"
            },
            {
                sentence: "Con voi to lớn mạnh khỏe",
                blanks: ["Con", "voi", "to", "lớn"],
                image: "🐘",
                audio: "Con voi to lớn mạnh khỏe"
            },
            {
                sentence: "Con cá bơi nước",
                blanks: ["cá", "nước"],
                image: "🐟",
                audio: "Con cá bơi nước"
            },
            {
                sentence: "Con ong bay vù vù",
                blanks: ["ong", "vù"],
                image: "🐝",
                audio: "Con ong bay vù vù"
            },
            {
                sentence: "Con bướm đẹp xinh",
                blanks: ["bướm", "xinh"],
                image: "🦋",
                audio: "Con bướm đẹp xinh"
            },
            {
                sentence: "Con thỏ nhảy nhót",
                blanks: ["thỏ", "nhảy"],
                image: "🐰",
                audio: "Con thỏ nhảy nhót"
            },
            {
                sentence: "Con vịt bơi ao",
                blanks: ["vịt", "ao"],
                image: "🦆",
                audio: "Con vịt bơi ao"
            },
            {
                sentence: "Con khỉ trèo cây",
                blanks: ["khỉ", "cây"],
                image: "🐵",
                audio: "Con khỉ trèo cây"
            }
        ],

        // === THIÊN NHIÊN ===
        nature: [
            {
                sentence: "Hoa nở đẹp lắm",
                blanks: ["Hoa", "đẹp"],
                image: "🌸",
                audio: "Hoa nở đẹp lắm"
            },
            {
                sentence: "Cây xanh cao to",
                blanks: ["Cây", "cao"],
                image: "🌳",
                audio: "Cây xanh cao to"
            },
            {
                sentence: "Mặt trời sáng rực",
                blanks: ["Mặt trời", "sáng"],
                image: "☀️",
                audio: "Mặt trời sáng rực"
            },
            {
                sentence: "Trời mưa to quá",
                blanks: ["Trời", "to"],
                image: "🌧️",
                audio: "Trời mưa to quá"
            },
            {
                sentence: "Sao sáng lấp lánh",
                blanks: ["Sao", "lấp lánh"],
                image: "⭐",
                audio: "Sao sáng lấp lánh"
            },
            {
                sentence: "Cầu vồng bảy màu",
                blanks: ["Cầu vồng", "màu"],
                image: "🌈",
                audio: "Cầu vồng bảy màu"
            },
            {
                sentence: "Gió thổi mát lành",
                blanks: ["Gió", "mát"],
                image: "💨",
                audio: "Gió thổi mát lành"
            },
            {
                sentence: "Mây trắng bay cao",
                blanks: ["Mây", "cao"],
                image: "☁️",
                audio: "Mây trắng bay cao"
            }
        ],

        // === HỌC TẬP ===
        learning: [
            {
                sentence: "Bé đi học vui",
                blanks: ["Bé", "học"],
                image: "📚",
                audio: "Bé đi học vui"
            },
            {
                sentence: "Bé đọc sách hay",
                blanks: ["đọc", "hay"],
                image: "📖",
                audio: "Bé đọc sách hay"
            },
            {
                sentence: "Bé viết chữ đẹp",
                blanks: ["viết", "đẹp"],
                image: "✏️",
                audio: "Bé viết chữ đẹp"
            },
            {
                sentence: "Bé học bài giỏi",
                blanks: ["học", "giỏi"],
                image: "📝",
                audio: "Bé học bài giỏi"
            },
            {
                sentence: "Cô giáo dạy bé",
                blanks: ["Cô", "bé"],
                image: "👩‍🏫",
                audio: "Cô giáo dạy bé"
            },
            {
                sentence: "Bé làm bài tập",
                blanks: ["làm", "tập"],
                image: "📓",
                audio: "Bé làm bài tập"
            }
        ],

        // === HOẠT ĐỘNG ===
        activities: [
            {
                sentence: "Bé ăn cơm ngon",
                blanks: ["ăn", "ngon"],
                image: "🍚",
                audio: "Bé ăn cơm ngon"
            },
            {
                sentence: "Bé uống sữa đầy",
                blanks: ["uống", "đầy"],
                image: "🥛",
                audio: "Bé uống sữa đầy"
            },
            {
                sentence: "Bé ngủ ngon lành",
                blanks: ["ngủ", "lành"],
                image: "😴",
                audio: "Bé ngủ ngon lành"
            },
            {
                sentence: "Bé chơi vui vẻ",
                blanks: ["chơi", "vui"],
                image: "🎮",
                audio: "Bé chơi vui vẻ"
            },
            {
                sentence: "Bé đánh răng sạch",
                blanks: ["đánh răng", "sạch"],
                image: "🪥",
                audio: "Bé đánh răng sạch"
            },
            {
                sentence: "Bé rửa tay sạch",
                blanks: ["rửa", "sạch"],
                image: "🧼",
                audio: "Bé rửa tay sạch"
            },
            {
                sentence: "Bé chạy nhanh lắm",
                blanks: ["chạy", "nhanh"],
                image: "🏃",
                audio: "Bé chạy nhanh lắm"
            },
            {
                sentence: "Bé nhảy múa vui",
                blanks: ["nhảy", "vui"],
                image: "💃",
                audio: "Bé nhảy múa vui"
            }
        ],

        // === CẢM XÚC ===
        emotions: [
            {
                sentence: "Bé vui cười ha ha",
                blanks: ["vui", "ha ha"],
                image: "😄",
                audio: "Bé vui cười ha ha"
            },
            {
                sentence: "Bé buồn khóc òa",
                blanks: ["buồn", "khóc"],
                image: "😢",
                audio: "Bé buồn khóc òa"
            },
            {
                sentence: "Bé yêu ba mẹ",
                blanks: ["yêu", "ba mẹ"],
                image: "❤️",
                audio: "Bé yêu ba mẹ"
            },
            {
                sentence: "Bé thương em bé",
                blanks: ["thương", "em"],
                image: "🤗",
                audio: "Bé thương em bé"
            },
            {
                sentence: "Bé vui mừng lắm",
                blanks: ["vui", "lắm"],
                image: "😊",
                audio: "Bé vui mừng lắm"
            }
        ],

        // === THỨC ĂN ===
        food: [
            {
                sentence: "Táo đỏ ngon lành",
                blanks: ["Táo", "ngon"],
                image: "🍎",
                audio: "Táo đỏ ngon lành"
            },
            {
                sentence: "Cam vàng ngọt nước",
                blanks: ["Cam", "ngọt"],
                image: "🍊",
                audio: "Cam vàng ngọt nước"
            },
            {
                sentence: "Bánh mì thơm ngon",
                blanks: ["Bánh", "thơm"],
                image: "🍞",
                audio: "Bánh mì thơm ngon"
            },
            {
                sentence: "Cơm nóng hổi ngon",
                blanks: ["Cơm", "ngon"],
                image: "🍚",
                audio: "Cơm nóng hổi ngon"
            },
            {
                sentence: "Sữa trắng bổ dưỡng",
                blanks: ["Sữa", "bổ"],
                image: "🥛",
                audio: "Sữa trắng bổ dưỡng"
            }
        ]
    };

    // Export to global
    window.SentenceData = sentenceData;

    var totalSentences = 0;
    for (var theme in sentenceData) {
        totalSentences += sentenceData[theme].length;
    }

    console.log('✅ Sentence data loaded:', totalSentences, 'sentences');

})();
