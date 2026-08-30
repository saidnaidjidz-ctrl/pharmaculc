/* ==================== APP.JS - MAIN APPLICATION LOGIC ==================== */

class App {
    static currentPage = 'page2';

    static init() {
        // Initialize Internationalization
        if (typeof I18n !== 'undefined' && I18n.init) {
            I18n.init();
        }

        this.initTheme();
        this.attachNavigation();
        this.attachGlobalHandlers();
        this.attachLanguageHandlers();
        this.showPage('page2');
    }

    static initTheme() {
        const isDarkMode = storage.getDarkMode();
        if (isDarkMode) {
            this.enableDarkMode();
        } else {
            this.disableDarkMode();
        }
    }

    static attachNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const pageId = link.dataset.page;
                if (pageId) {
                    this.showPage(pageId);
                }
            });
        });

        this.initNavScroll();
    }

    static initNavScroll() {
        const navMenu = document.getElementById('navMenu');
        const prevBtn = document.getElementById('navScrollPrev');
        const nextBtn = document.getElementById('navScrollNext');
        if (!navMenu) return;

        const updateScroll = () => {
            const wrapper = document.getElementById('navMenuWrapper');
            if (!wrapper) return;

            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            const maxScroll = navMenu.scrollWidth - navMenu.clientWidth;

            if (maxScroll <= 4) {
                wrapper.classList.remove('can-scroll-start', 'can-scroll-end');
                if (prevBtn) prevBtn.classList.remove('visible');
                if (nextBtn) nextBtn.classList.remove('visible');
                return;
            }

            const currentScroll = Math.abs(navMenu.scrollLeft);

            // Start & End indicators
            if (currentScroll > 8) {
                wrapper.classList.add('can-scroll-start');
                if (prevBtn) prevBtn.classList.add('visible');
            } else {
                wrapper.classList.remove('can-scroll-start');
                if (prevBtn) prevBtn.classList.remove('visible');
            }

            if (currentScroll < maxScroll - 8) {
                wrapper.classList.add('can-scroll-end');
                if (nextBtn) nextBtn.classList.add('visible');
            } else {
                wrapper.classList.remove('can-scroll-end');
                if (nextBtn) nextBtn.classList.remove('visible');
            }
        };

        navMenu.addEventListener('scroll', updateScroll, { passive: true });
        window.addEventListener('resize', updateScroll, { passive: true });

        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
                const direction = isRtl ? 160 : -160;
                navMenu.scrollBy({ left: direction, behavior: 'smooth' });
            };
        }

        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
                const direction = isRtl ? -160 : 160;
                navMenu.scrollBy({ left: direction, behavior: 'smooth' });
            };
        }

        // Initial check
        setTimeout(updateScroll, 100);
    }

    static attachLanguageHandlers() {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.dataset.lang;
                if (lang && typeof I18n !== 'undefined') {
                    I18n.setLanguage(lang, true);
                    this.initNavScroll();
                    UIUtils.showToast(I18n.t('appName') + ' — ' + (lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : (lang === 'fr' ? 'Langue changée en Français' : 'Language changed to English')), 'info', 2000);
                }
            });
        });
    }

    static showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Update nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Show selected page
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
        }

        // Update nav link
        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            // Smoothly center the active tab into view on mobile
            try {
                activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } catch (err) {}
        }

        this.currentPage = pageId;

        // Refresh dashboard when navigating to it
        if (pageId === 'page4' && typeof Page4 !== 'undefined' && Page4.refresh) {
            setTimeout(() => Page4.refresh(), 50);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    static attachGlobalHandlers() {
        // Dark Mode Toggle
        const darkModeBtn = document.getElementById('darkModeBtn');
        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    this.disableDarkMode();
                } else {
                    this.enableDarkMode();
                }
            });
        }

        // Help Button
        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                UIUtils.toggleModal('helpModal', true);
            });
        }

        // Help Modal Close
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            const closeBtn = helpModal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    UIUtils.toggleModal('helpModal', false);
                });
            }

            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    UIUtils.toggleModal('helpModal', false);
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                this.showPage('page2');
            } else if (e.altKey && e.key === '2') {
                e.preventDefault();
                this.showPage('year2-page');
            } else if (e.altKey && e.key === '3') {
                e.preventDefault();
                this.showPage('year3-page');
            } else if (e.altKey && e.key === '4') {
                e.preventDefault();
                this.showPage('year4-page');
            } else if (e.altKey && e.key === '5') {
                e.preventDefault();
                this.showPage('year5-page');
            } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                this.showPage('page3');
            } else if (e.altKey && (e.key === 'd' || e.key === 'D')) {
                e.preventDefault();
                const darkModeBtn = document.getElementById('darkModeBtn');
                if (darkModeBtn) darkModeBtn.click();
            } else if (e.altKey && (e.key === 'g' || e.key === 'G')) {
                e.preventDefault();
                this.showPage('page4');
            }

            if (e.key === 'Escape') {
                UIUtils.toggleModal('addSubjectModal', false);
                UIUtils.toggleModal('helpModal', false);
            }
        });
    }

    static enableDarkMode() {
        document.documentElement.setAttribute('data-theme', 'dark');
        storage.setDarkMode(true);

        const darkModeBtn = document.getElementById('darkModeBtn');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeBtn.title = typeof I18n !== 'undefined' ? I18n.t('navLightMode') : 'Light Mode';
        }
    }

    static disableDarkMode() {
        document.documentElement.removeAttribute('data-theme');
        storage.setDarkMode(false);

        const darkModeBtn = document.getElementById('darkModeBtn');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeBtn.title = typeof I18n !== 'undefined' ? I18n.t('navDarkMode') : 'Dark Mode';
        }
    }

    static getAppInfo() {
        return {
            name: 'PharmaCalc',
            version: '2.2.0',
            description: 'Pharmacy Grade & GPA Calculator for 1st to 5th Year Pharmacy Students',
            author: 'Dr. Said'
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();

    setTimeout(() => {
        if (typeof YearCalculatorManager !== 'undefined' && YearCalculatorManager.initAll) {
            YearCalculatorManager.initAll();
        }
        if (typeof Page3 !== 'undefined' && Page3.init) {
            Page3.init();
        }
        if (typeof Page4 !== 'undefined' && Page4.init) {
            Page4.init();
        }
    }, 50);
});
