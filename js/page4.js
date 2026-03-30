/* ==================== PAGE4.JS - GLOBAL DASHBOARD ==================== */

class Page4 {
    static init() {
        this.renderDashboard();
        this.attachEventListeners();
    }

    static renderDashboard() {
        const container = document.getElementById('dashboard-content');
        if (!container) return;

        const allResults = storage.getAllResults();

        let html = '';

        // Overall Stats
        const averages = [];
        if (allResults.page1 && allResults.page1.average) averages.push(allResults.page1.average);
        if (allResults.page2 && allResults.page2.average) averages.push(allResults.page2.average);
        if (allResults.page3 && allResults.page3.average) averages.push(allResults.page3.average);

        const cumulativeAverage = averages.length > 0 
            ? averages.reduce((a, b) => a + b) / averages.length 
            : 0;
        const cumulativeStatus = GradeCalculator.getStatus(cumulativeAverage);

        // Stats Section
        html += '<div class="dashboard-stats">';

        // Cumulative card
        const cumulativeCard = document.createElement('div');
        cumulativeCard.className = 'stat-card';
        cumulativeCard.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))';
        
        const statusLabel = GradeCalculator.getStatusLabel(cumulativeStatus);
        const statusColor = GradeCalculator.getGradeColor(cumulativeAverage);

        if (averages.length > 0) {
            cumulativeCard.innerHTML = `
                <div class="stat-icon" style="color: ${statusColor};">
                    <i class="fas fa-crown"></i>
                </div>
                <div class="stat-label">Cumulative Average</div>
                <div class="stat-value" style="color: ${statusColor};">${cumulativeAverage.toFixed(2)}</div>
                <div style="margin-top: 0.5rem; text-align: center;">
                    <span style="background: rgba(99, 102, 241, 0.2); color: var(--primary-color); padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600;">
                        ${statusLabel.emoji} ${statusLabel.en}
                    </span>
                </div>
            `;
        } else {
            cumulativeCard.innerHTML = `
                <div class="stat-icon">
                    <i class="fas fa-question"></i>
                </div>
                <div class="stat-label">Cumulative Average</div>
                <div style="text-align: center; color: var(--text-light); font-size: 0.875rem; margin-top: 0.5rem;">
                    No data available
                </div>
            `;
        }

        html += cumulativeCard.outerHTML;

        // Individual calculator averages
        if (allResults.page1 && allResults.page1.average) {
            html += UIUtils.createStatCard(
                '<i class="fas fa-calculator"></i>',
                'Basic Semester',
                allResults.page1.average,
                allResults.page1.status
            ).outerHTML;
        }

        if (allResults.page2 && allResults.page2.average) {
            html += UIUtils.createStatCard(
                '<i class="fas fa-list-check"></i>',
                'Structured',
                allResults.page2.average,
                allResults.page2.status
            ).outerHTML;
        }

        if (allResults.page3 && allResults.page3.average) {
            html += UIUtils.createStatCard(
                '<i class="fas fa-wand-magic-sparkles"></i>',
                'Custom',
                allResults.page3.average,
                allResults.page3.status
            ).outerHTML;
        }

        html += '</div>';

        // Detailed Results Section
        html += '<div class="dashboard-details">';

        if (allResults.page1 && allResults.page1.results && Object.keys(allResults.page1.results).length > 0) {
            html += this.renderCalculatorCard('Page 1: Basic Semester', allResults.page1);
        }

        if (allResults.page2 && allResults.page2.results && Object.keys(allResults.page2.results).length > 0) {
            html += this.renderCalculatorCard('Page 2: Structured', allResults.page2);
        }

        if (allResults.page3 && allResults.page3.results && Object.keys(allResults.page3.results).length > 0) {
            html += this.renderCalculatorCard('Page 3: Custom', allResults.page3);
        }

        html += '</div>';

        if (averages.length === 0) {
            html = `
                <div style="text-align: center; padding: 60px 20px; color: var(--text-light);">
                    <i class="fas fa-chart-line" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <h2 style="font-size: 1.5rem; color: var(--text-secondary); margin-bottom: 0.5rem;">No Data Yet</h2>
                    <p style="max-width: 400px; margin: 0 auto;">Start calculating your grades on other pages to see your overall performance here!</p>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    static renderCalculatorCard(title, results) {
        let html = `
            <div class="card">
                <div class="card-title">${title}</div>
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">Average:</span>
                        <strong style="color: var(--primary-color);">${results.average.toFixed(2)}/20</strong>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(results.average / 20) * 100}%"></div>
                    </div>
                </div>
                <div style="font-size: 0.875rem; color: var(--text-light);">
                    <div style="margin-bottom: 0.5rem;">
                        <strong>Subjects:</strong> ${Object.keys(results.results).length}
                    </div>
                    <div>
                        <strong>Total Coefficient:</strong> ${results.totalCoef}
                    </div>
                </div>
        `;

        // Show top subjects
        if (results.results && Object.values(results.results).length > 0) {
            const sorted = Object.values(results.results)
                .sort((a, b) => b.average - a.average)
                .slice(0, 3);

            html += '<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">';
            html += '<div style="font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Top Subjects</div>';

            sorted.forEach((subject, idx) => {
                const color = GradeCalculator.getGradeColor(subject.average);
                html += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                        <span>${idx + 1}. ${subject.name || 'Subject'}</span>
                        <span style="color: ${color}; font-weight: 600;">${subject.average.toFixed(2)}</span>
                    </div>
                `;
            });

            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    static attachEventListeners() {
        const exportBtn = document.getElementById('export-pdf-btn');
        const resetAllBtn = document.getElementById('reset-all');

        // Remove and re-add listeners
        if (exportBtn) {
            const newExportBtn = exportBtn.cloneNode(true);
            exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);
            const freshExportBtn = document.getElementById('export-pdf-btn');
            freshExportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const allResults = storage.getAllResults();
                if (Object.values(allResults).every(r => !r)) {
                    UIUtils.showToast('لا توجد بيانات للتصدير', 'warning');
                    return;
                }
                PDFExporter.generatePDF();
            });
        }

        if (resetAllBtn) {
            const newResetAllBtn = resetAllBtn.cloneNode(true);
            resetAllBtn.parentNode.replaceChild(newResetAllBtn, resetAllBtn);
            const freshResetAllBtn = document.getElementById('reset-all');
            freshResetAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('⚠️ سيؤدي هذا إلى حذف جميع البيانات ولا يمكن التراجع عنه! هل أنت متأكد؟')) {
                    if (confirm('تأكيد نهائي: انقر على موافق لحذف جميع البيانات بشكل دائم.')) {
                        storage.resetAll();
                        Page1.init();
                        Page2.init();
                        Page3.init();
                        this.renderDashboard();
                        UIUtils.showToast('تم حذف جميع البيانات', 'success');
                    }
                }
            });
        }
    }

    static refresh() {
        this.renderDashboard();
        this.attachEventListeners();
    }
}

// Initialize Page 4 when DOM is ready
//document.addEventListener('DOMContentLoaded', () => {
//    setTimeout(() => Page4.init(), 100);
//});
