/* ==================== PAGE1.JS - BASIC SEMESTER CALCULATOR ==================== */

class Page1 {
    static subjects = {
        'Organic': 3,
        'History of Pharmacy': 1,
        'Biostatistics': 1.5,
        'Cell Biology': 3,
        'Plant Biology': 2,
        'Physics': 2
    };

    static init() {
        this.renderForm();
        this.loadSavedData();
        this.attachEventListeners();
    }

    static renderForm() {
        const formContainer = document.getElementById('page1-form');
        if (!formContainer) return;

        formContainer.innerHTML = '';
        let formCount = 0;

        for (const [subject, coef] of Object.entries(this.subjects)) {
            const { container, input } = UIUtils.createSubjectInput(subject, coef);
            formContainer.appendChild(container);
            formCount++;
        }
    }

    static loadSavedData() {
        const savedData = storage.getPage1Data();
        if (!savedData || Object.keys(savedData).length === 0) return;

        const inputs = document.querySelectorAll('#page1-form input');
        inputs.forEach(input => {
            const key = input.name;
            if (savedData[key]) {
                input.value = savedData[key];
            }
        });

        // Load and display previous results
        const savedResults = storage.getPage1Results();
        if (savedResults) {
            UIUtils.displayResults('page1-results', null, savedResults);
        }
    }

    static attachEventListeners() {
        const calculateBtn = document.getElementById('calculate-page1');
        const resetBtn = document.getElementById('reset-page1');

        // Remove all previous listeners
        if (calculateBtn) {
            const newCalcBtn = calculateBtn.cloneNode(true);
            calculateBtn.parentNode.replaceChild(newCalcBtn, calculateBtn);
            const freshBtn = document.getElementById('calculate-page1');
            freshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculate();
            });
        }

        if (resetBtn) {
            const newResetBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            const freshReset = document.getElementById('reset-page1');
            freshReset.addEventListener('click', (e) => {
                e.preventDefault();
                this.reset();
            });
        }

        // Auto-save on input change
        const inputs = document.querySelectorAll('#page1-form input');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.saveData());
        });
    }

    static saveData() {
        const formData = UIUtils.getFormData('#page1-form');
        const cleanData = {};

        for (const [subject] of Object.entries(this.subjects)) {
            const key = subject.toLowerCase().replace(/\s+/g, '');
            cleanData[subject] = formData[key] || null;
        }

        storage.setPage1Data(cleanData);
    }

    static calculate() {
        // Get all input values
        const inputs = document.querySelectorAll('#page1-form input');
        const grades = {};
        let hasData = false;

        // Collect grades from all inputs
        inputs.forEach(input => {
            if (input.value && !isNaN(input.value)) {
                for (const subject of Object.keys(this.subjects)) {
                    const key = subject.toLowerCase().replace(/\s+/g, '');
                    if (input.name === key) {
                        grades[subject] = parseFloat(input.value);
                        hasData = true;
                    }
                }
            }
        });

        // Check if any data is entered
        if (!hasData) {
            UIUtils.showToast('الرجاء إدخال علامة واحدة على الأقل', 'warning');
            return;
        }

        // Calculate results
        const results = GradeCalculator.calculateBasicSemester(grades);

        // Save and display results
        storage.setPage1Results(results);
        UIUtils.displayResults('page1-results', null, results);
        UIUtils.showToast(`✓ تم حساب المعدل: ${results.average.toFixed(2)}/20`, 'success');
    }

    static reset() {
        if (confirm('Are you sure you want to reset all grades? This cannot be undone.')) {
            UIUtils.clearForm('#page1-form');
            storage.resetPage1();
            document.getElementById('page1-results').style.display = 'none';
            UIUtils.showToast('Page 1 data cleared', 'success');
        }
    }
}

// Initialize Page 1 when DOM is ready
//document.addEventListener('DOMContentLoaded', () => {
//    setTimeout(() => Page1.init(), 100);
//});
