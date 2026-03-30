/* ==================== APP.JS - MAIN APPLICATION LOGIC ==================== */

class App {
    static currentPage = 'page1';

    static init() {
        this.initTheme();
        this.attachNavigation();
        this.attachGlobalHandlers();
        this.showPage('page1');
    }

    static initTheme() {
        const isDarkMode = storage.getDarkMode();
        if (isDarkMode) {
            this.enableDarkMode();
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
        }

        this.currentPage = pageId;

        // Refresh dashboard when navigating to it
        if (pageId === 'page4') {
            setTimeout(() => Page4.refresh(), 100);
        }

        // Scroll to top
        window.scrollTo(0, 0);
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
            // Alt + 1: Page 1
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                this.showPage('page1');
            }
            // Alt + 2: Page 2
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                this.showPage('page2');
            }
            // Alt + 3: Page 3
            if (e.altKey && e.key === '3') {
                e.preventDefault();
                this.showPage('page3');
            }
            // Alt + 4: Page 4
            if (e.altKey && e.key === '4') {
                e.preventDefault();
                this.showPage('page4');
            }
            // Alt + D: Dark Mode
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                const darkModeBtn = document.getElementById('darkModeBtn');
                if (darkModeBtn) darkModeBtn.click();
            }
            // Escape: Close Modals
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
        }

        UIUtils.showToast('Dark mode enabled', 'success');
    }

    static disableDarkMode() {
        document.documentElement.removeAttribute('data-theme');
        storage.setDarkMode(false);

        const darkModeBtn = document.getElementById('darkModeBtn');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }

        UIUtils.showToast('Dark mode disabled', 'success');
    }

    // Version and info
    static getAppInfo() {
        return {
            name: 'PharmCalc',
            version: '1.0.0',
            description: 'Modern pharmacy grade calculator for students',
            author: 'PharmCalc Team'
        };
    }

    // Check for updates (could be implemented later)
    static checkUpdates() {
        // Placeholder for future update checking
    }

    // Export app state
    static exportAppState() {
        return storage.exportData();
    }

    // Import app state
    static importAppState(jsonData) {
        try {
            if (storage.importData(jsonData)) {
                UIUtils.showToast('Data imported successfully!', 'success');
                location.reload();
                return true;
            } else {
                UIUtils.showToast('Failed to import data', 'error');
                return false;
            }
        } catch (error) {
            UIUtils.showToast('Import failed: ' + error.message, 'error');
            return false;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize App first
    App.init();

    // Then initialize all pages with proper timing
    setTimeout(() => {
        if (typeof Page1 !== 'undefined' && Page1.init) Page1.init();
        if (typeof Page2 !== 'undefined' && Page2.init) Page2.init();
        if (typeof Page3 !== 'undefined' && Page3.init) Page3.init();
        if (typeof Page4 !== 'undefined' && Page4.init) Page4.init();
    }, 50);

    // Optional: Check if there are any errors or issues
    console.log(
        '%cPharmCalc v1.0.0',
        'color: #6366f1; font-size: 16px; font-weight: bold;'
    );
    console.log(
        '%cPharma Grade Calculator for Students',
        'color: #8b5cf6; font-size: 12px;'
    );
    console.log(
        'Shortcuts: Alt+1/2/3/4 (Pages), Alt+D (Dark Mode), Esc (Close Modal)'
    );
});

// Handle window unload to save final state
window.addEventListener('beforeunload', () => {
    // Any final save operations can go here
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    const allResults = storage.getAllResults();
    const hasData = Object.values(allResults).some(r => r && r.average);
    
    if (hasData) {
        // Modern browsers ignore custom messages for security
        e.preventDefault();
        e.returnValue = '';
    }
});
