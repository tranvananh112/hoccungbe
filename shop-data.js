<<<<<<< HEAD
/* ========================================
   SHOP DATA - Cửa hàng đổi quà
   ======================================== */

(function () {
    'use strict';

    console.log('🏪 Loading shop data...');

    // ========== CỬA HÀNG NHÂN VẬT ==========
    var shopItems = [
        // Động vật dễ thương - 10-30 xu
        { id: 'cat', icon: '🐱', name: 'Mèo', price: 10, category: 'animals' },
        { id: 'dog', icon: '🐕', name: 'Chó', price: 10, category: 'animals' },
        { id: 'rabbit', icon: '🐰', name: 'Thỏ', price: 15, category: 'animals' },
        { id: 'bear', icon: '🐻', name: 'Gấu', price: 15, category: 'animals' },
        { id: 'panda', icon: '🐼', name: 'Gấu trúc', price: 20, category: 'animals' },
        { id: 'koala', icon: '🐨', name: 'Gấu túi', price: 20, category: 'animals' },
        { id: 'fox', icon: '🦊', name: 'Cáo', price: 25, category: 'animals' },
        { id: 'tiger', icon: '🐯', name: 'Hổ', price: 30, category: 'animals' },
        { id: 'lion', icon: '🦁', name: 'Sư tử', price: 30, category: 'animals' },

        // Chim - 15-25 xu
        { id: 'bird', icon: '🐦', name: 'Chim', price: 15, category: 'birds' },
        { id: 'chicken', icon: '🐔', name: 'Gà', price: 15, category: 'birds' },
        { id: 'duck', icon: '🦆', name: 'Vịt', price: 15, category: 'birds' },
        { id: 'owl', icon: '🦉', name: 'Cú', price: 20, category: 'birds' },
        { id: 'eagle', icon: '🦅', name: 'Đại bàng', price: 25, category: 'birds' },
        { id: 'parrot', icon: '🦜', name: 'Vẹt', price: 25, category: 'birds' },

        // Côn trùng - 10-20 xu
        { id: 'bee', icon: '🐝', name: 'Ong', price: 0, category: 'insects', owned: true },
        { id: 'butterfly', icon: '🦋', name: 'Bướm', price: 10, category: 'insects' },
        { id: 'ladybug', icon: '🐞', name: 'Bọ rùa', price: 15, category: 'insects' },
        { id: 'ant', icon: '🐜', name: 'Kiến', price: 10, category: 'insects' },
        { id: 'spider', icon: '🕷️', name: 'Nhện', price: 20, category: 'insects' },

        // Động vật biển - 20-35 xu
        { id: 'fish', icon: '🐟', name: 'Cá', price: 15, category: 'sea' },
        { id: 'dolphin', icon: '🐬', name: 'Cá heo', price: 25, category: 'sea' },
        { id: 'whale', icon: '🐋', name: 'Cá voi', price: 30, category: 'sea' },
        { id: 'octopus', icon: '🐙', name: 'Bạch tuộc', price: 25, category: 'sea' },
        { id: 'crab', icon: '🦀', name: 'Cua', price: 20, category: 'sea' },
        { id: 'turtle', icon: '🐢', name: 'Rùa', price: 20, category: 'sea' },
        { id: 'shark', icon: '🦈', name: 'Cá mập', price: 35, category: 'sea' },

        // Khủng long - 40-60 xu
        { id: 'trex', icon: '🦖', name: 'Khủng long T-Rex', price: 50, category: 'dino' },
        { id: 'dino', icon: '🦕', name: 'Khủng long cổ dài', price: 45, category: 'dino' },

        // Thần thoại - 50-100 xu
        { id: 'unicorn', icon: '🦄', name: 'Kỳ lân', price: 60, category: 'fantasy' },
        { id: 'dragon', icon: '🐉', name: 'Rồng', price: 80, category: 'fantasy' },
        { id: 'phoenix', icon: '🔥🦅', name: 'Phượng hoàng', price: 100, category: 'fantasy' },

        // Trái cây - 5-15 xu
        { id: 'apple', icon: '🍎', name: 'Táo', price: 5, category: 'fruits' },
        { id: 'banana', icon: '🍌', name: 'Chuối', price: 5, category: 'fruits' },
        { id: 'orange', icon: '🍊', name: 'Cam', price: 5, category: 'fruits' },
        { id: 'watermelon', icon: '🍉', name: 'Dưa hấu', price: 10, category: 'fruits' },
        { id: 'strawberry', icon: '🍓', name: 'Dâu', price: 10, category: 'fruits' },
        { id: 'grapes', icon: '🍇', name: 'Nho', price: 10, category: 'fruits' },
        { id: 'pineapple', icon: '🍍', name: 'Dứa', price: 15, category: 'fruits' },

        // Emoji vui - 10-30 xu
        { id: 'smile', icon: '😊', name: 'Mặt cười', price: 10, category: 'emoji' },
        { id: 'love', icon: '😍', name: 'Yêu thích', price: 15, category: 'emoji' },
        { id: 'cool', icon: '😎', name: 'Ngầu', price: 20, category: 'emoji' },
        { id: 'star', icon: '⭐', name: 'Ngôi sao', price: 15, category: 'emoji' },
        { id: 'heart', icon: '❤️', name: 'Trái tim', price: 15, category: 'emoji' },
        { id: 'fire', icon: '🔥', name: 'Lửa', price: 20, category: 'emoji' },
        { id: 'rainbow', icon: '🌈', name: 'Cầu vồng', price: 25, category: 'emoji' },
        { id: 'crown', icon: '👑', name: 'Vương miện', price: 30, category: 'emoji' }
    ];

    // Export to global
    window.ShopData = {
        items: shopItems,
        categories: {
            animals: { name: 'Động vật', icon: '🐾' },
            birds: { name: 'Chim', icon: '🐦' },
            insects: { name: 'Côn trùng', icon: '🐝' },
            sea: { name: 'Biển cả', icon: '🌊' },
            dino: { name: 'Khủng long', icon: '🦖' },
            fantasy: { name: 'Thần thoại', icon: '✨' },
            fruits: { name: 'Trái cây', icon: '🍎' },
            emoji: { name: 'Biểu tượng', icon: '😊' }
        }
    };

    console.log('✅ Shop loaded:', shopItems.length, 'items');

})();
=======
/* ========================================
   SHOP DATA - Cửa hàng đổi quà
   ======================================== */

