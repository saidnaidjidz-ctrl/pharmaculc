/* ==================== FIXES.JS - CALCULATION FIXES ==================== */

// Fix for display results to handle both grade and average fields
const originalDisplayResults = UIUtils.displayResults;

UIUtils.displayResults = function(containerId, results, calculation = null) {
    const container = document.getElementById(containerId);
    if (!container || !calculation) return;

    let html = `<div class="results-header">📊 النتائج</div>`;

    if (calculation.results) {
        for (const [key, value] of Object.entries(calculation.results)) {
            // Support both 'grade' and 'average' field names
            const gradeValue = value.average || value.grade || 0;
            const statusClass = this.getStatusClass(calculation.status);
            
            html += `
                <div class="result-item">
                    <div>
                        <div class="result-label">${value.name || key}</div>
                        <div style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.25rem;">
                            المعامل: ${value.coef}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="result-value">${parseFloat(gradeValue).toFixed(2)}/20</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(parseFloat(gradeValue) / 20) * 100}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Overall average
        const statusLabel = GradeCalculator.getStatusLabel(calculation.status);
        const statusColor = GradeCalculator.getGradeColor(calculation.average);
        
        html += `
            <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-xl); border-top: 2px solid var(--border-color);">
                <div class="result-item">
                    <div class="result-label" style="font-size: 1.125rem; font-weight: 700;">
                        <i class="fas fa-crown"></i> المعدل الكلي
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div class="result-value" style="font-size: 2rem; color: ${statusColor};">${parseFloat(calculation.average).toFixed(2)}</div>
                        <div class="result-status ${statusClass}">
                            ${statusLabel.emoji} ${statusLabel.ar}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    container.style.display = 'block';
};

// Ensure all pages are properly initialized
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('✓ Initializing all pages...');
        
        if (typeof Page1 !== 'undefined' && Page1.init) {
            Page1.init();
            console.log('✓ Page1 initialized');
        }
        
        if (typeof Page2 !== 'undefined' && Page2.init) {
            Page2.init();
            console.log('✓ Page2 initialized');
        }
        
        if (typeof Page3 !== 'undefined' && Page3.init) {
            Page3.init();
            console.log('✓ Page3 initialized');
        }
        
        if (typeof Page4 !== 'undefined' && Page4.init) {
            Page4.init();
            console.log('✓ Page4 initialized');
        }
        
        console.log('✓ All pages initialized successfully!');
    }, 100);
});
