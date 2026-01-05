/* ========================================
   WORD THEMES - Chủ đề từ vựng phong phú
   ======================================== */

(function () {
    'use strict';

    console.log('📚 Loading word themes...');

    // ========== CHỦ ĐỀ TỪ VỰNG ==========
    var wordThemes = {
        // === GIA ĐÌNH ===
        family: {
            name: 'Gia đình',
            icon: '👨‍👩‍👧‍👦',
            color: '#FFB6C1',
            prefix: 'Đây là',
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
                { word: "BỐ MẸ", image: "👨‍👩", label: "Bố mẹ" },
                { word: "ANH EM", image: "👦👧", label: "Anh em" },
                { word: "GIA ĐÌNH", image: "👨‍👩‍👧‍👦", label: "Gia đình" },
                { word: "CÔ DÌ", image: "👩", label: "Cô dì" },
                { word: "CHÚ BÁC", image: "👨", label: "Chú bác" }
            ],
            level3: [
                { word: "BA ĐI LÀM", image: "👨‍💼", label: "Ba đi làm" },
                { word: "MẸ NẤU CƠM", image: "👩‍🍳", label: "Mẹ nấu cơm" },
                { word: "BÉ YÊU BA MẸ", image: "❤️", label: "Bé yêu ba mẹ" }
            ]
        },

        // === ĐỘNG VẬT ===
        animals: {
            name: 'Động vật',
            icon: '🐾',
            color: '#98D8C8',
            prefix: 'Đây là con',
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
                { word: "VOI", image: "🐘", label: "Voi" },
                { word: "NGỰA", image: "🐴", label: "Ngựa" },
                { word: "CỪU", image: "🐑", label: "Cừu" },
                { word: "DÊ", image: "🐐", label: "Dê" },
                { word: "LỢN", image: "🐖", label: "Lợn" },
                { word: "GẤU", image: "🐻", label: "Gấu" },
                { word: "THỎ", image: "🐰", label: "Thỏ" },
                { word: "CÁO", image: "🦊", label: "Cáo" },
                { word: "SƯ TỬ", image: "🦁", label: "Sư tử" },
                { word: "HỔ", image: "🐯", label: "Hổ" },
                { word: "BÁO", image: "🐆", label: "Báo" },
                { word: "RÙA", image: "🐢", label: "Rùa" },
                { word: "RẮN", image: "🐍", label: "Rắn" },
                { word: "ẾCH", image: "🐸", label: "Ếch" },
                { word: "CUA", image: "🦀", label: "Cua" },
                { word: "TÔM", image: "🦐", label: "Tôm" },
                { word: "MỰC", image: "🦑", label: "Mực" },
                { word: "SÒ", image: "🐚", label: "Sò" },
                { word: "SÂU", image: "🐛", label: "Sâu" },
                { word: "KIẾN", image: "🐜", label: "Kiến" },
                { word: "NHỆN", image: "🕷️", label: "Nhện" }
            ],
            level2: [
                { word: "CON MÈO", image: "🐱", label: "mèo" },
                { word: "CON CHÓ", image: "🐕", label: "chó" },
                { word: "CON VOI", image: "🐘", label: "voi" },
                { word: "CON ONG", image: "🐝", label: "ong" },
                { word: "CON BƯỚM", image: "🦋", label: "bướm" },
                { word: "CON CÁ", image: "🐟", label: "cá" },
                { word: "CON GẤU", image: "🐻", label: "gấu" },
                { word: "CON THỎ", image: "🐰", label: "thỏ" }
            ],
            level3: [
                { word: "MÈO TRẮNG", image: "🐱", label: "Mèo trắng" },
                { word: "CHÓ ĂN CƠM", image: "🐕", label: "Chó ăn cơm" },
                { word: "GÀ GÁY SÁNG", image: "🐔", label: "Gà gáy sáng" },
                { word: "CÁ BƠI NƯỚC", image: "🐟", label: "Cá bơi nước" }
            ]
        },

        // === THỨC ĂN ===
        food: {
            name: 'Thức ăn',
            icon: '🍎',
            color: '#FFE66D',
            prefix: 'Đây là món',
            level1: [
                { word: "CƠM", image: "🍚", label: "Cơm" },
                { word: "SỮA", image: "🥛", label: "Sữa" },
                { word: "BÁNH", image: "🍰", label: "Bánh" },
                { word: "QUẢ", image: "🍎", label: "Quả" },
                { word: "CAM", image: "🍊", label: "Cam" },
                { word: "CHUỐI", image: "🍌", label: "Chuối" },
                { word: "DƯA", image: "🍉", label: "Dưa" },
                { word: "ĐẬU", image: "🫘", label: "Đậu" }
            ],
            level2: [
                { word: "QUẢ TÁO", image: "🍎", label: "quả táo" },
                { word: "TRÁI CAM", image: "🍊", label: "trái cam" },
                { word: "BÁNH MÌ", image: "🍞", label: "bánh mì" },
                { word: "BÁT CƠM", image: "🍚", label: "bát cơm" },
                { word: "LY SỮA", image: "🥛", label: "ly sữa" },
                { word: "BÁNH KEM", image: "🍰", label: "bánh kem" }
            ],
            level3: [
                { word: "BÉ ĂN CƠM", image: "🍚", label: "Bé ăn cơm" },
                { word: "BÉ UỐNG SỮA", image: "🥛", label: "Bé uống sữa" },
                { word: "MẸ NẤU CƠM", image: "👩‍🍳", label: "Mẹ nấu cơm" },
                { word: "ĂN TÁO NGON", image: "🍎", label: "Ăn táo ngon" }
            ]
        },

        // === THIÊN NHIÊN ===
        nature: {
            name: 'Thiên nhiên',
            icon: '🌳',
            color: '#96CEB4',
            prefix: 'Đây là cây',
            level1: [
                { word: "HOA", image: "🌸", label: "Hoa" },
                { word: "CÂY", image: "🌳", label: "Cây" },
                { word: "LÁ", image: "🍃", label: "Lá" },
                { word: "ĐẤT", image: "🌍", label: "Đất" },
                { word: "NƯỚC", image: "💧", label: "Nước" },
                { word: "LỬA", image: "🔥", label: "Lửa" },
                { word: "GIÓ", image: "💨", label: "Gió" }
            ],
            level2: [
                { word: "HOA HỒNG", image: "🌹", label: "Hoa hồng" },
                { word: "CÂY XANH", image: "🌳", label: "Cây xanh" },
                { word: "MẶT TRỜI", image: "☀️", label: "Mặt trời" },
                { word: "MẶT TRĂNG", image: "🌙", label: "Mặt trăng" },
                { word: "NGÔI SAO", image: "⭐", label: "Ngôi sao" },
                { word: "BẦU TRỜI", image: "🌤️", label: "Bầu trời" },
                { word: "ĐÁM MÂY", image: "☁️", label: "Đám mây" }
            ],
            level3: [
                { word: "HOA NỞ ĐẸP", image: "🌸", label: "Hoa nở đẹp" },
                { word: "CÂY CAO TO", image: "🌳", label: "Cây cao to" },
                { word: "TRỜI XANH ĐẸP", image: "🌤️", label: "Trời xanh đẹp" },
                { word: "SAO SÁNG LẤP LÁNH", image: "⭐", label: "Sao sáng lấp lánh" }
            ]
        },

        // === ĐỒ VẬT ===
        objects: {
            name: 'Đồ vật',
            icon: '🎒',
            color: '#DDA0DD',
            prefix: 'Đây là cái',
            level1: [
                { word: "NHÀ", image: "🏠", label: "Nhà" },
                { word: "XE", image: "🚗", label: "Xe" },
                { word: "BÓNG", image: "⚽", label: "Bóng" },
                { word: "BÚT", image: "✏️", label: "Bút" },
                { word: "SÁCH", image: "📚", label: "Sách" },
                { word: "CẶP", image: "🎒", label: "Cặp" },
                { word: "BÀN", image: "🪑", label: "Bàn" },
                { word: "GHẾ", image: "🪑", label: "Ghế" }
            ],
            level2: [
                { word: "CÁI BÀN", image: "🪑", label: "Cái bàn" },
                { word: "CÁI GHẾ", image: "🪑", label: "Cái ghế" },
                { word: "CHIẾC XE", image: "🚗", label: "Chiếc xe" },
                { word: "QUẢ BÓNG", image: "⚽", label: "Quả bóng" },
                { word: "QUYỂN SÁCH", image: "📚", label: "Quyển sách" },
                { word: "CÁI CẶP", image: "🎒", label: "Cái cặp" }
            ],
            level3: [
                { word: "BÉ ĐI HỌC", image: "📚", label: "Bé đi học" },
                { word: "XE CHẠY NHANH", image: "🚗", label: "Xe chạy nhanh" },
                { word: "ĐÁ BÓNG VUI", image: "⚽", label: "Đá bóng vui" },
                { word: "ĐỌC SÁCH HAY", image: "📚", label: "Đọc sách hay" }
            ]
        },

        // === MÀU SẮC ===
        colors: {
            name: 'Màu sắc',
            icon: '🎨',
            color: '#FF9F43',
            prefix: 'Đây là màu',
            level1: [
                { word: "ĐỎ", image: "🔴", label: "Đỏ" },
                { word: "XANH", image: "🔵", label: "Xanh" },
                { word: "VÀNG", image: "🟡", label: "Vàng" },
                { word: "TRẮNG", image: "⚪", label: "Trắng" },
                { word: "ĐEN", image: "⚫", label: "Đen" },
                { word: "HỒNG", image: "🩷", label: "Hồng" },
                { word: "TÍM", image: "🟣", label: "Tím" }
            ],
            level2: [
                { word: "MÀU ĐỎ", image: "🔴", label: "đỏ" },
                { word: "MÀU XANH", image: "🔵", label: "xanh" },
                { word: "MÀU VÀNG", image: "🟡", label: "vàng" },
                { word: "MÀU HỒNG", image: "🩷", label: "hồng" },
                { word: "MÀU TÍM", image: "🟣", label: "tím" }
            ],
            level3: [
                { word: "HOA MÀU ĐỎ", image: "🌹", label: "Hoa màu đỏ" },
                { word: "TRỜI MÀU XANH", image: "🌤️", label: "Trời màu xanh" },
                { word: "MÈO MÀU TRẮNG", image: "🐱", label: "Mèo màu trắng" }
            ]
        },

        // === SỐ ĐẾM ===
        numbers: {
            name: 'Số đếm',
            icon: '🔢',
            color: '#74B9FF',
            prefix: 'Đây là số',
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
                { word: "SỐ MỘT", image: "1️⃣", label: "một" },
                { word: "SỐ HAI", image: "2️⃣", label: "hai" },
                { word: "SỐ BA", image: "3️⃣", label: "ba" },
                { word: "SỐ BỐN", image: "4️⃣", label: "bốn" },
                { word: "SỐ NĂM", image: "5️⃣", label: "năm" }
            ],
            level3: [
                { word: "ĐẾM MỘT HAI BA", image: "🔢", label: "Đếm một hai ba" },
                { word: "CÓ NĂM QUẢ", image: "🍎", label: "Có năm quả" },
                { word: "BA CON MÈO", image: "🐱", label: "Ba con mèo" }
            ]
        },

        // === CƠ THỂ ===
        body: {
            name: 'Cơ thể',
            icon: '👋',
            color: '#FFEAA7',
            prefix: 'Đây là cái',
            level1: [
                { word: "ĐẦU", image: "👤", label: "Đầu" },
                { word: "MẶT", image: "😊", label: "Mặt" },
                { word: "MẮT", image: "👁️", label: "Mắt" },
                { word: "MŨI", image: "👃", label: "Mũi" },
                { word: "MIỆNG", image: "👄", label: "Miệng" },
                { word: "TAY", image: "✋", label: "Tay" },
                { word: "CHÂN", image: "🦵", label: "Chân" }
            ],
            level2: [
                { word: "ĐÔI MẮT", image: "👀", label: "Đôi mắt" },
                { word: "CÁI MŨI", image: "👃", label: "Cái mũi" },
                { word: "CÁI MIỆNG", image: "👄", label: "Cái miệng" },
                { word: "ĐÔI TAY", image: "🙌", label: "Đôi tay" },
                { word: "ĐÔI CHÂN", image: "🦵", label: "Đôi chân" }
            ],
            level3: [
                { word: "MẮT SÁNG ĐẸP", image: "👁️", label: "Mắt sáng đẹp" },
                { word: "TAY VẪY CHÀO", image: "👋", label: "Tay vẫy chào" },
                { word: "CHÂN ĐI NHANH", image: "🦵", label: "Chân đi nhanh" }
            ]
        },

        // === THỜI TIẾT ===
        weather: {
            name: 'Thời tiết',
            icon: '🌤️',
            color: '#A29BFE',
            prefix: 'Trời đang',
            level1: [
                { word: "NẮNG", image: "☀️", label: "Nắng" },
                { word: "MƯA", image: "🌧️", label: "Mưa" },
                { word: "GIÓ", image: "💨", label: "Gió" },
                { word: "MÂY", image: "☁️", label: "Mây" },
                { word: "SẤM", image: "⚡", label: "Sấm" }
            ],
            level2: [
                { word: "TRỜI NẮNG", image: "☀️", label: "Trời nắng" },
                { word: "TRỜI MƯA", image: "🌧️", label: "Trời mưa" },
                { word: "GIÓ TO", image: "💨", label: "Gió to" },
                { word: "SẤM CHỚP", image: "⚡", label: "Sấm chớp" },
                { word: "CẦU VỒNG", image: "🌈", label: "Cầu vồng" }
            ],
            level3: [
                { word: "TRỜI NẮNG ĐẸP", image: "☀️", label: "Trời nắng đẹp" },
                { word: "MƯA TO GIÓ LỚN", image: "🌧️", label: "Mưa to gió lớn" },
                { word: "CẦU VỒNG ĐẸP", image: "🌈", label: "Cầu vồng đẹp" }
            ]
        },

        // === GIAO THÔNG ===
        transport: {
            name: 'Giao thông',
            icon: '🚗',
            color: '#FD79A8',
            prefix: 'Đây là chiếc',
            level1: [
                { word: "XE", image: "🚗", label: "Xe" },
                { word: "TÀU", image: "🚂", label: "Tàu" },
                { word: "MÁY BAY", image: "✈️", label: "Máy bay" },
                { word: "THUYỀN", image: "⛵", label: "Thuyền" },
                { word: "XE ĐẠP", image: "🚲", label: "Xe đạp" }
            ],
            level2: [
                { word: "XE HƠI", image: "🚗", label: "Xe hơi" },
                { word: "XE BUS", image: "🚌", label: "Xe bus" },
                { word: "TÀU HỎA", image: "🚂", label: "Tàu hỏa" },
                { word: "MÁY BAY", image: "✈️", label: "Máy bay" },
                { word: "CON THUYỀN", image: "⛵", label: "Con thuyền" }
            ],
            level3: [
                { word: "XE CHẠY NHANH", image: "🚗", label: "Xe chạy nhanh" },
                { word: "TÀU CHẠY DÀI", image: "🚂", label: "Tàu chạy dài" },
                { word: "BAY TRÊN TRỜI", image: "✈️", label: "Bay trên trời" }
            ]
        }
    };

    // Export to global
    window.WordThemes = wordThemes;

    console.log('✅ Word themes loaded:', Object.keys(wordThemes).length, 'themes');

})();
