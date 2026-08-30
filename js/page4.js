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
        const yearKeys = ['year1', 'year2', 'year3', 'year4', 'year5'];

        yearKeys.forEach(yr => {
            if (allResults[yr] && allResults[yr].average) {
                averages.push({
                    id: yr,
                    name: YEARS_CONFIG[yr] ? YEARS_CONFIG[yr].shortName : yr,
                    average: allResults[yr].average,
                    calculatedAverage: allResults[yr].calculatedAverage,
                    status: allResults[yr].status,
                    totalCoef: allResults[yr].totalCoef,
                    results: allResults[yr].results
                });
            }
        });

        if (allResults.page3 && allResults.page3.average) {
            averages.push({
                id: 'page3',
                name: I18n.t('titleCustom'),
                average: allResults.page3.average,
                calculatedAverage: allResults.page3.calculatedAverage,
                status: allResults.page3.status,
                totalCoef: allResults.page3.totalCoef,
                results: allResults.page3.results
            });
        }

        const avgValues = averages.map(a => a.average);
        const cumulativeAverage = avgValues.length > 0 
            ? avgValues.reduce((a, b) => a + b, 0) / avgValues.length 
            : 0;
        const cumulativeStatus = GradeCalculator.getStatus(cumulativeAverage);

        // Stats Section
        html += '<div class="dashboard-stats">';

        // Cumulative card
        const statusColor = GradeCalculator.getGradeColor(cumulativeAverage);

        let statusText = '';
        if (cumulativeStatus === 'good') {
            statusText = `✅ ${I18n.t('statusGood')}`;
        } else if (cumulativeStatus === 'medium') {
            statusText = `🎉 ${I18n.t('statusMedium')}`;
        } else {
            statusText = `❌ ${I18n.t('statusWeak')}`;
        }

        if (averages.length > 0) {
            html += `
                <div class="stat-card" style="border: 2px solid var(--color-primary);">
                    <div class="stat-icon" style="color: ${statusColor};">
                        <i class="fas fa-crown"></i>
                    </div>
                    <div class="stat-label">${I18n.t('dashGlobalTitle')}</div>
                    <div class="stat-value" style="color: ${statusColor};">${cumulativeAverage.toFixed(2)}/20</div>
                    <div style="margin-top: 0.5rem; text-align: center;">
                        <span class="bonus-badge">
                            ${statusText}
                        </span>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-simple"></i>
                    </div>
                    <div class="stat-label">${I18n.t('dashGlobalTitle')}</div>
                    <div style="text-align: center; color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">
                        ${I18n.t('dashNoData')}
                    </div>
                </div>
            `;
        }

        // Individual year average cards
        averages.forEach(item => {
            const iconClass = YEARS_CONFIG[item.id] ? YEARS_CONFIG[item.id].icon : 'fas fa-wand-magic-sparkles';
            const itemColor = GradeCalculator.getGradeColor(item.average);
            html += `
                <div class="stat-card">
                    <div class="stat-icon" style="color: var(--color-primary);">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="stat-label">${item.name}</div>
                    <div class="stat-value" style="color: ${itemColor};">${item.average.toFixed(2)}/20</div>
                    <div style="margin-top: 0.4rem; font-size: 0.78rem; color: var(--text-secondary);">
                        ${I18n.t('totalCoef')}: <strong>${item.totalCoef || '-'}</strong>
                    </div>
                </div>
            `;
        });

        html += '</div>';

        // Detailed Results Section
        if (averages.length > 0) {
            html += '<div class="dashboard-details">';
            averages.forEach(item => {
                html += this.renderCalculatorCard(item.name, item);
            });
            html += '</div>';
        } else {
            html += `
                <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                    <i class="fas fa-chart-line" style="font-size: 3.5rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <h2 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 0.5rem;">${I18n.t('dashNoData')}</h2>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    static renderCalculatorCard(title, results) {
        let html = `
            <div class="card">
                <div class="card-title" style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${title}</span>
                    <span class="bonus-badge" style="font-size: 0.72rem;">${I18n.t('bonusAdded')}</span>
                </div>
                <div style="margin-bottom: 0.85rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                        <span style="color: var(--text-secondary); font-size: 0.88rem;">${I18n.t('finalAverage')}:</span>
                        <strong style="color: var(--color-primary); font-size: 1.25rem;">${results.average.toFixed(2)}/20</strong>
                    </div>
                    ${results.calculatedAverage ? `
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem;">
                        <span>${I18n.t('calculatedAverage')}:</span>
                        <span>${results.calculatedAverage.toFixed(2)}</span>
                    </div>` : ''}
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, (results.average / 20) * 100)}%; background: ${GradeCalculator.getGradeColor(results.average)};"></div>
                    </div>
                </div>
                <div style="font-size: 0.82rem; color: var(--text-secondary);">
                    <div style="margin-bottom: 0.3rem;">
                        <strong>${I18n.t('evaluatedSubjects')}:</strong> ${Object.keys(results.results || {}).length}
                    </div>
                    <div>
                        <strong>${I18n.t('totalCoef')}:</strong> ${results.totalCoef || '-'}
                    </div>
                </div>
        `;

        // Show top subjects
        if (results.results && Object.values(results.results).length > 0) {
            const sorted = Object.entries(results.results)
                .sort((a, b) => {
                    const gradeA = a[1].average !== undefined ? a[1].average : (a[1].grade || 0);
                    const gradeB = b[1].average !== undefined ? b[1].average : (b[1].grade || 0);
                    return gradeB - gradeA;
                })
                .slice(0, 4);

            html += '<div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">';

            sorted.forEach(([key, subject], idx) => {
                const grade = subject.average !== undefined ? subject.average : subject.grade;
                const color = GradeCalculator.getGradeColor(grade);
                const subName = I18n.getSubjectName(key, subject.name || key);
                html += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; font-size: 0.82rem;">
                        <span style="color: var(--text-primary); font-weight: 500;">${idx + 1}. ${subName}</span>
                        <span style="color: ${color}; font-weight: 700;">${parseFloat(grade).toFixed(2)}</span>
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

        if (exportBtn) {
            exportBtn.onclick = (e) => {
                e.preventDefault();
                const allResults = storage.getAllResults();
                const hasAny = Object.values(allResults).some(r => r && r.average);
                if (!hasAny) {
                    UIUtils.showToast(I18n.t('dashNoData'), 'warning');
                    return;
                }
                if (typeof PDFExporter !== 'undefined' && PDFExporter.generatePDF) {
                    PDFExporter.generatePDF();
                }
            };
        }

        if (resetAllBtn) {
            resetAllBtn.onclick = (e) => {
                e.preventDefault();
                if (confirm(I18n.t('confirmResetAll'))) {
                    storage.resetAll();
                    if (typeof YearCalculatorManager !== 'undefined') {
                        YearCalculatorManager.initAll();
                    }
                    if (typeof Page3 !== 'undefined') {
                        Page3.init();
                    }
                    this.renderDashboard();
                    UIUtils.showToast(I18n.t('toastAllResetSuccess'), 'success');
                }
            };
        }
    }

    static refresh() {
        this.renderDashboard();
        this.attachEventListeners();
    }
}
