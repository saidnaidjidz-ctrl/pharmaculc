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
                <div style="text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No subjects added yet. Click "Add Subject" to get started!</p>
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

        // Remove and re-add listeners
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
        const modal = document.getElementById('addSubjectModal');
        const subjectNameInput = document.getElementById('subjectName');
        const subjectCoefInput = document.getElementById('subjectCoef');
        const subjectExamsInput = document.getElementById('subjectExams');
        const subjectHasTPInput = document.getElementById('subjectHasTP');

        // Clear previous values
        subjectNameInput.value = '';
        subjectCoefInput.value = '1';
        subjectExamsInput.value = '1';
        subjectHasTPInput.checked = false;

        UIUtils.toggleModal('addSubjectModal', true);
    }

    static addSubject(name, coef, numExams, hasTP) {
        if (!name || name.trim() === '') {
            UIUtils.showToast('Subject name is required', 'warning');
            return;
        }

        if (isNaN(coef) || coef <= 0) {
            UIUtils.showToast('Coefficient must be a positive number', 'warning');
            return;
        }

        if (isNaN(numExams) || numExams < 1) {
            UIUtils.showToast('Number of exams must be at least 1', 'warning');
            return;
        }

        const subject = {
            name: name,
            coef: parseFloat(coef),
            exams: Array(parseInt(numExams)).fill(''),
            hasTP: hasTP,
            tp: ''
        };

        this.subjects.push(subject);
        this.saveSubjects();
        this.renderSubjects();
        this.attachExamInputListeners();
        UIUtils.toggleModal('addSubjectModal', false);
        UIUtils.showToast(`Subject "${name}" added!`, 'success');
    }

    static removeSubject(index) {
        this.subjects.splice(index, 1);
        this.saveSubjects();
        this.renderSubjects();
        this.attachExamInputListeners();
        UIUtils.showToast('Subject removed', 'success');
    }

    static attachExamInputListeners() {
        const examInputs = document.querySelectorAll('.exam-input, .tp-input');
        examInputs.forEach(input => {
            input.addEventListener('change', () => this.updateSubjectData(input));
        });
    }

    static updateSubjectData(input) {
        const subjectIndex = parseInt(input.dataset.subjectIndex);
        if (isNaN(subjectIndex)) return;

        const subject = this.subjects[subjectIndex];
        if (!subject) return;

        if (input.classList.contains('exam-input')) {
            const examIndex = parseInt(input.dataset.index);
            subject.exams[examIndex] = input.value;
        } else if (input.classList.contains('tp-input')) {
            subject.tp = input.value;
        }

        this.saveSubjects();
    }

    static saveSubjects() {
        storage.setPage3Subjects(this.subjects);
    }

    static loadSavedSubjects() {
        this.subjects = storage.getPage3Subjects() || [];

        // Load and display previous results
        const savedResults = storage.getPage3Results();
        if (savedResults) {
            UIUtils.displayResults('page3-results', null, savedResults);
        }
    }

    static calculate() {
        if (this.subjects.length === 0) {
            UIUtils.showToast('الرجاء إضافة مقرر واحد على الأقل', 'warning');
            return;
        }

        let hasData = false;

        // Collect data from form
        const subjectsWithData = this.subjects.map((subject, index) => {
            const card = document.querySelector(`[data-index="${index}"]`);
            if (!card) return subject;

            const examInputs = card.querySelectorAll('.exam-input');
            const tpInput = card.querySelector('.tp-input');

            subject.exams = Array.from(examInputs).map(input => {
                if (input.value && !isNaN(input.value)) {
                    hasData = true;
                    return parseFloat(input.value);
                }
                return '';
            });

            if (tpInput && tpInput.value && !isNaN(tpInput.value)) {
                subject.tp = parseFloat(tpInput.value);
                hasData = true;
            }

            return subject;
        });

        if (!hasData) {
            UIUtils.showToast('الرجاء إدخال علامة واحدة على الأقل', 'warning');
            return;
        }

        // Calculate results
        const results = GradeCalculator.calculateCustom(subjectsWithData);

        if (Object.keys(results.results).length === 0) {
            UIUtils.showToast('الرجاء إدخال علامة واحدة على الأقل', 'warning');
            return;
        }

        // Save and display results
        storage.setPage3Results(results);
        UIUtils.displayResults('page3-results', null, results);
        UIUtils.showToast(`✓ تم حساب المعدل: ${results.average.toFixed(2)}/20`, 'success');
    }

    static reset() {
        if (confirm('Are you sure you want to reset all custom subjects and grades? This cannot be undone.')) {
            this.subjects = [];
            this.saveSubjects();
            this.renderSubjects();
            document.getElementById('page3-results').style.display = 'none';
            UIUtils.showToast('Page 3 data cleared', 'success');
        }
    }
}

// Global functions for modal interactions
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

function removeCustomSubject(index) {
    if (confirm('Remove this subject?')) {
        Page3.removeSubject(index);
    }
}

// Modal close button and initialization
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

    //setTimeout(() => Page3.init(), 100);
});
