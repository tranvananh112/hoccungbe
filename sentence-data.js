<<<<<<< HEAD
/* ========================================
   SENTENCE DATA - Dữ liệu câu văn
   Ghép từ thành câu hoàn chỉnh
   ======================================== */

(function () {
    'use strict';

    console.log('📝 Loading sentence data...');

    // ========== DỮ LIỆU CÂU VĂN THEO CẤP ĐỘ ==========
    var sentenceData = {
        // === GIA ĐÌNH ===
        family: [
            // CẤP 1: Cực kỳ dễ - 2 từ, không có từ nhiễu
            {
                sentence: "Mẹ yêu con",
                blanks: ["Mẹ", "con"],
                distractors: [],
                level: 1,
                image: "👩‍👦",
                audio: "Mẹ yêu con rất nhiều và luôn chăm sóc con"
            },
            {
                sentence: "Ba về nhà",
                blanks: ["Ba", "nhà"],
                distractors: [],
                level: 1,
                image: "👨‍💼",
                audio: "Ba đi làm về nhà gặp con"
            },
            {
                sentence: "Con yêu mẹ",
                blanks: ["Con", "mẹ"],
                distractors: [],
                level: 1,
                image: "❤️",
                audio: "Con yêu mẹ và nghe lời mẹ dạy"
            },
            // CẤP 2: Dễ - 3 từ, 1-2 từ nhiễu
            {
                sentence: "Mẹ nấu cơm ngon",
                blanks: ["Mẹ", "cơm", "ngon"],
                distractors: ["bát", "ăn"],
                level: 2,
                image: "👩‍🍳",
                audio: "Mẹ nấu cơm ngon cho cả nhà ăn"
            },
            {
                sentence: "Ba đi làm về",
                blanks: ["Ba", "làm", "về"],
                distractors: ["nhà", "sáng"],
                level: 2,
                image: "👨‍💼",
                audio: "Ba đi làm về nhà vào buổi tối"
            },
            {
                sentence: "Ông bà thương con",
                blanks: ["Ông", "bà", "con"],
                distractors: ["cháu", "yêu"],
                level: 2,
                image: "👴👵",
                audio: "Ông bà thương con và cho con ăn kẹo"
            },
            // CẤP 3: Trung bình - 4-5 từ, nhiều từ nhiễu
            {
                sentence: "Con yêu ba mẹ nhiều lắm",
                blanks: ["Con", "yêu", "ba", "mẹ", "nhiều"],
                distractors: ["thương", "quý", "ông", "bà", "em"],
                level: 3,
                image: "❤️",
                audio: "Con yêu ba mẹ nhiều lắm và luôn nghe lời ba mẹ"
            },
            {
                sentence: "Cả nhà ăn cơm vui vẻ",
                blanks: ["Cả", "nhà", "ăn", "cơm", "vui"],
                distractors: ["bữa", "ngon", "sáng", "tối", "trưa"],
                level: 3,
                image: "🍚",
                audio: "Cả nhà quây quần ăn cơm vui vẻ cùng nhau"
            },
            {
                sentence: "Anh chị chơi cùng em bé",
                blanks: ["Anh", "chị", "chơi", "em", "bé"],
                distractors: ["con", "nhà", "vui", "đồ", "cùng"],
                level: 3,
                image: "👦👧",
                audio: "Anh chị chơi cùng em bé rất vui vẻ và thương yêu nhau"
            }
        ],

        // === ĐỘNG VẬT ===
        animals: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Mèo kêu meo meo",
                blanks: ["Mèo", "meo", "meo"],
                distractors: [],
                level: 1,
                image: "🐱",
                audio: "Con mèo kêu meo meo rất dễ thương"
            },
            {
                sentence: "Chó sủa gâu gâu",
                blanks: ["Chó", "gâu", "gâu"],
                distractors: [],
                level: 1,
                image: "🐕",
                audio: "Con chó sủa gâu gâu canh nhà"
            },
            {
                sentence: "Gà gáy ò ó o",
                blanks: ["Gà", "ò", "ó", "o"],
                distractors: [],
                level: 1,
                image: "🐔",
                audio: "Con gà trống gáy ò ó o báo sáng"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Con mèo bắt chuột",
                blanks: ["mèo", "bắt", "chuột"],
                distractors: ["chó", "đuổi"],
                level: 2,
                image: "🐱",
                audio: "Con mèo bắt chuột rất khéo léo và nhanh nhẹn"
            },
            {
                sentence: "Con chó canh nhà",
                blanks: ["chó", "canh", "nhà"],
                distractors: ["mèo", "giữ"],
                level: 2,
                image: "🐕",
                audio: "Con chó canh nhà trung thành và dũng cảm"
            },
            {
                sentence: "Con vịt bơi ao",
                blanks: ["vịt", "bơi", "ao"],
                distractors: ["cá", "sông"],
                level: 2,
                image: "🦆",
                audio: "Con vịt bơi lội trong ao rất giỏi"
            },
            {
                sentence: "Con cá bơi nước",
                blanks: ["cá", "bơi", "nước"],
                distractors: ["vịt", "ao"],
                level: 2,
                image: "🐟",
                audio: "Con cá bơi trong nước rất nhanh"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Con voi to lớn mạnh khỏe",
                blanks: ["voi", "to", "lớn", "mạnh", "khỏe"],
                distractors: ["nhỏ", "yếu", "cao", "thấp", "béo"],
                level: 3,
                image: "🐘",
                audio: "Con voi to lớn mạnh khỏe có vòi dài và tai to"
            },
            {
                sentence: "Con khỉ trèo cây nhanh nhẹn",
                blanks: ["khỉ", "trèo", "cây", "nhanh", "nhẹn"],
                distractors: ["leo", "chậm", "cành", "lá", "cao"],
                level: 3,
                image: "🐵",
                audio: "Con khỉ trèo cây nhanh nhẹn và thích ăn chuối"
            },
            {
                sentence: "Con bướm bay lượn đẹp xinh",
                blanks: ["bướm", "bay", "lượn", "đẹp", "xinh"],
                distractors: ["ong", "hoa", "vườn", "màu", "sắc"],
                level: 3,
                image: "🦋",
                audio: "Con bướm bay lượn đẹp xinh với đôi cánh nhiều màu sắc"
            }
        ],

        // === THIÊN NHIÊN ===
        nature: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Hoa đẹp xinh",
                blanks: ["Hoa", "xinh"],
                distractors: [],
                level: 1,
                image: "🌸",
                audio: "Hoa nở đẹp xinh và thơm ngát"
            },
            {
                sentence: "Cây xanh tươi",
                blanks: ["Cây", "tươi"],
                distractors: [],
                level: 1,
                image: "🌳",
                audio: "Cây xanh tươi mát cho bóng mát"
            },
            {
                sentence: "Trời nắng đẹp",
                blanks: ["Trời", "đẹp"],
                distractors: [],
                level: 1,
                image: "☀️",
                audio: "Trời nắng đẹp và ấm áp"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Mặt trời sáng rực",
                blanks: ["Mặt trời", "sáng", "rực"],
                distractors: ["tối", "mờ"],
                level: 2,
                image: "☀️",
                audio: "Mặt trời sáng rực chiếu sáng ban ngày"
            },
            {
                sentence: "Trời mưa to quá",
                blanks: ["Trời", "mưa", "to"],
                distractors: ["nắng", "nhỏ"],
                level: 2,
                image: "🌧️",
                audio: "Trời mưa to quá làm ướt đất"
            },
            {
                sentence: "Sao sáng lấp lánh",
                blanks: ["Sao", "sáng", "lánh"],
                distractors: ["tối", "mờ"],
                level: 2,
                image: "⭐",
                audio: "Sao sáng lấp lánh trên bầu trời đêm"
            },
            {
                sentence: "Gió thổi mát lành",
                blanks: ["Gió", "mát", "lành"],
                distractors: ["nóng", "oi"],
                level: 2,
                image: "💨",
                audio: "Gió thổi mát lành rất dễ chịu"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Cầu vồng bảy màu rực rỡ",
                blanks: ["Cầu vồng", "bảy", "màu", "rực", "rỡ"],
                distractors: ["đẹp", "sắc", "nhiều", "đủ", "tươi"],
                level: 3,
                image: "🌈",
                audio: "Cầu vồng bảy màu rực rỡ xuất hiện sau cơn mưa"
            },
            {
                sentence: "Hoa nở thơm ngát vườn xuân",
                blanks: ["Hoa", "nở", "thơm", "vườn", "xuân"],
                distractors: ["đẹp", "tươi", "hè", "thu", "đông"],
                level: 3,
                image: "🌸",
                audio: "Hoa nở thơm ngát trong vườn xuân đầy màu sắc"
            },
            {
                sentence: "Mây trắng bay cao trên trời",
                blanks: ["Mây", "trắng", "bay", "cao", "trời"],
                distractors: ["xanh", "thấp", "đất", "nước", "gió"],
                level: 3,
                image: "☁️",
                audio: "Mây trắng bay cao trên trời xanh rất đẹp"
            }
        ],

        // === HỌC TẬP ===
        learning: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Bé học bài",
                blanks: ["Bé", "bài"],
                distractors: [],
                level: 1,
                image: "📚",
                audio: "Bé học bài chăm chỉ mỗi ngày"
            },
            {
                sentence: "Bé đọc sách",
                blanks: ["Bé", "sách"],
                distractors: [],
                level: 1,
                image: "📖",
                audio: "Bé đọc sách để học thêm kiến thức"
            },
            {
                sentence: "Bé viết chữ",
                blanks: ["Bé", "chữ"],
                distractors: [],
                level: 1,
                image: "✏️",
                audio: "Bé viết chữ thật đẹp và ngay ngắn"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Bé học bài giỏi",
                blanks: ["Bé", "học", "giỏi"],
                distractors: ["chăm", "ngoan"],
                level: 2,
                image: "📚",
                audio: "Bé học bài giỏi và được cô khen"
            },
            {
                sentence: "Bé đọc sách hay",
                blanks: ["Bé", "sách", "hay"],
                distractors: ["vở", "tốt"],
                level: 2,
                image: "📖",
                audio: "Bé đọc sách hay và học được nhiều điều"
            },
            {
                sentence: "Cô giáo dạy bé",
                blanks: ["Cô", "dạy", "bé"],
                distractors: ["học", "chăm"],
                level: 2,
                image: "👩‍🏫",
                audio: "Cô giáo dạy bé học chữ và làm toán"
            },
            {
                sentence: "Bé viết chữ đẹp",
                blanks: ["Bé", "chữ", "đẹp"],
                distractors: ["vẽ", "tốt"],
                level: 2,
                image: "✏️",
                audio: "Bé viết chữ đẹp và ngay ngắn"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé đi học vui vẻ mỗi ngày",
                blanks: ["Bé", "học", "vui", "mỗi", "ngày"],
                distractors: ["buồn", "sáng", "tối", "chiều", "trưa"],
                level: 3,
                image: "🎒",
                audio: "Bé đi học vui vẻ mỗi ngày để học hỏi kiến thức mới"
            },
            {
                sentence: "Bé làm bài tập chăm chỉ",
                blanks: ["Bé", "làm", "bài", "chăm", "chỉ"],
                distractors: ["học", "viết", "đọc", "lười", "giỏi"],
                level: 3,
                image: "📓",
                audio: "Bé làm bài tập chăm chỉ để hiểu bài và học giỏi"
            },
            {
                sentence: "Cô giáo khen bé học giỏi",
                blanks: ["Cô", "khen", "bé", "học", "giỏi"],
                distractors: ["mắng", "dạy", "yêu", "thương", "chăm"],
                level: 3,
                image: "👩‍🏫",
                audio: "Cô giáo khen bé học giỏi và chăm chỉ"
            }
        ],

        // === HOẠT ĐỘNG ===
        activities: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Bé ăn cơm",
                blanks: ["Bé", "cơm"],
                distractors: [],
                level: 1,
                image: "🍚",
                audio: "Bé ăn cơm ngon để lớn khỏe"
            },
            {
                sentence: "Bé uống sữa",
                blanks: ["Bé", "sữa"],
                distractors: [],
                level: 1,
                image: "🥛",
                audio: "Bé uống sữa để cao lớn và khỏe mạnh"
            },
            {
                sentence: "Bé ngủ ngon",
                blanks: ["Bé", "ngon"],
                distractors: [],
                level: 1,
                image: "😴",
                audio: "Bé ngủ ngon để nghỉ ngơi và phát triển"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Bé chơi đồ chơi",
                blanks: ["Bé", "chơi", "đồ"],
                distractors: ["bóng", "búp"],
                level: 2,
                image: "🧸",
                audio: "Bé chơi đồ chơi vui vẻ và cẩn thận"
            },
            {
                sentence: "Bé rửa tay sạch",
                blanks: ["Bé", "tay", "sạch"],
                distractors: ["mặt", "bẩn"],
                level: 2,
                image: "🧼",
                audio: "Bé rửa tay sạch trước khi ăn"
            },
            {
                sentence: "Bé đánh răng sạch",
                blanks: ["Bé", "răng", "sạch"],
                distractors: ["mặt", "tay"],
                level: 2,
                image: "🪥",
                audio: "Bé đánh răng sạch sáng tối mỗi ngày"
            },
            {
                sentence: "Bé chạy nhanh lắm",
                blanks: ["Bé", "chạy", "nhanh"],
                distractors: ["đi", "chậm"],
                level: 2,
                image: "🏃",
                audio: "Bé chạy nhanh lắm như gió"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé ăn cơm ngon lành no bụng",
                blanks: ["Bé", "ăn", "cơm", "no", "bụng"],
                distractors: ["uống", "đói", "sữa", "bánh", "đầy"],
                level: 3,
                image: "🍚",
                audio: "Bé ăn cơm ngon lành no bụng để có sức khỏe"
            },
            {
                sentence: "Bé ngủ ngon giấc mơ đẹp",
                blanks: ["Bé", "ngủ", "giấc", "mơ", "đẹp"],
                distractors: ["thức", "dậy", "xấu", "buồn", "vui"],
                level: 3,
                image: "😴",
                audio: "Bé ngủ ngon giấc mơ đẹp và nghỉ ngơi đầy đủ"
            },
            {
                sentence: "Bé nhảy múa vui vẻ hát ca",
                blanks: ["Bé", "nhảy", "vui", "hát", "ca"],
                distractors: ["buồn", "khóc", "cười", "chơi", "đùa"],
                level: 3,
                image: "💃",
                audio: "Bé nhảy múa vui vẻ hát ca thật vui"
            }
        ],

        // === CẢM XÚC ===
        emotions: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Bé vui cười",
                blanks: ["Bé", "cười"],
                distractors: [],
                level: 1,
                image: "😄",
                audio: "Bé vui cười khi được chơi"
            },
            {
                sentence: "Bé buồn khóc",
                blanks: ["Bé", "khóc"],
                distractors: [],
                level: 1,
                image: "😢",
                audio: "Bé buồn khóc khi bị đau"
            },
            {
                sentence: "Bé yêu mẹ",
                blanks: ["Bé", "mẹ"],
                distractors: [],
                level: 1,
                image: "❤️",
                audio: "Bé yêu mẹ rất nhiều"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Bé vui mừng lắm",
                blanks: ["Bé", "vui", "lắm"],
                distractors: ["buồn", "khóc"],
                level: 2,
                image: "😊",
                audio: "Bé vui mừng lắm khi được quà"
            },
            {
                sentence: "Bé thương em bé",
                blanks: ["Bé", "thương", "em"],
                distractors: ["yêu", "anh"],
                level: 2,
                image: "🤗",
                audio: "Bé thương em bé và chơi cùng em"
            },
            {
                sentence: "Bé giận dỗi hờn",
                blanks: ["Bé", "giận", "hờn"],
                distractors: ["vui", "cười"],
                level: 2,
                image: "😠",
                audio: "Bé giận dỗi hờn khi không được chơi"
            },
            {
                sentence: "Bé sợ hãi run",
                blanks: ["Bé", "sợ", "run"],
                distractors: ["vui", "dũng"],
                level: 2,
                image: "😨",
                audio: "Bé sợ hãi run khi thấy bóng tối"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé vui cười ha ha hê hê",
                blanks: ["Bé", "vui", "cười", "ha", "ha", "hê", "hê"],
                distractors: ["buồn", "khóc", "òa", "oa", "hì"],
                level: 3,
                image: "😄",
                audio: "Bé vui cười ha ha hê hê khi được chơi với bạn"
            },
            {
                sentence: "Bé yêu ba mẹ nhiều lắm",
                blanks: ["Bé", "yêu", "ba", "mẹ", "nhiều"],
                distractors: ["thương", "quý", "ông", "bà", "ít"],
                level: 3,
                image: "❤️",
                audio: "Bé yêu ba mẹ nhiều lắm và luôn nghe lời"
            },
            {
                sentence: "Bé buồn khóc òa òa oa",
                blanks: ["Bé", "buồn", "khóc", "òa", "òa", "oa"],
                distractors: ["vui", "cười", "ha", "hê", "hì"],
                level: 3,
                image: "😢",
                audio: "Bé buồn khóc òa òa oa khi bị té"
            }
        ],

        // === THỨC ĂN ===
        food: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Táo đỏ ngon",
                blanks: ["Táo", "ngon"],
                distractors: [],
                level: 1,
                image: "🍎",
                audio: "Táo đỏ ngon và giòn rất bổ dưỡng"
            },
            {
                sentence: "Cam vàng ngọt",
                blanks: ["Cam", "ngọt"],
                distractors: [],
                level: 1,
                image: "🍊",
                audio: "Cam vàng ngọt và nhiều nước vitamin C"
            },
            {
                sentence: "Cơm nóng thơm",
                blanks: ["Cơm", "thơm"],
                distractors: [],
                level: 1,
                image: "🍚",
                audio: "Cơm nóng thơm ngon cho bé ăn"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Bánh mì thơm ngon",
                blanks: ["Bánh", "thơm", "ngon"],
                distractors: ["cơm", "xấu"],
                level: 2,
                image: "🍞",
                audio: "Bánh mì thơm ngon và giòn rụm"
            },
            {
                sentence: "Sữa trắng bổ dưỡng",
                blanks: ["Sữa", "bổ", "dưỡng"],
                distractors: ["nước", "hại"],
                level: 2,
                image: "🥛",
                audio: "Sữa trắng bổ dưỡng giúp bé cao lớn"
            },
            {
                sentence: "Chuối vàng ngọt lịm",
                blanks: ["Chuối", "ngọt", "lịm"],
                distractors: ["táo", "chua"],
                level: 2,
                image: "🍌",
                audio: "Chuối vàng ngọt lịm và mềm"
            },
            {
                sentence: "Nước cam mát lạnh",
                blanks: ["Nước", "mát", "lạnh"],
                distractors: ["sữa", "nóng"],
                level: 2,
                image: "🧃",
                audio: "Nước cam mát lạnh rất ngon"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé ăn táo đỏ ngon lành",
                blanks: ["Bé", "ăn", "táo", "ngon", "lành"],
                distractors: ["uống", "cam", "xấu", "dở", "chua"],
                level: 3,
                image: "🍎",
                audio: "Bé ăn táo đỏ ngon lành giòn và ngọt"
            },
            {
                sentence: "Cơm nóng hổi thơm ngon lắm",
                blanks: ["Cơm", "nóng", "thơm", "ngon", "lắm"],
                distractors: ["lạnh", "hôi", "dở", "ít", "bánh"],
                level: 3,
                image: "🍚",
                audio: "Cơm nóng hổi thơm ngon lắm mẹ nấu"
            },
            {
                sentence: "Bé uống sữa tươi mỗi ngày",
                blanks: ["Bé", "uống", "sữa", "mỗi", "ngày"],
                distractors: ["ăn", "nước", "đêm", "tối", "sáng"],
                level: 3,
                image: "🥛",
                audio: "Bé uống sữa tươi mỗi ngày để khỏe mạnh"
            }
        ],

        // === ĐỒ VẬT ===
        objects: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Bóng tròn đẹp",
                blanks: ["Bóng", "đẹp"],
                distractors: [],
                level: 1,
                image: "⚽",
                audio: "Bóng tròn đẹp để bé đá chơi"
            },
            {
                sentence: "Xe chạy nhanh",
                blanks: ["Xe", "nhanh"],
                distractors: [],
                level: 1,
                image: "🚗",
                audio: "Xe chạy nhanh trên đường"
            },
            {
                sentence: "Nhà cao to",
                blanks: ["Nhà", "to"],
                distractors: [],
                level: 1,
                image: "🏠",
                audio: "Nhà cao to để ở"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Búp bê xinh đẹp",
                blanks: ["Búp", "xinh", "đẹp"],
                distractors: ["xấu", "gấu"],
                level: 2,
                image: "🎎",
                audio: "Búp bê xinh đẹp để bé chơi"
            },
            {
                sentence: "Máy bay bay cao",
                blanks: ["Máy bay", "bay", "cao"],
                distractors: ["thấp", "xe"],
                level: 2,
                image: "✈️",
                audio: "Máy bay bay cao trên trời"
            },
            {
                sentence: "Đồng hồ chạy đúng",
                blanks: ["Đồng hồ", "chạy", "đúng"],
                distractors: ["sai", "dừng"],
                level: 2,
                image: "⏰",
                audio: "Đồng hồ chạy đúng báo giờ"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé chơi bóng vui vẻ lắm",
                blanks: ["Bé", "chơi", "bóng", "vui", "lắm"],
                distractors: ["buồn", "xe", "búp", "ít", "nhiều"],
                level: 3,
                image: "⚽",
                audio: "Bé chơi bóng vui vẻ lắm với các bạn"
            },
            {
                sentence: "Xe ô tô chạy nhanh trên đường",
                blanks: ["Xe", "chạy", "nhanh", "trên", "đường"],
                distractors: ["chậm", "dưới", "nhà", "bay", "bơi"],
                level: 3,
                image: "🚗",
                audio: "Xe ô tô chạy nhanh trên đường phố"
            }
        ],

        // === MÀU SẮC ===
        colors: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Đỏ đẹp lắm",
                blanks: ["Đỏ", "lắm"],
                distractors: [],
                level: 1,
                image: "🔴",
                audio: "Màu đỏ đẹp lắm như hoa hồng"
            },
            {
                sentence: "Xanh mát mẻ",
                blanks: ["Xanh", "mẻ"],
                distractors: [],
                level: 1,
                image: "🔵",
                audio: "Màu xanh mát mẻ như bầu trời"
            },
            {
                sentence: "Vàng sáng rực",
                blanks: ["Vàng", "rực"],
                distractors: [],
                level: 1,
                image: "🟡",
                audio: "Màu vàng sáng rực như mặt trời"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Hoa màu đỏ đẹp",
                blanks: ["Hoa", "đỏ", "đẹp"],
                distractors: ["xanh", "xấu"],
                level: 2,
                image: "🌹",
                audio: "Hoa màu đỏ đẹp và thơm"
            },
            {
                sentence: "Trời màu xanh trong",
                blanks: ["Trời", "xanh", "trong"],
                distractors: ["đỏ", "đục"],
                level: 2,
                image: "🌤️",
                audio: "Trời màu xanh trong vắt"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé thích màu đỏ rực rỡ",
                blanks: ["Bé", "thích", "đỏ", "rực", "rỡ"],
                distractors: ["ghét", "xanh", "vàng", "mờ", "nhạt"],
                level: 3,
                image: "🔴",
                audio: "Bé thích màu đỏ rực rỡ như hoa hồng"
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
=======
/* ========================================
   SENTENCE DATA - Dữ liệu câu văn
   Ghép từ thành câu hoàn chỉnh
   ======================================== */

(function () {
    'use strict';

    console.log('📝 Loading sentence data...');

    // ========== DỮ LIỆU CÂU VĂN THEO CẤP ĐỘ ==========
    var sentenceData = {
        // === GIA ĐÌNH ===
        family: [
            // CẤP 1: Cực kỳ dễ - 2 từ, không có từ nhiễu
            {
                sentence: "Mẹ yêu con",
                blanks: ["Mẹ", "con"],
                distractors: [],
                level: 1,
                image: "👩‍👦",
                audio: "Mẹ yêu con rất nhiều và luôn chăm sóc con"
            },
            {
                sentence: "Ba về nhà",
                blanks: ["Ba", "nhà"],
                distractors: [],
                level: 1,
                image: "👨‍💼",
                audio: "Ba đi làm về nhà gặp con"
            },
            {
                sentence: "Con yêu mẹ",
                blanks: ["Con", "mẹ"],
                distractors: [],
                level: 1,
                image: "❤️",
                audio: "Con yêu mẹ và nghe lời mẹ dạy"
            },
            // CẤP 2: Dễ - 3 từ, 1-2 từ nhiễu
            {
                sentence: "Mẹ nấu cơm ngon",
                blanks: ["Mẹ", "cơm", "ngon"],
                distractors: ["bát", "ăn"],
                level: 2,
                image: "👩‍🍳",
                audio: "Mẹ nấu cơm ngon cho cả nhà ăn"
            },
            {
                sentence: "Ba đi làm về",
                blanks: ["Ba", "làm", "về"],
                distractors: ["nhà", "sáng"],
                level: 2,
                image: "👨‍💼",
                audio: "Ba đi làm về nhà vào buổi tối"
            },
            {
                sentence: "Ông bà thương con",
                blanks: ["Ông", "bà", "con"],
                distractors: ["cháu", "yêu"],
                level: 2,
                image: "👴👵",
                audio: "Ông bà thương con và cho con ăn kẹo"
            },
            // CẤP 3: Trung bình - 4-5 từ, nhiều từ nhiễu
            {
                sentence: "Con yêu ba mẹ nhiều lắm",
                blanks: ["Con", "yêu", "ba", "mẹ", "nhiều"],
                distractors: ["thương", "quý", "ông", "bà", "em"],
                level: 3,
                image: "❤️",
                audio: "Con yêu ba mẹ nhiều lắm và luôn nghe lời ba mẹ"
            },
            {
                sentence: "Cả nhà ăn cơm vui vẻ",
                blanks: ["Cả", "nhà", "ăn", "cơm", "vui"],
                distractors: ["bữa", "ngon", "sáng", "tối", "trưa"],
                level: 3,
                image: "🍚",
                audio: "Cả nhà quây quần ăn cơm vui vẻ cùng nhau"
            },
            {
                sentence: "Anh chị chơi cùng em bé",
                blanks: ["Anh", "chị", "chơi", "em", "bé"],
                distractors: ["con", "nhà", "vui", "đồ", "cùng"],
                level: 3,
                image: "👦👧",
                audio: "Anh chị chơi cùng em bé rất vui vẻ và thương yêu nhau"
            }
        ],

        // === ĐỘNG VẬT ===
        animals: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Mèo kêu meo meo",
                blanks: ["Mèo", "meo", "meo"],
                distractors: [],
                level: 1,
                image: "🐱",
                audio: "Con mèo kêu meo meo rất dễ thương"
            },
            {
                sentence: "Chó sủa gâu gâu",
                blanks: ["Chó", "gâu", "gâu"],
                distractors: [],
                level: 1,
                image: "🐕",
                audio: "Con chó sủa gâu gâu canh nhà"
            },
            {
                sentence: "Gà gáy ò ó o",
                blanks: ["Gà", "ò", "ó", "o"],
                distractors: [],
                level: 1,
                image: "🐔",
                audio: "Con gà trống gáy ò ó o báo sáng"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Con mèo bắt chuột",
                blanks: ["mèo", "bắt", "chuột"],
                distractors: ["chó", "đuổi"],
                level: 2,
                image: "🐱",
                audio: "Con mèo bắt chuột rất khéo léo và nhanh nhẹn"
            },
            {
                sentence: "Con chó canh nhà",
                blanks: ["chó", "canh", "nhà"],
                distractors: ["mèo", "giữ"],
                level: 2,
                image: "🐕",
                audio: "Con chó canh nhà trung thành và dũng cảm"
            },
            {
                sentence: "Con vịt bơi ao",
                blanks: ["vịt", "bơi", "ao"],
                distractors: ["cá", "sông"],
                level: 2,
                image: "🦆",
                audio: "Con vịt bơi lội trong ao rất giỏi"
            },
            {
                sentence: "Con cá bơi nước",
                blanks: ["cá", "bơi", "nước"],
                distractors: ["vịt", "ao"],
                level: 2,
                image: "🐟",
                audio: "Con cá bơi trong nước rất nhanh"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Con voi to lớn mạnh khỏe",
                blanks: ["voi", "to", "lớn", "mạnh", "khỏe"],
                distractors: ["nhỏ", "yếu", "cao", "thấp", "béo"],
                level: 3,
                image: "🐘",
                audio: "Con voi to lớn mạnh khỏe có vòi dài và tai to"
            },
            {
                sentence: "Con khỉ trèo cây nhanh nhẹn",
                blanks: ["khỉ", "trèo", "cây", "nhanh", "nhẹn"],
                distractors: ["leo", "chậm", "cành", "lá", "cao"],
                level: 3,
                image: "🐵",
                audio: "Con khỉ trèo cây nhanh nhẹn và thích ăn chuối"
            },
            {
                sentence: "Con bướm bay lượn đẹp xinh",
                blanks: ["bướm", "bay", "lượn", "đẹp", "xinh"],
                distractors: ["ong", "hoa", "vườn", "màu", "sắc"],
                level: 3,
                image: "🦋",
                audio: "Con bướm bay lượn đẹp xinh với đôi cánh nhiều màu sắc"
            }
        ],

        // === THIÊN NHIÊN ===
        nature: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Hoa đẹp xinh",
                blanks: ["Hoa", "xinh"],
                distractors: [],
                level: 1,
                image: "🌸",
                audio: "Hoa nở đẹp xinh và thơm ngát"
            },
            {
                sentence: "Cây xanh tươi",
                blanks: ["Cây", "tươi"],
                distractors: [],
                level: 1,
                image: "🌳",
                audio: "Cây xanh tươi mát cho bóng mát"
            },
            {
                sentence: "Trời nắng đẹp",
                blanks: ["Trời", "đẹp"],
                distractors: [],
                level: 1,
                image: "☀️",
                audio: "Trời nắng đẹp và ấm áp"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Mặt trời sáng rực",
                blanks: ["Mặt trời", "sáng", "rực"],
                distractors: ["tối", "mờ"],
                level: 2,
                image: "☀️",
                audio: "Mặt trời sáng rực chiếu sáng ban ngày"
            },
            {
                sentence: "Trời mưa to quá",
                blanks: ["Trời", "mưa", "to"],
                distractors: ["nắng", "nhỏ"],
                level: 2,
                image: "🌧️",
                audio: "Trời mưa to quá làm ướt đất"
            },
            {
                sentence: "Sao sáng lấp lánh",
                blanks: ["Sao", "sáng", "lánh"],
                distractors: ["tối", "mờ"],
                level: 2,
                image: "⭐",
                audio: "Sao sáng lấp lánh trên bầu trời đêm"
            },
            {
                sentence: "Gió thổi mát lành",
                blanks: ["Gió", "mát", "lành"],
                distractors: ["nóng", "oi"],
                level: 2,
                image: "💨",
                audio: "Gió thổi mát lành rất dễ chịu"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Cầu vồng bảy màu rực rỡ",
                blanks: ["Cầu vồng", "bảy", "màu", "rực", "rỡ"],
                distractors: ["đẹp", "sắc", "nhiều", "đủ", "tươi"],
                level: 3,
                image: "🌈",
                audio: "Cầu vồng bảy màu rực rỡ xuất hiện sau cơn mưa"
            },
            {
                sentence: "Hoa nở thơm ngát vườn xuân",
                blanks: ["Hoa", "nở", "thơm", "vườn", "xuân"],
                distractors: ["đẹp", "tươi", "hè", "thu", "đông"],
                level: 3,
                image: "🌸",
                audio: "Hoa nở thơm ngát trong vườn xuân đầy màu sắc"
            },
            {
                sentence: "Mây trắng bay cao trên trời",
                blanks: ["Mây", "trắng", "bay", "cao", "trời"],
                distractors: ["xanh", "thấp", "đất", "nước", "gió"],
                level: 3,
                image: "☁️",
                audio: "Mây trắng bay cao trên trời xanh rất đẹp"
            }
        ],

        // === HỌC TẬP ===
        learning: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Bé học bài",
                blanks: ["Bé", "bài"],
                distractors: [],
                level: 1,
                image: "📚",
                audio: "Bé học bài chăm chỉ mỗi ngày"
            },
            {
                sentence: "Bé đọc sách",
                blanks: ["Bé", "sách"],
                distractors: [],
                level: 1,
                image: "📖",
                audio: "Bé đọc sách để học thêm kiến thức"
            },
            {
                sentence: "Bé viết chữ",
                blanks: ["Bé", "chữ"],
                distractors: [],
                level: 1,
                image: "✏️",
                audio: "Bé viết chữ thật đẹp và ngay ngắn"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Bé học bài giỏi",
                blanks: ["Bé", "học", "giỏi"],
                distractors: ["chăm", "ngoan"],
                level: 2,
                image: "📚",
                audio: "Bé học bài giỏi và được cô khen"
            },
            {
                sentence: "Bé đọc sách hay",
                blanks: ["Bé", "sách", "hay"],
                distractors: ["vở", "tốt"],
                level: 2,
                image: "📖",
                audio: "Bé đọc sách hay và học được nhiều điều"
            },
            {
                sentence: "Cô giáo dạy bé",
                blanks: ["Cô", "dạy", "bé"],
                distractors: ["học", "chăm"],
                level: 2,
                image: "👩‍🏫",
                audio: "Cô giáo dạy bé học chữ và làm toán"
            },
            {
                sentence: "Bé viết chữ đẹp",
                blanks: ["Bé", "chữ", "đẹp"],
                distractors: ["vẽ", "tốt"],
                level: 2,
                image: "✏️",
                audio: "Bé viết chữ đẹp và ngay ngắn"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé đi học vui vẻ mỗi ngày",
                blanks: ["Bé", "học", "vui", "mỗi", "ngày"],
                distractors: ["buồn", "sáng", "tối", "chiều", "trưa"],
                level: 3,
                image: "🎒",
                audio: "Bé đi học vui vẻ mỗi ngày để học hỏi kiến thức mới"
            },
            {
                sentence: "Bé làm bài tập chăm chỉ",
                blanks: ["Bé", "làm", "bài", "chăm", "chỉ"],
                distractors: ["học", "viết", "đọc", "lười", "giỏi"],
                level: 3,
                image: "📓",
                audio: "Bé làm bài tập chăm chỉ để hiểu bài và học giỏi"
            },
            {
                sentence: "Cô giáo khen bé học giỏi",
                blanks: ["Cô", "khen", "bé", "học", "giỏi"],
                distractors: ["mắng", "dạy", "yêu", "thương", "chăm"],
                level: 3,
                image: "👩‍🏫",
                audio: "Cô giáo khen bé học giỏi và chăm chỉ"
            }
        ],

        // === HOẠT ĐỘNG ===
        activities: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Bé ăn cơm",
                blanks: ["Bé", "cơm"],
                distractors: [],
                level: 1,
                image: "🍚",
                audio: "Bé ăn cơm ngon để lớn khỏe"
            },
            {
                sentence: "Bé uống sữa",
                blanks: ["Bé", "sữa"],
                distractors: [],
                level: 1,
                image: "🥛",
                audio: "Bé uống sữa để cao lớn và khỏe mạnh"
            },
            {
                sentence: "Bé ngủ ngon",
                blanks: ["Bé", "ngon"],
                distractors: [],
                level: 1,
                image: "😴",
                audio: "Bé ngủ ngon để nghỉ ngơi và phát triển"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Bé chơi đồ chơi",
                blanks: ["Bé", "chơi", "đồ"],
                distractors: ["bóng", "búp"],
                level: 2,
                image: "🧸",
                audio: "Bé chơi đồ chơi vui vẻ và cẩn thận"
            },
            {
                sentence: "Bé rửa tay sạch",
                blanks: ["Bé", "tay", "sạch"],
                distractors: ["mặt", "bẩn"],
                level: 2,
                image: "🧼",
                audio: "Bé rửa tay sạch trước khi ăn"
            },
            {
                sentence: "Bé đánh răng sạch",
                blanks: ["Bé", "răng", "sạch"],
                distractors: ["mặt", "tay"],
                level: 2,
                image: "🪥",
                audio: "Bé đánh răng sạch sáng tối mỗi ngày"
            },
            {
                sentence: "Bé chạy nhanh lắm",
                blanks: ["Bé", "chạy", "nhanh"],
                distractors: ["đi", "chậm"],
                level: 2,
                image: "🏃",
                audio: "Bé chạy nhanh lắm như gió"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé ăn cơm ngon lành no bụng",
                blanks: ["Bé", "ăn", "cơm", "no", "bụng"],
                distractors: ["uống", "đói", "sữa", "bánh", "đầy"],
                level: 3,
                image: "🍚",
                audio: "Bé ăn cơm ngon lành no bụng để có sức khỏe"
            },
            {
                sentence: "Bé ngủ ngon giấc mơ đẹp",
                blanks: ["Bé", "ngủ", "giấc", "mơ", "đẹp"],
                distractors: ["thức", "dậy", "xấu", "buồn", "vui"],
                level: 3,
                image: "😴",
                audio: "Bé ngủ ngon giấc mơ đẹp và nghỉ ngơi đầy đủ"
            },
            {
                sentence: "Bé nhảy múa vui vẻ hát ca",
                blanks: ["Bé", "nhảy", "vui", "hát", "ca"],
                distractors: ["buồn", "khóc", "cười", "chơi", "đùa"],
                level: 3,
                image: "💃",
                audio: "Bé nhảy múa vui vẻ hát ca thật vui"
            }
        ],

        // === CẢM XÚC ===
        emotions: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Bé vui cười",
                blanks: ["Bé", "cười"],
                distractors: [],
                level: 1,
                image: "😄",
                audio: "Bé vui cười khi được chơi"
            },
            {
                sentence: "Bé buồn khóc",
                blanks: ["Bé", "khóc"],
                distractors: [],
                level: 1,
                image: "😢",
                audio: "Bé buồn khóc khi bị đau"
            },
            {
                sentence: "Bé yêu mẹ",
                blanks: ["Bé", "mẹ"],
                distractors: [],
                level: 1,
                image: "❤️",
                audio: "Bé yêu mẹ rất nhiều"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Bé vui mừng lắm",
                blanks: ["Bé", "vui", "lắm"],
                distractors: ["buồn", "khóc"],
                level: 2,
                image: "😊",
                audio: "Bé vui mừng lắm khi được quà"
            },
            {
                sentence: "Bé thương em bé",
                blanks: ["Bé", "thương", "em"],
                distractors: ["yêu", "anh"],
                level: 2,
                image: "🤗",
                audio: "Bé thương em bé và chơi cùng em"
            },
            {
                sentence: "Bé giận dỗi hờn",
                blanks: ["Bé", "giận", "hờn"],
                distractors: ["vui", "cười"],
                level: 2,
                image: "😠",
                audio: "Bé giận dỗi hờn khi không được chơi"
            },
            {
                sentence: "Bé sợ hãi run",
                blanks: ["Bé", "sợ", "run"],
                distractors: ["vui", "dũng"],
                level: 2,
                image: "😨",
                audio: "Bé sợ hãi run khi thấy bóng tối"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé vui cười ha ha hê hê",
                blanks: ["Bé", "vui", "cười", "ha", "ha", "hê", "hê"],
                distractors: ["buồn", "khóc", "òa", "oa", "hì"],
                level: 3,
                image: "😄",
                audio: "Bé vui cười ha ha hê hê khi được chơi với bạn"
            },
            {
                sentence: "Bé yêu ba mẹ nhiều lắm",
                blanks: ["Bé", "yêu", "ba", "mẹ", "nhiều"],
                distractors: ["thương", "quý", "ông", "bà", "ít"],
                level: 3,
                image: "❤️",
                audio: "Bé yêu ba mẹ nhiều lắm và luôn nghe lời"
            },
            {
                sentence: "Bé buồn khóc òa òa oa",
                blanks: ["Bé", "buồn", "khóc", "òa", "òa", "oa"],
                distractors: ["vui", "cười", "ha", "hê", "hì"],
                level: 3,
                image: "😢",
                audio: "Bé buồn khóc òa òa oa khi bị té"
            }
        ],

        // === THỨC ĂN ===
        food: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Táo đỏ ngon",
                blanks: ["Táo", "ngon"],
                distractors: [],
                level: 1,
                image: "🍎",
                audio: "Táo đỏ ngon và giòn rất bổ dưỡng"
            },
            {
                sentence: "Cam vàng ngọt",
                blanks: ["Cam", "ngọt"],
                distractors: [],
                level: 1,
                image: "🍊",
                audio: "Cam vàng ngọt và nhiều nước vitamin C"
            },
            {
                sentence: "Cơm nóng thơm",
                blanks: ["Cơm", "thơm"],
                distractors: [],
                level: 1,
                image: "🍚",
                audio: "Cơm nóng thơm ngon cho bé ăn"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Bánh mì thơm ngon",
                blanks: ["Bánh", "thơm", "ngon"],
                distractors: ["cơm", "xấu"],
                level: 2,
                image: "🍞",
                audio: "Bánh mì thơm ngon và giòn rụm"
            },
            {
                sentence: "Sữa trắng bổ dưỡng",
                blanks: ["Sữa", "bổ", "dưỡng"],
                distractors: ["nước", "hại"],
                level: 2,
                image: "🥛",
                audio: "Sữa trắng bổ dưỡng giúp bé cao lớn"
            },
            {
                sentence: "Chuối vàng ngọt lịm",
                blanks: ["Chuối", "ngọt", "lịm"],
                distractors: ["táo", "chua"],
                level: 2,
                image: "🍌",
                audio: "Chuối vàng ngọt lịm và mềm"
            },
            {
                sentence: "Nước cam mát lạnh",
                blanks: ["Nước", "mát", "lạnh"],
                distractors: ["sữa", "nóng"],
                level: 2,
                image: "🧃",
                audio: "Nước cam mát lạnh rất ngon"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé ăn táo đỏ ngon lành",
                blanks: ["Bé", "ăn", "táo", "ngon", "lành"],
                distractors: ["uống", "cam", "xấu", "dở", "chua"],
                level: 3,
                image: "🍎",
                audio: "Bé ăn táo đỏ ngon lành giòn và ngọt"
            },
            {
                sentence: "Cơm nóng hổi thơm ngon lắm",
                blanks: ["Cơm", "nóng", "thơm", "ngon", "lắm"],
                distractors: ["lạnh", "hôi", "dở", "ít", "bánh"],
                level: 3,
                image: "🍚",
                audio: "Cơm nóng hổi thơm ngon lắm mẹ nấu"
            },
            {
                sentence: "Bé uống sữa tươi mỗi ngày",
                blanks: ["Bé", "uống", "sữa", "mỗi", "ngày"],
                distractors: ["ăn", "nước", "đêm", "tối", "sáng"],
                level: 3,
                image: "🥛",
                audio: "Bé uống sữa tươi mỗi ngày để khỏe mạnh"
            }
        ],

        // === ĐỒ VẬT ===
        objects: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Bóng tròn đẹp",
                blanks: ["Bóng", "đẹp"],
                distractors: [],
                level: 1,
                image: "⚽",
                audio: "Bóng tròn đẹp để bé đá chơi"
            },
            {
                sentence: "Xe chạy nhanh",
                blanks: ["Xe", "nhanh"],
                distractors: [],
                level: 1,
                image: "🚗",
                audio: "Xe chạy nhanh trên đường"
            },
            {
                sentence: "Nhà cao to",
                blanks: ["Nhà", "to"],
                distractors: [],
                level: 1,
                image: "🏠",
                audio: "Nhà cao to để ở"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Búp bê xinh đẹp",
                blanks: ["Búp", "xinh", "đẹp"],
                distractors: ["xấu", "gấu"],
                level: 2,
                image: "🎎",
                audio: "Búp bê xinh đẹp để bé chơi"
            },
            {
                sentence: "Máy bay bay cao",
                blanks: ["Máy bay", "bay", "cao"],
                distractors: ["thấp", "xe"],
                level: 2,
                image: "✈️",
                audio: "Máy bay bay cao trên trời"
            },
            {
                sentence: "Đồng hồ chạy đúng",
                blanks: ["Đồng hồ", "chạy", "đúng"],
                distractors: ["sai", "dừng"],
                level: 2,
                image: "⏰",
                audio: "Đồng hồ chạy đúng báo giờ"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé chơi bóng vui vẻ lắm",
                blanks: ["Bé", "chơi", "bóng", "vui", "lắm"],
                distractors: ["buồn", "xe", "búp", "ít", "nhiều"],
                level: 3,
                image: "⚽",
                audio: "Bé chơi bóng vui vẻ lắm với các bạn"
            },
            {
                sentence: "Xe ô tô chạy nhanh trên đường",
                blanks: ["Xe", "chạy", "nhanh", "trên", "đường"],
                distractors: ["chậm", "dưới", "nhà", "bay", "bơi"],
                level: 3,
                image: "🚗",
                audio: "Xe ô tô chạy nhanh trên đường phố"
            }
        ],

        // === MÀU SẮC ===
        colors: [
            // CẤP 1: Cực kỳ dễ - 2 từ
            {
                sentence: "Đỏ đẹp lắm",
                blanks: ["Đỏ", "lắm"],
                distractors: [],
                level: 1,
                image: "🔴",
                audio: "Màu đỏ đẹp lắm như hoa hồng"
            },
            {
                sentence: "Xanh mát mẻ",
                blanks: ["Xanh", "mẻ"],
                distractors: [],
                level: 1,
                image: "🔵",
                audio: "Màu xanh mát mẻ như bầu trời"
            },
            {
                sentence: "Vàng sáng rực",
                blanks: ["Vàng", "rực"],
                distractors: [],
                level: 1,
                image: "🟡",
                audio: "Màu vàng sáng rực như mặt trời"
            },
            // CẤP 2: Dễ - 3 từ
            {
                sentence: "Hoa màu đỏ đẹp",
                blanks: ["Hoa", "đỏ", "đẹp"],
                distractors: ["xanh", "xấu"],
                level: 2,
                image: "🌹",
                audio: "Hoa màu đỏ đẹp và thơm"
            },
            {
                sentence: "Trời màu xanh trong",
                blanks: ["Trời", "xanh", "trong"],
                distractors: ["đỏ", "đục"],
                level: 2,
                image: "🌤️",
                audio: "Trời màu xanh trong vắt"
            },
            // CẤP 3: Trung bình - 4-5 từ
            {
                sentence: "Bé thích màu đỏ rực rỡ",
                blanks: ["Bé", "thích", "đỏ", "rực", "rỡ"],
                distractors: ["ghét", "xanh", "vàng", "mờ", "nhạt"],
                level: 3,
                image: "🔴",
                audio: "Bé thích màu đỏ rực rỡ như hoa hồng"
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
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
