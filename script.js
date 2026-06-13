(function() {
    // --- TAB SWITCHING WITH INDICATOR ---
    const desktopNav = document.getElementById('desktopNav');
    const mobileMenuContainer = document.getElementById('mobileMenuContainer');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const header = document.getElementById('header');
    const tabContents = document.querySelectorAll('.tab-content');
    let indicator = document.querySelector('.tab-indicator');

    function updateIndicator(tabElement) {
        if (!indicator || window.innerWidth <= 900) return;
        const rect = tabElement.getBoundingClientRect();
        const parentRect = desktopNav.getBoundingClientRect();
        indicator.style.width = rect.width + 'px';
        indicator.style.left = (rect.left - parentRect.left) + 'px';
        indicator.style.height = rect.height + 'px';
        indicator.style.top = (rect.top - parentRect.top) + 'px';
    }

    function switchTab(tabId) {
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(btn => btn.classList.add('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(`tab-${tabId}`);
        if (targetContent) targetContent.classList.add('active');
        closeMobileMenu();
        const activeTabElem = document.querySelector('.nav-tab.active');
        if (activeTabElem && window.innerWidth > 900) updateIndicator(activeTabElem);
        if (history.pushState) history.pushState(null, null, '#' + tabId);
    }

    function populateMobileMenu() {
        const desktopBtns = desktopNav.querySelectorAll('.nav-tab');
        mobileMenuContainer.innerHTML = '';
        desktopBtns.forEach(btn => {
            const clone = btn.cloneNode(true);
            clone.classList.remove('active');
            mobileMenuContainer.appendChild(clone);
        });
    }
    populateMobileMenu();

    function openMobileMenu() {
        mobileOverlay.classList.add('show');
        mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
        document.body.style.overflow = 'hidden';
        const activeTabId = document.querySelector('.nav-tab.active')?.getAttribute('data-tab');
        if (activeTabId) {
            mobileMenuContainer.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
            const activeMobile = mobileMenuContainer.querySelector(`[data-tab="${activeTabId}"]`);
            if (activeMobile) activeMobile.classList.add('active');
        }
    }

    function closeMobileMenu() {
        mobileOverlay.classList.remove('show');
        mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined">menu</span>';
        document.body.style.overflow = '';
    }

    document.body.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.nav-tab');
        if (tabBtn) {
            e.preventDefault();
            const tabId = tabBtn.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        }
    });

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileOverlay.classList.contains('show') ? closeMobileMenu() : openMobileMenu();
    });

    mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) closeMobileMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('show')) closeMobileMenu();
    });

    document.getElementById('logoLink').addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('home');
    });

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const activeTabElem = document.querySelector('.nav-tab.active');
            if (activeTabElem && window.innerWidth > 900) updateIndicator(activeTabElem);
        }, 100);
    });

    // ======================================================
    //          ГАЛЕРЕЯ (33 фото) – ПРОФЕССИОНАЛЬНО
    // ======================================================
    const slider = document.getElementById('slider');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');
    const counter = document.getElementById('sliderCounter');

    if (!slider || !prevBtn || !nextBtn) return; // если чего-то нет – не продолжаем

    // ---------- НАСТРОЙКИ (измените под свои файлы) ----------
    const PHOTO_COUNT = 33;
    const START_NUM = 4;          // 2.png
    const END_NUM = 32;           // 34.png   (всего 33 файла: 2,3…34)
    const IMG_PATH = 'photos/';   // если фото лежат прямо в корне, поставьте ''
    const IMG_EXT = '.png';      // замените на .png, .jpg, .webp по необходимости

    // ---------------------------------------------------------
    let currentIndex = 0;
    const totalSlides = END_NUM - START_NUM + 1;   // 33
    let slides = [];

    function createSlide(index, photoNumber) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        if (index === 0) slide.classList.add('active');

        const img = document.createElement('img');
        img.src = `${IMG_PATH}${photoNumber}${IMG_EXT}`;
        img.alt = `Фото ${photoNumber}`;
        img.loading = 'lazy';

        // Если картинка не загрузилась – показываем заглушку
        img.addEventListener('error', () => {
            img.remove(); // удаляем битый тег
            const placeholder = document.createElement('div');
            placeholder.className = 'slide-placeholder';
            placeholder.textContent = `${photoNumber}`;
            slide.prepend(placeholder);
            console.warn(`Изображение не найдено: ${img.src}`);
        });

        const caption = document.createElement('div');
        caption.className = 'slide-caption';

        slide.appendChild(img);
        slide.appendChild(caption);
        return slide;
    }

    function buildSlides() {
        const fragment = document.createDocumentFragment();
        let idx = 0;
        for (let num = START_NUM; num <= END_NUM; num++) {
            fragment.appendChild(createSlide(idx, num));
            idx++;
        }
        slider.innerHTML = '';
        slider.appendChild(fragment);
        slides = document.querySelectorAll('#slider .slide');
    }

    function updateSlider() {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });
        // точки
        if (dotsContainer) {
            const dots = dotsContainer.children;
            for (let i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('active', i === currentIndex);
            }
        }
        // счётчик
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
        }
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // --- Инициализация ---
    buildSlides();
    createDots();
    updateSlider();

    // Навигация
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    // Свайп на мобильных
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 50) {
            if (diff < 0) {
                currentIndex = (currentIndex + 1) % totalSlides;
            } else {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            }
            updateSlider();
        }
    });

    // --- ROUTE BUILDER ---
    const buildBtn = document.getElementById('buildRouteBtn');
    const startInput = document.getElementById('startPoint');
    const destination = 'Минск, ул. Макаёнка, 8';

    if (buildBtn && startInput) {
        buildBtn.addEventListener('click', () => {
            const start = startInput.value.trim();
            if (!start) {
                alert('Пожалуйста, введите точку отправления');
                return;
            }
            const url = `https://yandex.ru/maps/?rtext=${encodeURIComponent(start)}~${encodeURIComponent(destination)}&rtt=auto`;
            window.open(url, '_blank');
        });
    }

    function restoreFromHash() {
        const hash = window.location.hash.slice(1);
        if (['home','history','teacher','gallery','works','program','directions'].includes(hash)) {
            switchTab(hash);
        } else {
            switchTab('home');
        }
    }

    window.addEventListener('load', () => {
        if (indicator && window.innerWidth > 900) {
            const activeTab = document.querySelector('.nav-tab.active');
            if (activeTab) updateIndicator(activeTab);
        }
    });
    restoreFromHash();
    window.addEventListener('hashchange', restoreFromHash);
})();
