/* ==================== FIXES.JS - INITIALIZATION & HELPERS ==================== */

// Ensure all year calculators and modules are initialized safely
window.addEventListener('DOMContentLoaded', () => {
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
