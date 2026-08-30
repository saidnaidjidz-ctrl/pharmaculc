/* ==================== YEAR-CALCULATOR.JS - UNIFIED YEARS CONTROLLER ==================== */

class YearCalculatorManager {
    static initAll() {
        ['year1', 'year2', 'year3', 'year4', 'year5'].forEach(yearId => {
            this.initYear(yearId);
        });
    }

    static initYear(yearId) {
        const config = YEARS_CONFIG[yearId];
        if (!config) return;

        this.renderForm(yearId);
        this.loadSavedData(yearId);
        this.attachEventListeners(yearId);
    }

    static renderForm(yearId) {
        const formContainer = document.getElementById(`${yearId}-form`);
        if (!formContainer) return;

        const config = YEARS_CONFIG[yearId];
        formContainer.innerHTML = '';

        const savedData = storage.getYearData(yearId) || {};

        config.subjects.forEach(subject => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.id = `card-${yearId}-${subject.key}`;

            const localizedName = I18n.getSubjectName(subject.key, subject.name);

            // Header
            const header = document.createElement('div');
            header.className = 'subject-header';

            let evaluationBadgeText = '';
            if (subject.badge) {
                evaluationBadgeText = subject.badge;
            } else if (subject.type === 'exams') {
                evaluationBadgeText = `${subject.count || 2} Exams`;
            } else if (subject.type === 'tests') {
                evaluationBadgeText = `${subject.count || 1}T`;
            } else {
                evaluationBadgeText = '1T';
            }

            header.innerHTML = `
                <div class="subject-title-group">
                    <span class="subject-name">${localizedName}</span>
                    <span class="subject-eval-badge">${evaluationBadgeText}</span>
                    ${(subject.hasTP || subject.tpToggleable) ? `<span class="subject-tp-badge">${I18n.t('labelTpOptionnel')}</span>` : ''}
                </div>
                <div class="subject-meta-group">
                    <span class="subject-coef">${I18n.t('labelCoef')}: ${subject.coef}</span>
                </div>
            `;

            const inputsDiv = document.createElement('div');
            inputsDiv.className = 'subject-inputs';

            // Check if test count is configurable by user (e.g. Chimie minérale in 2ème année)
            let currentTestCount = subject.count || 1;
            if (subject.allowTestCountChoice) {
                const savedChoice = savedData[subject.key]?.testCountChoice;
                currentTestCount = savedChoice ? parseInt(savedChoice) : (subject.defaultCount || 2);

                const selectorGroup = document.createElement('div');
                selectorGroup.className = 'test-count-selector-group';
                selectorGroup.innerHTML = `
                    <label class="input-label" style="font-weight: 600; margin-bottom: 0.25rem;">${I18n.t('customExamCountPlaceholder')}:</label>
                    <div class="test-count-pills">
                        ${subject.options.map(opt => `
                            <button type="button" class="test-count-pill ${opt === currentTestCount ? 'active' : ''}" 
                                data-year="${yearId}" data-subject="${subject.key}" data-count="${opt}">
                                <i class="fas fa-file-signature"></i> ${opt} Tests (${opt}T)
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" name="${subject.key}_testCountChoice" value="${currentTestCount}">
                `;
                inputsDiv.appendChild(selectorGroup);
            }

            // Input fields container for tests/exams
            const dynamicTestsContainer = document.createElement('div');
            dynamicTestsContainer.className = 'dynamic-tests-container';
            dynamicTestsContainer.id = `tests-container-${yearId}-${subject.key}`;

            this.renderTestInputs(dynamicTestsContainer, yearId, subject, currentTestCount, savedData[subject.key] || {});
            inputsDiv.appendChild(dynamicTestsContainer);

            // TP Field (Optional)
            if (subject.hasTP || subject.tpToggleable) {
                const tpGroup = document.createElement('div');
                tpGroup.className = 'form-group tp-input-group';
                tpGroup.innerHTML = `
                    <label class="input-label">
                        <i class="fas fa-flask"></i> ${I18n.t('labelTpOptionnel')}
                        <span class="optional-hint">${I18n.t('tpOptionalHint')}</span>
                    </label>
                    <input type="number" 
                        min="0" 
                        max="20" 
                        step="any" 
                        placeholder="${I18n.t('placeholderOptional')}" 
                        name="${subject.key}_tp" 
                        class="grade-input tp-input"
                        data-year="${yearId}"
                        data-subject="${subject.key}"
                        data-field="tp"
                        value="${savedData[subject.key]?.tp !== undefined ? savedData[subject.key].tp : ''}">
                `;
                inputsDiv.appendChild(tpGroup);
            }

            card.appendChild(header);
            card.appendChild(inputsDiv);
            formContainer.appendChild(card);
        });
    }

    static renderTestInputs(container, yearId, subject, count, savedSubjectData) {
        container.innerHTML = '';

        if (subject.type === 'exams') {
            for (let i = 1; i <= count; i++) {
                const group = document.createElement('div');
                group.className = 'form-group';
                group.innerHTML = `
                    <label class="input-label">${I18n.t('labelExam')} ${i}</label>
                    <input type="number" 
                        min="0" 
                        max="20" 
                        step="any" 
                        placeholder="0-20" 
                        name="${subject.key}_exam${i}" 
                        class="grade-input"
                        data-year="${yearId}"
                        data-subject="${subject.key}"
                        data-field="exam${i}"
                        value="${savedSubjectData[`exam${i}`] !== undefined ? savedSubjectData[`exam${i}`] : ''}">
                `;
                container.appendChild(group);
            }
        } else if (subject.type === 'tests') {
            for (let i = 1; i <= count; i++) {
                const group = document.createElement('div');
                group.className = 'form-group';
                group.innerHTML = `
                    <label class="input-label">${I18n.t('labelTest')} ${i}</label>
                    <input type="number" 
                        min="0" 
                        max="20" 
                        step="any" 
                        placeholder="0-20" 
                        name="${subject.key}_test${i}" 
                        class="grade-input"
                        data-year="${yearId}"
                        data-subject="${subject.key}"
                        data-field="test${i}"
                        value="${savedSubjectData[`test${i}`] !== undefined ? savedSubjectData[`test${i}`] : ''}">
                `;
                container.appendChild(group);
            }
        } else if (subject.type === 'single') {
            const group = document.createElement('div');
            group.className = 'form-group';
            group.innerHTML = `
                <label class="input-label">${I18n.t('labelNote')} / ${I18n.t('labelTest')} 1</label>
                <input type="number" 
                    min="0" 
                    max="20" 
                    step="any" 
                    placeholder="0-20" 
                    name="${subject.key}_grade" 
                    class="grade-input"
                    data-year="${yearId}"
                    data-subject="${subject.key}"
                    data-field="grade"
                    value="${savedSubjectData.grade !== undefined ? savedSubjectData.grade : ''}">
            `;
            container.appendChild(group);
        }
    }

    static loadSavedData(yearId) {
        const savedResults = storage.getYearResults(yearId);
        if (savedResults) {
            const config = YEARS_CONFIG[yearId];
            UIUtils.displayYearResults(`${yearId}-results`, savedResults, config);
        }
    }

    static attachEventListeners(yearId) {
        const formContainer = document.getElementById(`${yearId}-form`);
        if (!formContainer) return;

        // Test count pill buttons (e.g. Chimie minérale 2T / 3T)
        formContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.test-count-pill');
            if (pill) {
                e.preventDefault();
                const count = parseInt(pill.dataset.count);
                const subjectKey = pill.dataset.subject;
                const config = YEARS_CONFIG[yearId];
                const subject = config.subjects.find(s => s.key === subjectKey);

                if (!subject) return;

                // Update active pill UI
                const parent = pill.closest('.test-count-pills');
                parent.querySelectorAll('.test-count-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // Update hidden input
                const hiddenInput = formContainer.querySelector(`input[name="${subjectKey}_testCountChoice"]`);
                if (hiddenInput) hiddenInput.value = count;

                // Re-render test inputs for this subject
                const dynamicContainer = document.getElementById(`tests-container-${yearId}-${subjectKey}`);
                if (dynamicContainer) {
                    const savedData = this.collectFormData(yearId);
                    this.renderTestInputs(dynamicContainer, yearId, subject, count, savedData[subjectKey] || {});
                    this.saveData(yearId);
                    this.calculate(yearId, false);
                }
            }
        });

        // Input change validation & auto-save
        formContainer.addEventListener('input', (e) => {
            const input = e.target;
            if (input.classList.contains('grade-input')) {
                const val = input.value.trim();
                if (val !== '') {
                    const num = parseFloat(val);
                    if (isNaN(num) || num < 0 || num > 20) {
                        input.classList.add('invalid-input');
                        UIUtils.showToast(I18n.t('toastGradeRange'), 'warning', 2000);
                    } else {
                        input.classList.remove('invalid-input');
                    }
                } else {
                    input.classList.remove('invalid-input');
                }
                this.saveData(yearId);
            }
        });

        formContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('grade-input')) {
                this.saveData(yearId);
                // Trigger calculation automatically
                this.calculate(yearId, false);
            }
        });

        // Calculate Button
        const calcBtn = document.getElementById(`calculate-${yearId}`);
        if (calcBtn) {
            calcBtn.onclick = (e) => {
                e.preventDefault();
                this.calculate(yearId, true);
            };
        }

        // Reset Button
        const resetBtn = document.getElementById(`reset-${yearId}`);
        if (resetBtn) {
            resetBtn.onclick = (e) => {
                e.preventDefault();
                this.reset(yearId);
            };
        }
    }

    static collectFormData(yearId) {
        const formContainer = document.getElementById(`${yearId}-form`);
        if (!formContainer) return {};

        const data = {};
        const config = YEARS_CONFIG[yearId];
        if (!config) return {};

        config.subjects.forEach(subject => {
            const key = subject.key;
            data[key] = {};

            // Check choice
            const choiceInput = formContainer.querySelector(`input[name="${key}_testCountChoice"]`);
            if (choiceInput) {
                data[key].testCountChoice = parseInt(choiceInput.value);
            }

            // Collect all inputs for this subject
            const inputs = formContainer.querySelectorAll(`[data-subject="${key}"]`);
            inputs.forEach(input => {
                const field = input.dataset.field;
                const val = input.value.trim();
                if (val !== '' && GradeCalculator.validateGrade(val)) {
                    data[key][field] = parseFloat(val);
                }
            });
        });

        return data;
    }

    static saveData(yearId) {
        const data = this.collectFormData(yearId);
        storage.setYearData(yearId, data);
    }

    static calculate(yearId, showFeedback = true) {
        const data = this.collectFormData(yearId);
        let hasAnyGrade = false;

        for (const subKey of Object.keys(data)) {
            const subData = data[subKey];
            for (const f of Object.keys(subData)) {
                if (f !== 'testCountChoice' && subData[f] !== undefined && subData[f] !== null) {
                    hasAnyGrade = true;
                    break;
                }
            }
            if (hasAnyGrade) break;
        }

        if (!hasAnyGrade) {
            if (showFeedback) {
                UIUtils.showToast(I18n.t('toastEnterOneGrade'), 'warning');
            }
            return;
        }

        const results = GradeCalculator.calculateYear(yearId, data);

        if (Object.keys(results.results).length === 0) {
            if (showFeedback) {
                UIUtils.showToast(I18n.t('toastGradeRange'), 'warning');
            }
            return;
        }

        storage.setYearResults(yearId, results);
        const config = YEARS_CONFIG[yearId];
        UIUtils.displayYearResults(`${yearId}-results`, results, config);

        if (showFeedback) {
            UIUtils.showToast(`✓ ${I18n.t('finalAverage')}: ${results.average.toFixed(2)}/20`, 'success');
        }
    }

    static reset(yearId) {
        const config = YEARS_CONFIG[yearId];
        const yearTitle = config ? config.shortName : yearId;
        if (confirm(I18n.t('confirmResetYear'))) {
            UIUtils.clearForm(`#${yearId}-form`);
            storage.resetYear(yearId);
            const resultsElem = document.getElementById(`${yearId}-results`);
            if (resultsElem) resultsElem.style.display = 'none';
            UIUtils.showToast(I18n.t('toastYearResetSuccess'), 'success');
        }
    }
}

// Backwards compatibility layer for legacy Page2 references
if (typeof Page2 === 'undefined') {
    class Page2 {
        static init() {
            YearCalculatorManager.initYear('year1');
        }
        static calculate() {
            YearCalculatorManager.calculate('year1', true);
        }
        static reset() {
            YearCalculatorManager.reset('year1');
        }
        static saveData() {
            YearCalculatorManager.saveData('year1');
        }
    }
}
