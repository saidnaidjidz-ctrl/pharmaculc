/* ==================== PDF-EXPORT.JS - PDF EXPORT FUNCTIONALITY ==================== */

class PDFExporter {
    static generatePDF() {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        const allResults = storage.getAllResults();

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>PharmCalc - Grade Report</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Arial', sans-serif;
                        color: #333;
                        line-height: 1.6;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 3px solid #6366f1;
                        padding-bottom: 15px;
                    }
                    .header h1 {
                        color: #6366f1;
                        font-size: 28px;
                        margin-bottom: 5px;
                    }
                    .header p {
                        color: #666;
                        font-size: 14px;
                    }
                    .report-date {
                        text-align: right;
                        margin-bottom: 20px;
                        color: #999;
                        font-size: 12px;
                    }
                    .section {
                        margin-bottom: 30px;
                        page-break-inside: avoid;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #6366f1;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #e0e7ff;
                    }
                    .results-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 15px;
                    }
                    .results-table th,
                    .results-table td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    .results-table th {
                        background-color: #f0f4f8;
                        font-weight: bold;
                        color: #333;
                    }
                    .results-table tr:nth-child(even) {
                        background-color: #f9fafb;
                    }
                    .grade-cell {
                        font-weight: bold;
                        text-align: center;
                    }
                    .grade-good {
                        color: #10b981;
                    }
                    .grade-medium {
                        color: #f59e0b;
                    }
                    .grade-weak {
                        color: #ef4444;
                    }
                    .summary-box {
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .summary-item {
                        display: inline-block;
                        margin-right: 30px;
                        margin-bottom: 10px;
                    }
                    .summary-label {
                        font-size: 12px;
                        opacity: 0.9;
                    }
                    .summary-value {
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                    }
                    .status-good {
                        background-color: #d1fae5;
                        color: #065f46;
                    }
                    .status-medium {
                        background-color: #fef3c7;
                        color: #92400e;
                    }
                    .status-weak {
                        background-color: #fee2e2;
                        color: #991b1b;
                    }
                    .no-data {
                        text-align: center;
                        color: #999;
                        font-style: italic;
                        padding: 20px;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .section {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🧬 PharmCalc - Grade Report</h1>
                    <p>Pharmacy Student Grade Calculator</p>
                </div>

                <div class="report-date">
                    Generated on: ${new Date().toLocaleString()}
                </div>

                ${this.generateSection('Page 1: Basic Semester Calculator', allResults.page1)}
                ${this.generateSection('Page 2: Advanced Structured Calculator', allResults.page2)}
                ${this.generateSection('Page 3: Custom Calculator', allResults.page3)}

                <div class="section">
                    <div class="section-title">Overall Performance</div>
                    ${this.generateOverallSummary(allResults)}
                </div>

                <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px; page-break-inside: avoid;">
                    <p>This report was generated by PharmCalc - Your Pharmacy Grade Calculator</p>
                    <p>For more information, visit your calculator dashboard</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();

        // Trigger print dialog
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    static generateSection(title, results) {
        if (!results) {
            return `
                <div class="section">
                    <div class="section-title">${title}</div>
                    <div class="no-data">No data available</div>
                </div>
            `;
        }

        const statusLabel = GradeCalculator.getStatusLabel(results.status);
        const statusClass = results.status === 'good' ? 'status-good' : (results.status === 'medium' ? 'status-medium' : 'status-weak');

        let tableRows = '';
        if (results.results && typeof results.results === 'object') {
            for (const [key, value] of Object.entries(results.results)) {
                const gradeClass = value.average >= 14 ? 'grade-good' : (value.average >= 10 ? 'grade-medium' : 'grade-weak');
                tableRows += `
                    <tr>
                        <td>${value.name || key}</td>
                        <td style="text-align: center;">${value.coef}</td>
                        <td class="grade-cell ${gradeClass}">${value.average.toFixed(2)}/20</td>
                        <td class="grade-cell ${gradeClass}">${(value.weighted).toFixed(2)}</td>
                    </tr>
                `;
            }
        }

        return `
            <div class="section">
                <div class="section-title">${title}</div>
                <div class="summary-box">
                    <div class="summary-item">
                        <div class="summary-label">Average</div>
                        <div class="summary-value">${results.average.toFixed(2)}/20</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Status</div>
                        <div class="summary-value" style="font-size: 18px;">
                            <span class="status-badge ${statusClass}">${statusLabel.emoji} ${statusLabel.en}</span>
                        </div>
                    </div>
                </div>
                ${tableRows ? `
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th style="text-align: center;">Coefficient</th>
                                <th style="text-align: center;">Grade</th>
                                <th style="text-align: center;">Weighted</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                ` : '<div class="no-data">No grades entered</div>'}
            </div>
        `;
    }

    static generateOverallSummary(allResults) {
        const averages = [];
        if (allResults.page1 && allResults.page1.average) averages.push(allResults.page1.average);
        if (allResults.page2 && allResults.page2.average) averages.push(allResults.page2.average);
        if (allResults.page3 && allResults.page3.average) averages.push(allResults.page3.average);

        if (averages.length === 0) {
            return '<div class="no-data">No data available for overall calculation</div>';
        }

        const cumulativeAverage = averages.reduce((a, b) => a + b) / averages.length;
        const status = GradeCalculator.getStatus(cumulativeAverage);
        const statusLabel = GradeCalculator.getStatusLabel(status);
        const statusClass = status === 'good' ? 'status-good' : (status === 'medium' ? 'status-medium' : 'status-weak');

        return `
            <div class="summary-box">
                <div class="summary-item">
                    <div class="summary-label">Cumulative Average</div>
                    <div class="summary-value">${cumulativeAverage.toFixed(2)}/20</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Overall Status</div>
                    <div class="summary-value" style="font-size: 18px;">
                        <span class="status-badge ${statusClass}">${statusLabel.emoji} ${statusLabel.en}</span>
                    </div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Calculators Used</div>
                    <div class="summary-value">${averages.length}</div>
                </div>
            </div>
        `;
    }

    // Export data as JSON
    static downloadJSON() {
        const data = storage.exportData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pharmcalc-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        UIUtils.showToast('Data exported successfully!', 'success');
    }

    // Export as CSV
    static downloadCSV() {
        const allResults = storage.getAllResults();
        let csv = 'PharmCalc Grade Report\n\n';

        const addSection = (title, results) => {
            if (results && results.results) {
                csv += `${title}\n`;
                csv += 'Subject,Coefficient,Grade,Weighted\n';
                for (const [key, value] of Object.entries(results.results)) {
                    csv += `${value.name || key},${value.coef},${value.average.toFixed(2)},${value.weighted.toFixed(2)}\n`;
                }
                csv += `AVERAGE,${results.totalCoef},${results.average.toFixed(2)},\n\n`;
            }
        };

        addSection('Page 1: Basic Semester', allResults.page1);
        addSection('Page 2: Advanced Structured', allResults.page2);
        addSection('Page 3: Custom', allResults.page3);

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pharmcalc-report-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        UIUtils.showToast('Report exported as CSV!', 'success');
    }
}
