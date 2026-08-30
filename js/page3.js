/* ==================== PAGE3.JS - DYNAMIC CUSTOM CALCULATOR ==================== */

class Page3 {
    static subjects = [];

    static init() {
        this.loadSavedSubjects();
        this.attachEventListeners();
        this.renderSubjects();
    }

    static renderSubjects() {
        const container = document.getElementById('page3-form');
        if (!container) return;

        container.innerHTML = '';

        if (this.subjects.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;"></i>
                    <p>${I18n.t('customEmptyState')}</p>
                </div>
            `;
            return;
        }

        this.subjects.forEach((subject, index) => {
            const card = UIUtils.createCustomSubjectCard(subject, index);
            container.appendChild(card);
        });
    }

    static attachEventListeners() {
        const addBtn = document.getElementById('add-subject-btn');
        const calculateBtn = document.getElementById('calculate-page3');
        const resetBtn = document.getElementById('reset-page3');

        if (addBtn) {
            const newAddBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newAddBtn, addBtn);
            const freshAddBtn = document.getElementById('add-subject-btn');
            freshAddBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAddSubjectModal();
            });
        }

        if (calculateBtn) {
            const newCalcBtn = calculateBtn.cloneNode(true);
            calculateBtn.parentNode.replaceChild(newCalcBtn, calculateBtn);
            const freshBtn = document.getElementById('calculate-page3');
            freshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculate();
            });
        }

        if (resetBtn) {
            const newResetBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            const freshReset = document.getElementById('reset-page3');
            freshReset.addEventListener('click', (e) => {
                e.preventDefault();
                this.reset();
            });
        }
    }

    static openAddSubjectModal() {
        const subjectNameInput = document.getElementById('subjectName');
        const subjectCoefInput = document.getElementById('subjectCoef');
        const subjectExamsInput = document.getElementById('subjectExams');
        const subjectHasTPInput = document.getElementById('subjectHasTP');

        if (subjectNameInput) subjectNameInput.value = '';
        if (subjectCoefInput) subjectCoefInput.value = '1';
        if (subjectExamsInput) subjectExamsInput.value = '1';
        if (subjectHasTPInput) subjectHasTPInput.checked = false;

        UIUtils.toggleModal('addSubjectModal', true);
    }

    static addSubject(name, coef, numExams, hasTP) {
        if (!name || name.trim() === '') {
            UIUtils.showToast(I18n.t('customNamePlaceholder'), 'warning');
            return;
        }

        if (isNaN(coef) || coef <= 0) {
            UIUtils.showToast(I18n.t('toastGradeRange'), 'warning');
            return;
        }

        const subject = {
            name: name.trim(),
            coef: parseFloat(coef),
            exams: Array(parseInt(numExams) || 1).fill(''),
            hasTP: hasTP,
            tp: '',
            values: {}
        };

        this.subjects.push(subject);
        this.saveSubjects();
        this.renderSubjects();
        UIUtils.toggleModal('addSubjectModal', false);
        UIUtils.showToast(I18n.t('toastSubjectAdded'), 'success');
    }

    static removeSubject(index) {
        this.subjects.splice(index, 1);
        this.saveSubjects();
        this.renderSubjects();
        UIUtils.showToast(I18n.t('toastYearResetSuccess'), 'success');
    }

    static saveSubjects() {
        storage.setPage3Subjects(this.subjects);
    }

    static loadSavedSubjects() {
        this.subjects = storage.getPage3Subjects() || [];

        const savedResults = storage.getPage3Results();
        if (savedResults) {
            UIUtils.displayResults('page3-results', null, savedResults);
        }
    }

    static calculate() {
        if (this.subjects.length === 0) {
            UIUtils.showToast(I18n.t('toastEnterOneGrade'), 'warning');
            return;
        }

        let hasData = false;

        const subjectsWithData = this.subjects.map((subject, index) => {
            const card = document.querySelector(`[data-index="${index}"]`);
            if (!card) return subject;

            const examInputs = card.querySelectorAll('[data-field^="exam"]');
            const tpInput = card.querySelector('[data-field="tp"]');

            const exams = [];
            examInputs.forEach(inp => {
                const val = inp.value.trim();
                if (val !== '' && GradeCalculator.validateGrade(val)) {
                    exams.push(parseFloat(val));
                    hasData = true;
                }
            });

            let tpVal = null;
            if (tpInput) {
                const v = tpInput.value.trim();
                if (v !== '' && GradeCalculator.validateGrade(v)) {
                    tpVal = parseFloat(v);
                    hasData = true;
                }
            }

            return {
                name: subject.name,
                coef: subject.coef,
                exams: exams,
                tp: tpVal
            };
        });

        if (!hasData) {
            UIUtils.showToast(I18n.t('toastEnterOneGrade'), 'warning');
            return;
        }

        const results = GradeCalculator.calculateCustom(subjectsWithData);

        if (Object.keys(results.results).length === 0) {
            UIUtils.showToast(I18n.t('toastGradeRange'), 'warning');
            return;
        }

        storage.setPage3Results(results);
        UIUtils.displayResults('page3-results', null, results);
        UIUtils.showToast(`✓ ${I18n.t('finalAverage')}: ${results.average.toFixed(2)}/20`, 'success');
    }

    static reset() {
        if (confirm(I18n.t('confirmResetYear'))) {
            this.subjects = [];
            this.saveSubjects();
            this.renderSubjects();
            const res = document.getElementById('page3-results');
            if (res) res.style.display = 'none';
            UIUtils.showToast(I18n.t('toastYearResetSuccess'), 'success');
        }
    }
}

// Global modal helpers
function openAddSubjectModal() {
    Page3.openAddSubjectModal();
}

function closeAddSubjectModal() {
    UIUtils.toggleModal('addSubjectModal', false);
}

function confirmAddSubject() {
    const name = document.getElementById('subjectName').value;
    const coef = document.getElementById('subjectCoef').value;
    const numExams = document.getElementById('subjectExams').value;
    const hasTP = document.getElementById('subjectHasTP').checked;

    Page3.addSubject(name, coef, numExams, hasTP);
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('addSubjectModal');
    if (modal) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeAddSubjectModal());
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAddSubjectModal();
            }
        });
    }
});
