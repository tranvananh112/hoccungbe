/* ========================================
   TỪ VỰNG TỐI ƯU CHO EM BÉ
   Phân loại theo độ khó phù hợp
   ======================================== */

(function () {
    'use strict';

    console.log('📚 Loading optimized word data...');

    // ========== NGUYÊN TẮC PHÂN CẤP ==========
    // CẤP 1: 2-3 chữ cái, từ đơn giản
    // CẤP 2: 3-4 chữ cái, từ quen thuộc
    // CẤP 3: 4-5 chữ cái, cụm từ ngắn
    // CẤP 4: 5-7 chữ cái, cụm từ dài
    // CẤP 5: 7+ chữ cái, câu đơn giản

    var optimizedThemes = {
        // === ĐỘNG VẬT ===
        animals: {
            name: 'Động vật',
            icon: '🐾',
            color: '#98D8C8',

            // CẤP 1: Từ 2-3 chữ, siêu dễ
            level1: [
                { word: "MÈO", image: "🐱", label: "Mèo" },
                { word: "CHÓ", image: "🐕", label: "Chó" },
                { word: "GÀ", image: "🐔", label: "Gà" },
                { word: "VỊT", image: "🦆", label: "Vịt" },
                { word: "BÒ", image: "🐄", label: "Bò" },
                { word: "HEO", image: "🐷", label: "Heo" },
                { word: "CÁ", image: "🐟", label: "Cá" },
                { word: "ONG", image: "🐝", label: "Ong" },
                { word: "KHỈ", image: "🐵", label: "Khỉ" },
                { word: "VOI", image: "🐘", label: "Voi" }
            ],

            // CẤP 2: Từ 3-4 chữ
            level2: [
                { word: "NGỰA", image: "🐴", label: "Ngựa" },
                { word: "CỪU", image: "🐑", label: "Cừu" },
                { word: "GẤU", image: "🐻", label: "Gấu" },
                { word: "THỎ", image: "🐰", label: "Thỏ" },
                { word: "CÁO", image: "🦊", label: "Cáo" },
                { word: "RÙA", image: "🐢", label: "Rùa" },
                { word: "RẮN", image: "🐍", label: "Rắn" },
                { word: "ẾCH", image: "🐸", label: "Ếch" },
                { word: "CUA", image: "🦀", label: "Cua" },
                { word: "TÔM", image: "🦐", label: "Tôm" }
            ],

            // CẤP 3: Cụm từ 4-5 chữ
            level3: [
                { word: "CON MÈO", image: "🐱", label: "Con mèo" },
                { word: "CON CHÓ", image: "🐕", label: "Con chó" },
                { word: "CON VOI", image: "🐘", label: "Con voi" },
                { word: "CON ONG", image: "🐝", label: "Con ong" },
                { word: "CON GẤU", image: "🐻", label: "Con gấu" },
                { word: "CON THỎ", image: "🐰", label: "Con thỏ" },
                { word: "CON CÁ", image: "🐟", label: "Con cá" },
                { word: "CON GÀ", image: "🐔", label: "Con gà" }
            ],

            // CẤP 4: Cụm từ 5-7 chữ
            level4: [
                { word: "MÈO TRẮNG", image: "🐱", label: "Mèo trắng" },
                { word: "CHÓ NÂU", image: "🐕", label: "Chó nâu" },
                { word: "GÀ MÁI", image: "🐔", label: "Gà mái" },
                { word: "VỊT BƠI", image: "🦆", label: "Vịt bơi" },
                { word: "CÁ VÀNG", image: "🐟", label: "Cá vàng" },
                { word: "ONG VÀN", image: "🐝", label: "Ong vàng" }
            ],

            // CẤP 5: Câu đơn giản 7+ chữ
            level5: [
                { word: "MÈO ĂN CÁ", image: "🐱", label: "Mèo ăn cá" },
                { word: "CHÓ ĂN CƠM", image: "🐕", label: "Chó ăn cơm" },
                { word: "GÀ GÁY SÁNG", image: "🐔", label: "Gà gáy sáng" },
                { word: "CÁ BƠI NƯỚC", image: "🐟", label: "Cá bơi nước" },
                { word: "ONG BAY HOA", image: "🐝", label: "Ong bay hoa" }
            ]
        },

        // === GIA ĐÌNH ===
        family: {
            name: 'Gia đình',
            icon: '👨‍👩‍👧‍👦',
            color: '#FFB6C1',

            level1: [
                { word: "BA", image: "👨", label: "Ba" },
                { word: "MẸ", image: "👩", label: "Mẹ" },
                { word: "ÔNG", image: "👴", label: "Ông" },
                { word: "BÀ", image: "👵", label: "Bà" },
                { word: "ANH", image: "👦", label: "Anh" },
                { word: "CHỊ", image: "👧", label: "Chị" },
                { word: "EM", image: "👶", label: "Em" }
            ],

            level2: [
                { word: "BỐ", image: "👨", label: "Bố" },
                { word: "MẸ", image: "👩", label: "Mẹ" },
                { word: "CON", image: "👶", label: "Con" },
                { word: "CÔ", image: "👩", label: "Cô" },
                { word: "CHÚ", image: "👨", label: "Chú" },
                { word: "DÌ", image: "👩", label: "Dì" },
                { word: "BÁC", image: "👨", label: "Bác" }
            ],

            level3: [
                { word: "BỐ MẸ", image: "👨‍👩", label: "Bố mẹ" },
                { word: "ANH EM", image: "👦👧", label: "Anh em" },
                { word: "CÔ DÌ", image: "👩", label: "Cô dì" },
                { word: "CHÚ BÁC", image: "👨", label: "Chú bác" }
            ],

            level4: [
                { word: "GIA ĐÌNH", image: "👨‍👩‍👧‍👦", label: "Gia đình" },
                { word: "BA ĐI LÀM", image: "👨‍💼", label: "Ba đi làm" },
                { word: "MẸ NẤU CƠM", image: "👩‍🍳", label: "Mẹ nấu cơm" }
            ],

            level5: [
                { word: "BÉ YÊU BA MẸ", image: "❤️", label: "Bé yêu ba mẹ" },
                { word: "BA MẸ YÊU CON", image: "❤️", label: "Ba mẹ yêu con" },
                { word: "GIA ĐÌNH VUI VẺ", image: "👨‍👩‍👧‍👦", label: "Gia đình vui vẻ" }
            ]
        },

        // === MÀU SẮC ===
        colors: {
            name: 'Màu sắc',
            icon: '🎨',
            color: '#FFE66D',

            level1: [
                { word: "ĐỎ", image: "🔴", label: "Đỏ" },
                { word: "XANH", image: "🔵", label: "Xanh" },
                { word: "VÀNG", image: "🟡", label: "Vàng" },
                { word: "TÍM", image: "🟣", label: "Tím" },
                { word: "CAM", image: "🟠", label: "Cam" },
                { word: "HỒNG", image: "🩷", label: "Hồng" }
            ],

            level2: [
                { word: "TRẮNG", image: "⚪", label: "Trắng" },
                { word: "ĐEN", image: "⚫", label: "Đen" },
                { word: "NÂU", image: "🟤", label: "Nâu" },
                { word: "XÁM", image: "⚪", label: "Xám" }
            ],

            level3: [
                { word: "MÀU ĐỎ", image: "🔴", label: "Màu đỏ" },
                { word: "MÀU XANH", image: "🔵", label: "Màu xanh" },
                { word: "MÀU VÀNG", image: "🟡", label: "Màu vàng" }
            ],

            level4: [
                { word: "ĐỎ TƯƠi", image: "🔴", label: "Đỏ tươi" },
                { word: "XANH LÁ", image: "🟢", label: "Xanh lá" },
                { word: "VÀNG CHANH", image: "🟡", label: "Vàng chanh" }
            ],

            level5: [
                { word: "HOA MÀU ĐỎ", image: "🌹", label: "Hoa màu đỏ" },
                { word: "CÂY MÀU XANH", image: "🌳", label: "Cây màu xanh" },
                { word: "TRỜI MÀU XANH", image: "🌤️", label: "Trời màu xanh" }
            ]
        },

        // === SỐ ĐẾM ===
        numbers: {
            name: 'Số đếm',
            icon: '🔢',
            color: '#74B9FF',

            level1: [
                { word: "MỘT", image: "1️⃣", label: "Một" },
                { word: "HAI", image: "2️⃣", label: "Hai" },
                { word: "BA", image: "3️⃣", label: "Ba" },
                { word: "BỐN", image: "4️⃣", label: "Bốn" },
                { word: "NĂM", image: "5️⃣", label: "Năm" },
                { word: "SÁU", image: "6️⃣", label: "Sáu" },
                { word: "BẢY", image: "7️⃣", label: "Bảy" },
                { word: "TÁM", image: "8️⃣", label: "Tám" },
                { word: "CHÍN", image: "9️⃣", label: "Chín" },
                { word: "MƯỜI", image: "🔟", label: "Mười" }
            ],

            level2: [
                { word: "KHÔNG", image: "0️⃣", label: "Không" },
                { word: "TRĂM", image: "💯", label: "Trăm" },
                { word: "NGHÌN", image: "🔢", label: "Nghìn" }
            ],

            level3: [
                { word: "SỐ MỘT", image: "1️⃣", label: "Số một" },
                { word: "SỐ HAI", image: "2️⃣", label: "Số hai" },
                { word: "SỐ BA", image: "3️⃣", label: "Số ba" }
            ],

            level4: [
                { word: "MỘT CON MÈO", image: "🐱", label: "Một con mèo" },
                { word: "HAI CON CHÓ", image: "🐕🐕", label: "Hai con chó" },
                { word: "BA CON GÀ", image: "🐔🐔🐔", label: "Ba con gà" }
            ],

            level5: [
                { word: "ĐẾM MỘT ĐẾN MƯỜI", image: "🔢", label: "Đếm một đến mười" },
                { word: "BÉ ĐẾM SỐ", image: "👶", label: "Bé đếm số" }
            ]
        },

        // === THỨC ĂN ===
        food: {
            name: 'Thức ăn',
            icon: '🍎',
            color: '#FF9F43',

            level1: [
                { word: "CƠM", image: "🍚", label: "Cơm" },
                { word: "PHỞ", image: "🍜", label: "Phở" },
                { word: "BÚN", image: "🍜", label: "Bún" },
                { word: "BÁNH", image: "🍰", label: "Bánh" },
                { word: "SỮA", image: "🥛", label: "Sữa" },
                { word: "NƯỚC", image: "💧", label: "Nước" }
            ],

            level2: [
                { word: "TÁO", image: "🍎", label: "Táo" },
                { word: "CAM", image: "🍊", label: "Cam" },
                { word: "CHUỐI", image: "🍌", label: "Chuối" },
                { word: "DƯA", image: "🍉", label: "Dưa" },
                { word: "ĐÀO", image: "🍑", label: "Đào" }
            ],

            level3: [
                { word: "QUẢ TÁO", image: "🍎", label: "Quả táo" },
                { word: "QUẢ CAM", image: "🍊", label: "Quả cam" },
                { word: "BÁNH MÌ", image: "🍞", label: "Bánh mì" }
            ],

            level4: [
                { word: "ĂN CƠM", image: "🍚", label: "Ăn cơm" },
                { word: "UỐNG SỮA", image: "🥛", label: "Uống sữa" },
                { word: "ĂN BÁNH", image: "🍰", label: "Ăn bánh" }
            ],

            level5: [
                { word: "BÉ ĂN CƠM NGON", image: "🍚", label: "Bé ăn cơm ngon" },
                { word: "UỐNG SỮA MỖI NGÀY", image: "🥛", label: "Uống sữa mỗi ngày" }
            ]
        }
    };

    // Export
    window.OptimizedWordData = optimizedThemes;

    console.log('✅ Optimized word data loaded');

})();
