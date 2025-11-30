<<<<<<< HEAD
/* ========================================
   MOBILE GESTURES - Touch gestures nâng cao
   Swipe, pinch, long press, haptic feedback
   ======================================== */

(function () {
    'use strict';

    console.log('👆 Loading mobile gestures...');

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // ========== GESTURE STATE ==========
    var gestureState = {
        startX: 0,
        startY: 0,
        startTime: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false,
        isLongPress: false,
        longPressTimer: null,
        element: null
    };

    // ========== SWIPE DETECTION ==========
    function detectSwipe(startX, startY, endX, endY, startTime, endTime) {
        var deltaX = endX - startX;
        var deltaY = endY - startY;
        var deltaTime = endTime - startTime;

        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);

        // Minimum swipe distance: 50px
        // Maximum swipe time: 500ms
        if (absX < 50 && absY < 50) return null;
        if (deltaTime > 500) return null;

        var direction = null;
        var velocity = 0;

        if (absX > absY) {
            // Horizontal swipe
            direction = deltaX > 0 ? 'right' : 'left';
            velocity = absX / deltaTime;
        } else {
            // Vertical swipe
            direction = deltaY > 0 ? 'down' : 'up';
            velocity = absY / deltaTime;
        }

        return {
            direction: direction,
            distance: Math.max(absX, absY),
            velocity: velocity,
            deltaX: deltaX,
            deltaY: deltaY,
            duration: deltaTime
        };
    }

    // ========== LONG PRESS DETECTION ==========
    function startLongPressDetection(element, x, y) {
        clearLongPress();

        gestureState.isLongPress = false;
        gestureState.longPressTimer = setTimeout(function () {
            gestureState.isLongPress = true;

            // Trigger long press event
            var event = new CustomEvent('longpress', {
                detail: { x: x, y: y, element: element }
            });
            element.dispatchEvent(event);

            // Haptic feedback
            if (window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.haptic('medium');
            }

            // Visual feedback
            element.classList.add('long-press-active');

            console.log('👆 Long press detected');
        }, 500); // 500ms for long press
    }

    function clearLongPress() {
        if (gestureState.longPressTimer) {
            clearTimeout(gestureState.longPressTimer);
            gestureState.longPressTimer = null;
        }

        if (gestureState.element) {
            gestureState.element.classList.remove('long-press-active');
        }
    }

    // ========== DOUBLE TAP DETECTION ==========
    var lastTapTime = 0;
    var lastTapX = 0;
    var lastTapY = 0;

    function detectDoubleTap(x, y, element) {
        var now = Date.now();
        var timeDiff = now - lastTapTime;
        var distX = Math.abs(x - lastTapX);
        var distY = Math.abs(y - lastTapY);

        // Double tap: < 300ms, < 50px distance
        if (timeDiff < 300 && distX < 50 && distY < 50) {
            // Trigger double tap event
            var event = new CustomEvent('doubletap', {
                detail: { x: x, y: y, element: element }
            });
            element.dispatchEvent(event);

            // Haptic feedback
            if (window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.haptic('light');
            }

            console.log('👆 Double tap detected');

            // Reset
            lastTapTime = 0;
            return true;
        }

        lastTapTime = now;
        lastTapX = x;
        lastTapY = y;
        return false;
    }

    // ========== ENHANCED DRAG & DROP ==========
    function setupEnhancedDragDrop() {
        var dragState = {
            element: null,
            clone: null,
            startX: 0,
            startY: 0,
            offsetX: 0,
            offsetY: 0,
            isDragging: false
        };

        // Touch start
        document.addEventListener('touchstart', function (e) {
            var target = e.target;

            // Check if draggable
            if (!target.classList.contains('draggable-letter')) return;
            if (target.classList.contains('used')) return;

            e.preventDefault();

            var touch = e.touches[0];
            var rect = target.getBoundingClientRect();

            dragState.element = target;
            dragState.startX = touch.clientX;
            dragState.startY = touch.clientY;
            dragState.offsetX = touch.clientX - rect.left;
            dragState.offsetY = touch.clientY - rect.top;
            dragState.isDragging = true;

            // Create clone
            dragState.clone = document.createElement('div');
            dragState.clone.className = 'drag-clone';
            dragState.clone.textContent = target.textContent;
            dragState.clone.style.cssText = 'position:fixed;left:' + (touch.clientX - dragState.offsetX) + 'px;' +
                'top:' + (touch.clientY - dragState.offsetY) + 'px;' +
                'width:100px;height:100px;z-index:10000;pointer-events:none;';
            document.body.appendChild(dragState.clone);

            // Visual feedback
            target.classList.add('dragging-source');

            // Haptic feedback
            if (window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.haptic('light');
            }

            // Start letter sound
            var char = target.getAttribute('data-char');
            if (char && window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.startLetterSound(char);
            }

        }, { passive: false });

        // Touch move
        document.addEventListener('touchmove', function (e) {
            if (!dragState.isDragging || !dragState.clone) return;

            e.preventDefault();

            var touch = e.touches[0];

            // Update clone position
            dragState.clone.style.left = (touch.clientX - dragState.offsetX) + 'px';
            dragState.clone.style.top = (touch.clientY - dragState.offsetY) + 'px';

            // Check for slot highlight
            dragState.clone.style.display = 'none';
            var elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            dragState.clone.style.display = '';

            // Remove all highlights
            var highlights = document.querySelectorAll('.letter-slot.highlight');
            for (var i = 0; i < highlights.length; i++) {
                highlights[i].classList.remove('highlight');
                highlights[i].style.transform = '';
            }

            // Add highlight to target slot
            if (elemBelow && elemBelow.classList.contains('letter-slot') &&
                elemBelow.classList.contains('empty')) {
                elemBelow.classList.add('highlight');
                elemBelow.style.transform = 'scale(1.3)';

                // Haptic feedback when over slot
                if (window.MobileAudioEnhanced) {
                    window.MobileAudioEnhanced.haptic('light');
                }
            }

        }, { passive: false });

        // Touch end
        document.addEventListener('touchend', function (e) {
            if (!dragState.isDragging) return;

            e.preventDefault();

            // Stop letter sound
            if (window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.stopLetterSound();
            }

            var touch = e.changedTouches[0];

            // Find element below
            if (dragState.clone) dragState.clone.style.display = 'none';
            var elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);

            // Check if dropped on slot
            if (elemBelow && elemBelow.classList.contains('letter-slot') &&
                elemBelow.classList.contains('empty')) {

                var draggedChar = dragState.element.getAttribute('data-char');
                var expectedChar = elemBelow.getAttribute('data-char');

                if (draggedChar === expectedChar) {
                    // CORRECT!
                    elemBelow.textContent = draggedChar;
                    elemBelow.classList.remove('empty');
                    elemBelow.classList.add('filled');
                    dragState.element.classList.add('used');

                    // Haptic feedback
                    if (window.MobileAudioEnhanced) {
                        window.MobileAudioEnhanced.haptic('success');
                        window.MobileAudioEnhanced.playSound('correct');
                    }

                    // Visual feedback
                    elemBelow.classList.add('haptic-feedback');
                    setTimeout(function () {
                        elemBelow.classList.remove('haptic-feedback');
                    }, 400);

                } else {
                    // WRONG!
                    // Haptic feedback
                    if (window.MobileAudioEnhanced) {
                        window.MobileAudioEnhanced.haptic('error');
                        window.MobileAudioEnhanced.playSound('wrong');
                    }

                    // Shake animation
                    elemBelow.classList.add('icon-shake');
                    setTimeout(function () {
                        elemBelow.classList.remove('icon-shake');
                    }, 500);
                }
            }

            // Cleanup
            if (dragState.clone) {
                dragState.clone.remove();
                dragState.clone = null;
            }

            if (dragState.element) {
                dragState.element.classList.remove('dragging-source');
            }

            // Remove all highlights
            var highlights = document.querySelectorAll('.letter-slot.highlight');
            for (var i = 0; i < highlights.length; i++) {
                highlights[i].classList.remove('highlight');
                highlights[i].style.transform = '';
            }

            // Reset state
            dragState.isDragging = false;
            dragState.element = null;

        }, { passive: false });
    }

    // ========== SWIPE NAVIGATION ==========
    function setupSwipeNavigation() {
        var pages = ['home', 'play', 'shop', 'profile', 'parent'];
        var currentPageIndex = 0;

        document.addEventListener('touchstart', function (e) {
            // Only on main content
            if (!e.target.closest('.main-content')) return;

            var touch = e.touches[0];
            gestureState.startX = touch.clientX;
            gestureState.startY = touch.clientY;
            gestureState.startTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            if (!e.target.closest('.main-content')) return;

            var touch = e.changedTouches[0];
            var endX = touch.clientX;
            var endY = touch.clientY;
            var endTime = Date.now();

            var swipe = detectSwipe(
                gestureState.startX,
                gestureState.startY,
                endX,
                endY,
                gestureState.startTime,
                endTime
            );

            if (swipe && (swipe.direction === 'left' || swipe.direction === 'right')) {
                // Find current page
                var activePage = document.querySelector('.page.active');
                if (activePage) {
                    var pageId = activePage.id.replace('page', '').toLowerCase();
                    currentPageIndex = pages.indexOf(pageId);

                    if (currentPageIndex !== -1) {
                        var newIndex = currentPageIndex;

                        if (swipe.direction === 'left' && currentPageIndex < pages.length - 1) {
                            newIndex = currentPageIndex + 1;
                        } else if (swipe.direction === 'right' && currentPageIndex > 0) {
                            newIndex = currentPageIndex - 1;
                        }

                        if (newIndex !== currentPageIndex) {
                            // Navigate to new page
                            if (window.showPage) {
                                window.showPage(pages[newIndex]);
                            }

                            // Haptic feedback
                            if (window.MobileAudioEnhanced) {
                                window.MobileAudioEnhanced.haptic('medium');
                            }

                            console.log('👆 Swipe navigation:', pages[newIndex]);
                        }
                    }
                }
            }
        }, { passive: true });
    }

    // ========== PULL TO REFRESH ==========
    function setupPullToRefresh() {
        var pullThreshold = 80;
        var pullDistance = 0;
        var isPulling = false;
        var startY = 0;

        document.addEventListener('touchstart', function (e) {
            var page = document.querySelector('.page.active');
            if (!page) return;

            // Only if at top of page
            if (page.scrollTop === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', function (e) {
            if (!isPulling) return;

            var currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;

            if (pullDistance > 0 && pullDistance < pullThreshold * 2) {
                // Show pull indicator
                var indicator = document.getElementById('pullRefreshIndicator');
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.id = 'pullRefreshIndicator';
                    indicator.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%);' +
                        'padding:10px 20px;background:rgba(255,255,255,0.9);border-radius:20px;' +
                        'box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:10000;transition:all 0.3s;';
                    document.body.appendChild(indicator);
                }

                var progress = Math.min(pullDistance / pullThreshold, 1);
                indicator.style.top = (pullDistance * 0.5) + 'px';
                indicator.style.opacity = progress;

                if (pullDistance >= pullThreshold) {
                    indicator.textContent = '🔄 Thả để làm mới';
                    indicator.style.background = 'rgba(152, 216, 200, 0.9)';
                } else {
                    indicator.textContent = '⬇️ Kéo xuống';
                    indicator.style.background = 'rgba(255, 255, 255, 0.9)';
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            if (!isPulling) return;

            isPulling = false;

            var indicator = document.getElementById('pullRefreshIndicator');
            if (indicator) {
                if (pullDistance >= pullThreshold) {
                    // Trigger refresh
                    indicator.textContent = '🔄 Đang làm mới...';

                    // Haptic feedback
                    if (window.MobileAudioEnhanced) {
                        window.MobileAudioEnhanced.haptic('medium');
                    }

                    setTimeout(function () {
                        location.reload();
                    }, 500);
                } else {
                    indicator.remove();
                }
            }

            pullDistance = 0;
        }, { passive: true });
    }

    // ========== INIT ==========
    function init() {
        if (!isMobile) {
            console.log('⚠️ Not mobile, skipping gestures');
            return;
        }

        console.log('👆 Initializing mobile gestures...');

        setupEnhancedDragDrop();
        setupSwipeNavigation();
        setupPullToRefresh();

        console.log('✅ Mobile gestures ready!');
    }

    // Export
    window.MobileGestures = {
        detectSwipe: detectSwipe,
        detectDoubleTap: detectDoubleTap,
        isMobile: isMobile
    };

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
=======
/* ========================================
   MOBILE GESTURES - Touch gestures nâng cao
   Swipe, pinch, long press, haptic feedback
   ======================================== */

(function () {
    'use strict';

    console.log('👆 Loading mobile gestures...');

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // ========== GESTURE STATE ==========
    var gestureState = {
        startX: 0,
        startY: 0,
        startTime: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false,
        isLongPress: false,
        longPressTimer: null,
        element: null
    };

    // ========== SWIPE DETECTION ==========
    function detectSwipe(startX, startY, endX, endY, startTime, endTime) {
        var deltaX = endX - startX;
        var deltaY = endY - startY;
        var deltaTime = endTime - startTime;

        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);

        // Minimum swipe distance: 50px
        // Maximum swipe time: 500ms
        if (absX < 50 && absY < 50) return null;
        if (deltaTime > 500) return null;

        var direction = null;
        var velocity = 0;

        if (absX > absY) {
            // Horizontal swipe
            direction = deltaX > 0 ? 'right' : 'left';
            velocity = absX / deltaTime;
        } else {
            // Vertical swipe
            direction = deltaY > 0 ? 'down' : 'up';
            velocity = absY / deltaTime;
        }

        return {
            direction: direction,
            distance: Math.max(absX, absY),
            velocity: velocity,
            deltaX: deltaX,
            deltaY: deltaY,
            duration: deltaTime
        };
    }

    // ========== LONG PRESS DETECTION ==========
    function startLongPressDetection(element, x, y) {
        clearLongPress();

        gestureState.isLongPress = false;
        gestureState.longPressTimer = setTimeout(function () {
            gestureState.isLongPress = true;

            // Trigger long press event
            var event = new CustomEvent('longpress', {
                detail: { x: x, y: y, element: element }
            });
            element.dispatchEvent(event);

            // Haptic feedback
            if (window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.haptic('medium');
            }

            // Visual feedback
            element.classList.add('long-press-active');

            console.log('👆 Long press detected');
        }, 500); // 500ms for long press
    }

    function clearLongPress() {
        if (gestureState.longPressTimer) {
            clearTimeout(gestureState.longPressTimer);
            gestureState.longPressTimer = null;
        }

        if (gestureState.element) {
            gestureState.element.classList.remove('long-press-active');
        }
    }

    // ========== DOUBLE TAP DETECTION ==========
    var lastTapTime = 0;
    var lastTapX = 0;
    var lastTapY = 0;

    function detectDoubleTap(x, y, element) {
        var now = Date.now();
        var timeDiff = now - lastTapTime;
        var distX = Math.abs(x - lastTapX);
        var distY = Math.abs(y - lastTapY);

        // Double tap: < 300ms, < 50px distance
        if (timeDiff < 300 && distX < 50 && distY < 50) {
            // Trigger double tap event
            var event = new CustomEvent('doubletap', {
                detail: { x: x, y: y, element: element }
            });
            element.dispatchEvent(event);

            // Haptic feedback
            if (window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.haptic('light');
            }

            console.log('👆 Double tap detected');

            // Reset
            lastTapTime = 0;
            return true;
        }

        lastTapTime = now;
        lastTapX = x;
        lastTapY = y;
        return false;
    }

    // ========== ENHANCED DRAG & DROP ==========
    function setupEnhancedDragDrop() {
        var dragState = {
            element: null,
            clone: null,
            startX: 0,
            startY: 0,
            offsetX: 0,
            offsetY: 0,
            isDragging: false
        };

        // Touch start
        document.addEventListener('touchstart', function (e) {
            var target = e.target;

            // Check if draggable
            if (!target.classList.contains('draggable-letter')) return;
            if (target.classList.contains('used')) return;

            e.preventDefault();

            var touch = e.touches[0];
            var rect = target.getBoundingClientRect();

            dragState.element = target;
            dragState.startX = touch.clientX;
            dragState.startY = touch.clientY;
            dragState.offsetX = touch.clientX - rect.left;
            dragState.offsetY = touch.clientY - rect.top;
            dragState.isDragging = true;

            // Create clone
            dragState.clone = document.createElement('div');
            dragState.clone.className = 'drag-clone';
            dragState.clone.textContent = target.textContent;
            dragState.clone.style.cssText = 'position:fixed;left:' + (touch.clientX - dragState.offsetX) + 'px;' +
                'top:' + (touch.clientY - dragState.offsetY) + 'px;' +
                'width:100px;height:100px;z-index:10000;pointer-events:none;';
            document.body.appendChild(dragState.clone);

            // Visual feedback
            target.classList.add('dragging-source');

            // Haptic feedback
            if (window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.haptic('light');
            }

            // Start letter sound
            var char = target.getAttribute('data-char');
            if (char && window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.startLetterSound(char);
            }

        }, { passive: false });

        // Touch move
        document.addEventListener('touchmove', function (e) {
            if (!dragState.isDragging || !dragState.clone) return;

            e.preventDefault();

            var touch = e.touches[0];

            // Update clone position
            dragState.clone.style.left = (touch.clientX - dragState.offsetX) + 'px';
            dragState.clone.style.top = (touch.clientY - dragState.offsetY) + 'px';

            // Check for slot highlight
            dragState.clone.style.display = 'none';
            var elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            dragState.clone.style.display = '';

            // Remove all highlights
            var highlights = document.querySelectorAll('.letter-slot.highlight');
            for (var i = 0; i < highlights.length; i++) {
                highlights[i].classList.remove('highlight');
                highlights[i].style.transform = '';
            }

            // Add highlight to target slot
            if (elemBelow && elemBelow.classList.contains('letter-slot') &&
                elemBelow.classList.contains('empty')) {
                elemBelow.classList.add('highlight');
                elemBelow.style.transform = 'scale(1.3)';

                // Haptic feedback when over slot
                if (window.MobileAudioEnhanced) {
                    window.MobileAudioEnhanced.haptic('light');
                }
            }

        }, { passive: false });

        // Touch end
        document.addEventListener('touchend', function (e) {
            if (!dragState.isDragging) return;

            e.preventDefault();

            // Stop letter sound
            if (window.MobileAudioEnhanced) {
                window.MobileAudioEnhanced.stopLetterSound();
            }

            var touch = e.changedTouches[0];

            // Find element below
            if (dragState.clone) dragState.clone.style.display = 'none';
            var elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);

            // Check if dropped on slot
            if (elemBelow && elemBelow.classList.contains('letter-slot') &&
                elemBelow.classList.contains('empty')) {

                var draggedChar = dragState.element.getAttribute('data-char');
                var expectedChar = elemBelow.getAttribute('data-char');

                if (draggedChar === expectedChar) {
                    // CORRECT!
                    elemBelow.textContent = draggedChar;
                    elemBelow.classList.remove('empty');
                    elemBelow.classList.add('filled');
                    dragState.element.classList.add('used');

                    // Haptic feedback
                    if (window.MobileAudioEnhanced) {
                        window.MobileAudioEnhanced.haptic('success');
                        window.MobileAudioEnhanced.playSound('correct');
                    }

                    // Visual feedback
                    elemBelow.classList.add('haptic-feedback');
                    setTimeout(function () {
                        elemBelow.classList.remove('haptic-feedback');
                    }, 400);

                } else {
                    // WRONG!
                    // Haptic feedback
                    if (window.MobileAudioEnhanced) {
                        window.MobileAudioEnhanced.haptic('error');
                        window.MobileAudioEnhanced.playSound('wrong');
                    }

                    // Shake animation
                    elemBelow.classList.add('icon-shake');
                    setTimeout(function () {
                        elemBelow.classList.remove('icon-shake');
                    }, 500);
                }
            }

            // Cleanup
            if (dragState.clone) {
                dragState.clone.remove();
                dragState.clone = null;
            }

            if (dragState.element) {
                dragState.element.classList.remove('dragging-source');
            }

            // Remove all highlights
            var highlights = document.querySelectorAll('.letter-slot.highlight');
            for (var i = 0; i < highlights.length; i++) {
                highlights[i].classList.remove('highlight');
                highlights[i].style.transform = '';
            }

            // Reset state
            dragState.isDragging = false;
            dragState.element = null;

        }, { passive: false });
    }

    // ========== SWIPE NAVIGATION ==========
    function setupSwipeNavigation() {
        var pages = ['home', 'play', 'shop', 'profile', 'parent'];
        var currentPageIndex = 0;

        document.addEventListener('touchstart', function (e) {
            // Only on main content
            if (!e.target.closest('.main-content')) return;

            var touch = e.touches[0];
            gestureState.startX = touch.clientX;
            gestureState.startY = touch.clientY;
            gestureState.startTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            if (!e.target.closest('.main-content')) return;

            var touch = e.changedTouches[0];
            var endX = touch.clientX;
            var endY = touch.clientY;
            var endTime = Date.now();

            var swipe = detectSwipe(
                gestureState.startX,
                gestureState.startY,
                endX,
                endY,
                gestureState.startTime,
                endTime
            );

            if (swipe && (swipe.direction === 'left' || swipe.direction === 'right')) {
                // Find current page
                var activePage = document.querySelector('.page.active');
                if (activePage) {
                    var pageId = activePage.id.replace('page', '').toLowerCase();
                    currentPageIndex = pages.indexOf(pageId);

                    if (currentPageIndex !== -1) {
                        var newIndex = currentPageIndex;

                        if (swipe.direction === 'left' && currentPageIndex < pages.length - 1) {
                            newIndex = currentPageIndex + 1;
                        } else if (swipe.direction === 'right' && currentPageIndex > 0) {
                            newIndex = currentPageIndex - 1;
                        }

                        if (newIndex !== currentPageIndex) {
                            // Navigate to new page
                            if (window.showPage) {
                                window.showPage(pages[newIndex]);
                            }

                            // Haptic feedback
                            if (window.MobileAudioEnhanced) {
                                window.MobileAudioEnhanced.haptic('medium');
                            }

                            console.log('👆 Swipe navigation:', pages[newIndex]);
                        }
                    }
                }
            }
        }, { passive: true });
    }

    // ========== PULL TO REFRESH ==========
    function setupPullToRefresh() {
        var pullThreshold = 80;
        var pullDistance = 0;
        var isPulling = false;
        var startY = 0;

        document.addEventListener('touchstart', function (e) {
            var page = document.querySelector('.page.active');
            if (!page) return;

            // Only if at top of page
            if (page.scrollTop === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', function (e) {
            if (!isPulling) return;

            var currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;

            if (pullDistance > 0 && pullDistance < pullThreshold * 2) {
                // Show pull indicator
                var indicator = document.getElementById('pullRefreshIndicator');
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.id = 'pullRefreshIndicator';
                    indicator.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%);' +
                        'padding:10px 20px;background:rgba(255,255,255,0.9);border-radius:20px;' +
                        'box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:10000;transition:all 0.3s;';
                    document.body.appendChild(indicator);
                }

                var progress = Math.min(pullDistance / pullThreshold, 1);
                indicator.style.top = (pullDistance * 0.5) + 'px';
                indicator.style.opacity = progress;

                if (pullDistance >= pullThreshold) {
                    indicator.textContent = '🔄 Thả để làm mới';
                    indicator.style.background = 'rgba(152, 216, 200, 0.9)';
                } else {
                    indicator.textContent = '⬇️ Kéo xuống';
                    indicator.style.background = 'rgba(255, 255, 255, 0.9)';
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            if (!isPulling) return;

            isPulling = false;

            var indicator = document.getElementById('pullRefreshIndicator');
            if (indicator) {
                if (pullDistance >= pullThreshold) {
                    // Trigger refresh
                    indicator.textContent = '🔄 Đang làm mới...';

                    // Haptic feedback
                    if (window.MobileAudioEnhanced) {
                        window.MobileAudioEnhanced.haptic('medium');
                    }

                    setTimeout(function () {
                        location.reload();
                    }, 500);
                } else {
                    indicator.remove();
                }
            }

            pullDistance = 0;
        }, { passive: true });
    }

    // ========== INIT ==========
    function init() {
        if (!isMobile) {
            console.log('⚠️ Not mobile, skipping gestures');
            return;
        }

        console.log('👆 Initializing mobile gestures...');

        setupEnhancedDragDrop();
        setupSwipeNavigation();
        setupPullToRefresh();

        console.log('✅ Mobile gestures ready!');
    }

    // Export
    window.MobileGestures = {
        detectSwipe: detectSwipe,
        detectDoubleTap: detectDoubleTap,
        isMobile: isMobile
    };

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