(function () {
    'use strict';

    console.log('🏪 Loading shop data...');

    // ========== CỬA HÀNG NHÂN VẬT ==========
    var shopItems = [
        // Động vật dễ thương - 10-30 xu
        { id: 'cat', icon: '🐱', name: 'Mèo', price: 10, category: 'animals' },
        { id: 'dog', icon: '🐕', name: 'Chó', price: 10, category: 'animals' },
        { id: 'rabbit', icon: '🐰', name: 'Thỏ', price: 15, category: 'animals' },
        { id: 'bear', icon: '🐻', name: 'Gấu', price: 15, category: 'animals' },
        { id: 'panda', icon: '🐼', name: 'Gấu trúc', price: 20, category: 'animals' },
        { id: 'koala', icon: '🐨', name: 'Gấu túi', price: 20, category: 'animals' },
        { id: 'fox', icon: '🦊', name: 'Cáo', price: 25, category: 'animals' },
        { id: 'tiger', icon: '🐯', name: 'Hổ', price: 30, category: 'animals' },
        { id: 'lion', icon: '🦁', name: 'Sư tử', price: 30, category: 'animals' },

        // Chim - 15-25 xu
        { id: 'bird', icon: '🐦', name: 'Chim', price: 15, category: 'birds' },
        { id: 'chicken', icon: '🐔', name: 'Gà', price: 15, category: 'birds' },
        { id: 'duck', icon: '🦆', name: 'Vịt', price: 15, category: 'birds' },
        { id: 'owl', icon: '🦉', name: 'Cú', price: 20, category: 'birds' },
        { id: 'eagle', icon: '🦅', name: 'Đại bàng', price: 25, category: 'birds' },
        { id: 'parrot', icon: '🦜', name: 'Vẹt', price: 25, category: 'birds' },

        // Côn trùng - 10-20 xu
        { id: 'bee', icon: '🐝', name: 'Ong', price: 0, category: 'insects', owned: true },
        { id: 'butterfly', icon: '🦋', name: 'Bướm', price: 10, category: 'insects' },
        { id: 'ladybug', icon: '🐞', name: 'Bọ rùa', price: 15, category: 'insects' },
        { id: 'ant', icon: '🐜', name: 'Kiến', price: 10, category: 'insects' },
        { id: 'spider', icon: '🕷️', name: 'Nhện', price: 20, category: 'insects' },

        // Động vật biển - 20-35 xu
        { id: 'fish', icon: '🐟', name: 'Cá', price: 15, category: 'sea' },
        { id: 'dolphin', icon: '🐬', name: 'Cá heo', price: 25, category: 'sea' },
        { id: 'whale', icon: '🐋', name: 'Cá voi', price: 30, category: 'sea' },
        { id: 'octopus', icon: '🐙', name: 'Bạch tuộc', price: 25, category: 'sea' },
        { id: 'crab', icon: '🦀', name: 'Cua', price: 20, category: 'sea' },
        { id: 'turtle', icon: '🐢', name: 'Rùa', price: 20, category: 'sea' },
        { id: 'shark', icon: '🦈', name: 'Cá mập', price: 35, category: 'sea' },

        // Khủng long - 40-60 xu
        { id: 'trex', icon: '🦖', name: 'Khủng long T-Rex', price: 50, category: 'dino' },
        { id: 'dino', icon: '🦕', name: 'Khủng long cổ dài', price: 45, category: 'dino' },

        // Thần thoại - 50-100 xu
        { id: 'unicorn', icon: '🦄', name: 'Kỳ lân', price: 60, category: 'fantasy' },
        { id: 'dragon', icon: '🐉', name: 'Rồng', price: 80, category: 'fantasy' },
        { id: 'phoenix', icon: '🔥🦅', name: 'Phượng hoàng', price: 100, category: 'fantasy' },

        // Trái cây - 5-15 xu
        { id: 'apple', icon: '🍎', name: 'Táo', price: 5, category: 'fruits' },
        { id: 'banana', icon: '🍌', name: 'Chuối', price: 5, category: 'fruits' },
        { id: 'orange', icon: '🍊', name: 'Cam', price: 5, category: 'fruits' },
        { id: 'watermelon', icon: '🍉', name: 'Dưa hấu', price: 10, category: 'fruits' },
        { id: 'strawberry', icon: '🍓', name: 'Dâu', price: 10, category: 'fruits' },
        { id: 'grapes', icon: '🍇', name: 'Nho', price: 10, category: 'fruits' },
        { id: 'pineapple', icon: '🍍', name: 'Dứa', price: 15, category: 'fruits' },

        // Emoji vui - 10-30 xu
        { id: 'smile', icon: '😊', name: 'Mặt cười', price: 10, category: 'emoji' },
        { id: 'love', icon: '😍', name: 'Yêu thích', price: 15, category: 'emoji' },
        { id: 'cool', icon: '😎', name: 'Ngầu', price: 20, category: 'emoji' },
        { id: 'star', icon: '⭐', name: 'Ngôi sao', price: 15, category: 'emoji' },
        { id: 'heart', icon: '❤️', name: 'Trái tim', price: 15, category: 'emoji' },
        { id: 'fire', icon: '🔥', name: 'Lửa', price: 20, category: 'emoji' },
        { id: 'rainbow', icon: '🌈', name: 'Cầu vồng', price: 25, category: 'emoji' },
        { id: 'crown', icon: '👑', name: 'Vương miện', price: 30, category: 'emoji' }
    ];

    // Export to global
    window.ShopData = {
        items: shopItems,
        categories: {
            animals: { name: 'Động vật', icon: '🐾' },
            birds: { name: 'Chim', icon: '🐦' },
            insects: { name: 'Côn trùng', icon: '🐝' },
            sea: { name: 'Biển cả', icon: '🌊' },
            dino: { name: 'Khủng long', icon: '🦖' },
            fantasy: { name: 'Thần thoại', icon: '✨' },
            fruits: { name: 'Trái cây', icon: '🍎' },
            emoji: { name: 'Biểu tượng', icon: '😊' }
        }
    };

    console.log('✅ Shop loaded:', shopItems.length, 'items');

})();
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
