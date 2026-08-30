/* ==================== UI-UTILS.JS - UI HELPER FUNCTIONS ==================== */

class UIUtils {
    // Show notification toast
    static showToast(message, type = 'success', duration = 3000) {
        let toast = document.getElementById('notificationToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'notificationToast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className = `toast ${type} active`;

        if (this._toastTimer) clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('active');
        }, duration);
    }

    // Display rich results for pharmacy years
    static displayYearResults(containerId, calculation, yearConfig = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!calculation || !calculation.results || Object.keys(calculation.results).length === 0) {
            container.style.display = 'none';
            return;
        }

        const isSuccess = calculation.average >= 10;
        let statusText = '';
        if (calculation.status === 'good') {
            statusText = `✅ ${I18n.t('statusGood')}`;
        } else if (calculation.status === 'medium') {
            statusText = `🎉 ${I18n.t('statusMedium')}`;
        } else {
            statusText = `❌ ${I18n.t('statusWeak')}`;
        }

        const statusClass = this.getStatusClass(calculation.status);
        const statusColor = GradeCalculator.getGradeColor(calculation.average);

        let html = `
            <div class="results-container-card">
                <div class="results-header-banner">
                    <div class="results-header-title">
                        <i class="fas fa-chart-pie"></i>
                        <span>${I18n.t('resultsTitle')} ${yearConfig ? '- ' + yearConfig.shortName : ''}</span>
                    </div>
                    <span class="result-status-badge ${statusClass}">
                        ${statusText}
                    </span>
                </div>

                <!-- Main Final Average Section -->
                <div class="final-average-hero">
                    <div class="hero-left">
                        <div class="hero-label">
                            <i class="fas fa-crown"></i> ${I18n.t('finalAverage')}
                        </div>
                        <div class="hero-value" style="color: ${statusColor};">
                            ${calculation.average.toFixed(2)}<span class="scale"> / 20</span>
                        </div>
                        <div class="hero-subtext">
                            <span>${I18n.t('calculatedAverage')}: <strong>${(calculation.calculatedAverage !== undefined ? calculation.calculatedAverage : calculation.average).toFixed(2)}</strong></span>
                            <span class="bonus-badge">${I18n.t('bonusAdded')}</span>
                        </div>
                    </div>
                    <div class="hero-right">
                        <div class="stat-pill">
                            <i class="fas fa-layer-group"></i>
                            <div>
                                <div class="stat-pill-label">${I18n.t('totalCoef')}</div>
                                <div class="stat-pill-value">${calculation.totalCoef}</div>
                            </div>
                        </div>
                        <div class="stat-pill">
                            <i class="fas fa-book-bookmark"></i>
                            <div>
                                <div class="stat-pill-label">${I18n.t('evaluatedSubjects')}</div>
                                <div class="stat-pill-value">${Object.keys(calculation.results).length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Subjects Detail Breakdown -->
                <div class="results-breakdown-title">
                    <i class="fas fa-list-ol"></i> ${I18n.t('subjectsBreakdown')}
                </div>
                <div class="subjects-results-grid">
        `;

        for (const [key, item] of Object.entries(calculation.results)) {
            const gradeVal = item.average !== undefined ? item.average : (item.grade || 0);
            const itemColor = GradeCalculator.getGradeColor(gradeVal);
            const isPassing = gradeVal >= 10;
            const displayName = I18n.getSubjectName(key, item.name || key);

            let extraInfo = '';
            if (item.testGrades && item.testGrades.length > 1) {
                extraInfo += `<div class="extra-grade-tag">Tests (${item.testGrades.map(g => g.toFixed(2)).join(' + ')}) ÷ ${item.testGrades.length} = ${item.testAverage}</div>`;
            }
            if (item.tpGrade !== null && item.tpGrade !== undefined) {
                extraInfo += `<div class="extra-grade-tag tp-tag"><i class="fas fa-vial"></i> TP: ${item.tpGrade.toFixed(2)}</div>`;
            }

            html += `
                <div class="subject-result-card ${isPassing ? 'pass' : 'fail'}">
                    <div class="src-header">
                        <span class="src-name">${displayName}</span>
                        <span class="src-coef">${I18n.t('labelCoef')}: ${item.coef}</span>
                    </div>
                    <div class="src-body">
                        <div class="src-grade-row">
                            <span class="src-grade" style="color: ${itemColor};">${parseFloat(gradeVal).toFixed(2)}/20</span>
                            <span class="src-weighted">${I18n.t('weightedGrade')}: ${(item.weighted || gradeVal * item.coef).toFixed(2)}</span>
                        </div>
                        ${extraInfo}
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(100, (gradeVal / 20) * 100)}%; background: ${itemColor};"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
        container.style.display = 'block';
    }

    // Display results (legacy caller support)
    static displayResults(containerId, results, calculation = null) {
        const calc = calculation || results;
        if (calc) {
            this.displayYearResults(containerId, calc);
        }
    }

    // Get status class for styling
    static getStatusClass(status) {
        const statusMap = {
            'good': 'status-good',
            'medium': 'status-medium',
            'weak': 'status-weak'
        };
        return statusMap[status] || statusMap.weak;
    }

    // Format number with 2 decimal places
    static formatGrade(grade) {
        const num = parseFloat(grade);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    }

    // Create custom subject card for page 3
    static createCustomSubjectCard(subject, index) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.dataset.index = index;

        const header = document.createElement('div');
        header.className = 'subject-header';
        header.innerHTML = `
            <span class="subject-name">${subject.name}</span>
            <span class="subject-coef">${I18n.t('labelCoef')}: ${subject.coef}</span>
        `;

        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'subject-inputs';

        const examsCount = parseInt(subject.exams) || 1;
        const dynamicContainer = document.createElement('div');
        dynamicContainer.className = 'dynamic-tests-container';

        for (let i = 1; i <= examsCount; i++) {
            const group = document.createElement('div');
            group.className = 'form-group';
            group.innerHTML = `
                <label class="input-label">${I18n.t('labelTest')} ${i}</label>
                <input type="number" min="0" max="20" step="any" placeholder="0-20"
                       class="grade-input" data-custom-index="${index}" data-field="exam${i}"
                       value="${subject.values ? (subject.values[`exam${i}`] || '') : ''}">
            `;
            dynamicContainer.appendChild(group);
        }
        inputsDiv.appendChild(dynamicContainer);

        if (subject.hasTP) {
            const tpGroup = document.createElement('div');
            tpGroup.className = 'form-group tp-input-group';
            tpGroup.innerHTML = `
                <label class="input-label">
                    <i class="fas fa-flask"></i> ${I18n.t('labelTpOptionnel')}
                    <span class="optional-hint">${I18n.t('tpOptionalHint')}</span>
                </label>
                <input type="number" min="0" max="20" step="any" placeholder="0-20"
                       class="grade-input tp-input" data-custom-index="${index}" data-field="tp"
                       value="${subject.values ? (subject.values.tp || '') : ''}">
            `;
            inputsDiv.appendChild(tpGroup);
        }

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.innerHTML = `<i class="fas fa-trash"></i> ${I18n.t('btnReset')}`;
        removeBtn.onclick = () => {
            if (typeof Page3 !== 'undefined' && Page3.removeSubject) {
                Page3.removeSubject(index);
            }
        };

        card.appendChild(header);
        card.appendChild(inputsDiv);
        card.appendChild(removeBtn);

        return card;
    }

    // Clear form inputs
    static clearForm(formSelector) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        const inputs = form.querySelectorAll('input[type="number"], input[type="text"]');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('invalid-input');
        });
    }

    // Toggle modal visibility
    static toggleModal(modalId, show = true) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (show) {
                modal.classList.add('active');
                document.body.classList.add('no-scroll');
            } else {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    }
}
