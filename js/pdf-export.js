/* ==================== PDF-EXPORT.JS - PDF EXPORT FUNCTIONALITY ==================== */

class PDFExporter {
    static generatePDF() {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            UIUtils.showToast('Please allow popups to export PDF', 'warning');
            return;
        }

        const allResults = storage.getAllResults();
        const lang = typeof I18n !== 'undefined' ? I18n.currentLang : 'ar';
        const isRtl = lang === 'ar';

        let sectionsHtml = '';
        const yearKeys = ['year1', 'year2', 'year3', 'year4', 'year5'];

        yearKeys.forEach(yr => {
            const config = YEARS_CONFIG[yr];
            const title = config ? config.name : yr;
            if (allResults[yr] && allResults[yr].results && Object.keys(allResults[yr].results).length > 0) {
                sectionsHtml += this.generateSection(title, allResults[yr]);
            }
        });

        if (allResults.page3 && allResults.page3.results && Object.keys(allResults.page3.results).length > 0) {
            sectionsHtml += this.generateSection(I18n.t('titleCustom'), allResults.page3);
        }

        const html = `
            <!DOCTYPE html>
            <html dir="${isRtl ? 'rtl' : 'ltr'}" lang="${lang}">
            <head>
                <meta charset="UTF-8">
                <title>PharmaCalc - ${I18n.t('appName')}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: ${isRtl ? "'Segoe UI', Tahoma, Arial, sans-serif" : "'Segoe UI', Roboto, Helvetica, sans-serif"};
                        color: #242326;
                        line-height: 1.6;
                        padding: 25px;
                        background: #ffffff;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 25px;
                        border-bottom: 3px solid #5D42C9;
                        padding-bottom: 15px;
                    }
                    .header h1 {
                        color: #5D42C9;
                        font-size: 26px;
                        font-weight: 800;
                        margin-bottom: 5px;
                    }
                    .header p {
                        color: #77777A;
                        font-size: 14px;
                    }
                    .report-date {
                        text-align: ${isRtl ? 'left' : 'right'};
                        margin-bottom: 20px;
                        color: #77777A;
                        font-size: 12px;
                    }
                    .section {
                        margin-bottom: 30px;
                        page-break-inside: avoid;
                        background: #F2F2F4;
                        border: 1px solid #E8E8EA;
                        border-radius: 8px;
                        padding: 15px;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #5D42C9;
                        margin-bottom: 15px;
                        padding-bottom: 8px;
                        border-bottom: 2px solid #E8E8EA;
                    }
                    .results-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 15px;
                        background: #ffffff;
                    }
                    .results-table th,
                    .results-table td {
                        padding: 10px 12px;
                        text-align: ${isRtl ? 'right' : 'left'};
                        border: 1px solid #E8E8EA;
                        font-size: 13px;
                    }
                    .results-table th {
                        background-color: #E4DFF1;
                        font-weight: bold;
                        color: #3D285E;
                    }
                    .results-table tr:nth-child(even) {
                        background-color: #F1F1F2;
                    }
                    .grade-cell {
                        font-weight: bold;
                        text-align: center;
                        direction: ltr;
                    }
                    .summary-box {
                        background: #5D42C9;
                        color: white;
                        padding: 15px 20px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .summary-item {
                        display: inline-block;
                    }
                    .summary-label {
                        font-size: 12px;
                        opacity: 0.9;
                    }
                    .summary-value {
                        font-size: 22px;
                        font-weight: bold;
                        direction: ltr;
                    }
                    .bonus-tag {
                        background: rgba(255, 255, 255, 0.2);
                        padding: 3px 8px;
                        border-radius: 4px;
                        font-size: 11px;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 5px 12px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        background: rgba(255, 255, 255, 0.2);
                    }
                    @media print {
                        body { padding: 0; }
                        .section { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>PharmaCalc</h1>
                    <p>${I18n.t('appTagline')}</p>
                </div>

                <div class="report-date">
                    ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
                </div>

                ${sectionsHtml || `<div style="text-align: center; padding: 30px; color: #77777A;">${I18n.t('dashNoData')}</div>`}

                <div class="section">
                    <div class="section-title">${I18n.t('dashGlobalTitle')}</div>
                    ${this.generateOverallSummary(allResults)}
                </div>

                <div style="margin-top: 30px; text-align: center; color: #77777A; font-size: 12px;">
                    <p><strong>PharmaCalc</strong> — ${I18n.t('footerTagline')}</p>
                    <p>© 2026 PharmaCalc | Dr. Said</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 300);
    }

    static generateSection(title, results) {
        if (!results) return '';

        let tableRows = '';
        if (results.results && typeof results.results === 'object') {
            for (const [key, value] of Object.entries(results.results)) {
                const gradeVal = value.average !== undefined ? value.average : value.grade;
                const tpVal = value.tpGrade !== null && value.tpGrade !== undefined ? `${value.tpGrade.toFixed(2)}` : '-';
                const testVal = value.testAverage !== null && value.testAverage !== undefined ? `${value.testAverage.toFixed(2)}` : `${gradeVal.toFixed(2)}`;
                const displayName = I18n.getSubjectName(key, value.name || key);

                tableRows += `
                    <tr>
                        <td><strong>${displayName}</strong></td>
                        <td style="text-align: center;">${value.coef}</td>
                        <td class="grade-cell">${testVal}</td>
                        <td class="grade-cell">${tpVal}</td>
                        <td class="grade-cell" style="color: #5D42C9;">${gradeVal.toFixed(2)} / 20</td>
                        <td class="grade-cell">${(value.weighted || gradeVal * value.coef).toFixed(2)}</td>
                    </tr>
                `;
            }
        }

        return `
            <div class="section">
                <div class="section-title">${title}</div>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>${I18n.t('customNamePlaceholder')}</th>
                            <th style="text-align: center;">${I18n.t('labelCoef')}</th>
                            <th style="text-align: center;">${I18n.t('labelTest')}</th>
                            <th style="text-align: center;">TP</th>
                            <th style="text-align: center;">${I18n.t('subjectAverage')}</th>
                            <th style="text-align: center;">${I18n.t('weightedGrade')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <div class="summary-box">
                    <div class="summary-item">
                        <div class="summary-label">${I18n.t('finalAverage')}</div>
                        <div class="summary-value">${results.average.toFixed(2)} / 20</div>
                    </div>
                    <div class="summary-item">
                        <span class="bonus-tag">${I18n.t('bonusAdded')}</span>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">${I18n.t('totalCoef')}</div>
                        <div class="summary-value">${results.totalCoef || '-'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    static generateOverallSummary(allResults) {
        const averages = [];
        ['year1', 'year2', 'year3', 'year4', 'year5'].forEach(yr => {
            if (allResults[yr] && allResults[yr].average) {
                averages.push(allResults[yr].average);
            }
        });

        if (allResults.page3 && allResults.page3.average) {
            averages.push(allResults.page3.average);
        }

        const cumulative = averages.length > 0
            ? averages.reduce((a, b) => a + b, 0) / averages.length
            : 0;

        return `
            <div class="summary-box" style="margin-top: 10px;">
                <div class="summary-item">
                    <div class="summary-label">${I18n.t('dashGlobalTitle')}</div>
                    <div class="summary-value">${cumulative.toFixed(2)} / 20</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">${I18n.t('dashYearsCalculated')}</div>
                    <div class="summary-value">${averages.length}</div>
                </div>
            </div>
        `;
    }
}
