/* ==================== PAGE2.JS - ADVANCED STRUCTURED CALCULATOR ==================== */

class Page2 {
    static subjectConfigs = {
        'Organic': { coef: 3, type: 'exams', count: 2 },
        'Cell Biology': { coef: 3, type: 'tests', count: 3 },
        'Plant Biology': { coef: 2, type: 'tests', count: 2, hasTP: true },
        'Biostatistics': { coef: 1.5, type: 'single' },
        'Informatics': { coef: 1.5, type: 'single' },
        'Anatomy': { coef: 1, type: 'single' },
        'Physiology': { coef: 1, type: 'single' },
        'English': { coef: 1, type: 'single' }
    };

    static init() {
        this.renderForm();
        this.loadSavedData();
        this.attachEventListeners();
    }

    static renderForm() {
        const formContainer = document.getElementById('page2-form');
        if (!formContainer) return;

        formContainer.innerHTML = '';

        for (const [subject, config] of Object.entries(this.subjectConfigs)) {
            const card = document.createElement('div');
            card.className = 'subject-card';

            const header = document.createElement('div');
            header.className = 'subject-header';
            header.innerHTML = `
                <span class="subject-name">${subject}</span>
                <span class="subject-coef">Coef: ${config.coef}</span>
            `;

            const inputsDiv = document.createElement('div');
            inputsDiv.className = 'subject-inputs';

            const key = subject.toLowerCase().replace(/\s+/g, '');

            if (config.type === 'exams') {
                for (let i = 1; i <= config.count; i++) {
                    const group = document.createElement('div');
                    group.className = 'form-group';

                    const label = document.createElement('label');
                    label.className = 'input-label';
                    label.textContent = `Exam ${i}`;

                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.max = '20';
                    input.step = '0.5';
                    input.placeholder = '0-20';
                    input.name = `${key}exam${i}`;
                    input.value = '';

                    group.appendChild(label);
                    group.appendChild(input);
                    inputsDiv.appendChild(group);
                }
            } else if (config.type === 'tests') {
                for (let i = 1; i <= config.count; i++) {
                    const group = document.createElement('div');
                    group.className = 'form-group';

                    const label = document.createElement('label');
                    label.className = 'input-label';
                    label.textContent = `Test ${i}`;

                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.max = '20';
                    input.step = '0.5';
                    input.placeholder = '0-20';
                    input.name = `${key}test${i}`;
                    input.value = '';

                    group.appendChild(label);
                    group.appendChild(input);
                    inputsDiv.appendChild(group);
                }

                // Add TP if this subject has it
                if (config.hasTP) {
                    const group = document.createElement('div');
                    group.className = 'form-group';

                    const label = document.createElement('label');
                    label.className = 'input-label';
                    label.textContent = 'TP/TD';

                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.max = '20';
                    input.step = '0.5';
                    input.placeholder = '0-20';
                    input.name = `${key}tp`;
                    input.value = '';

                    group.appendChild(label);
                    group.appendChild(input);
                    inputsDiv.appendChild(group);
                }
            } else if (config.type === 'single') {
                const group = document.createElement('div');
                group.className = 'form-group';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = 'Grade';

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.max = '20';
                input.step = '0.5';
                input.placeholder = '0-20';
                input.name = `${key}grade`;
                input.value = '';

                group.appendChild(label);
                group.appendChild(input);
                inputsDiv.appendChild(group);
            }

            card.appendChild(header);
            card.appendChild(inputsDiv);
            formContainer.appendChild(card);
        }
    }

    static loadSavedData() {
        const savedData = storage.getPage2Data();
        if (!savedData || Object.keys(savedData).length === 0) return;

        const inputs = document.querySelectorAll('#page2-form input');
        inputs.forEach(input => {
            const key = input.name;
            if (savedData[key]) {
                input.value = savedData[key];
            }
        });

        // Load and display previous results
        const savedResults = storage.getPage2Results();
        if (savedResults) {
            UIUtils.displayResults('page2-results', null, savedResults);
        }
    }

    static attachEventListeners() {
        const calculateBtn = document.getElementById('calculate-page2');
        const resetBtn = document.getElementById('reset-page2');

        // Remove all previous listeners
        if (calculateBtn) {
            const newCalcBtn = calculateBtn.cloneNode(true);
            calculateBtn.parentNode.replaceChild(newCalcBtn, calculateBtn);
            const freshBtn = document.getElementById('calculate-page2');
            freshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculate();
            });
        }

        if (resetBtn) {
            const newResetBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            const freshReset = document.getElementById('reset-page2');
            freshReset.addEventListener('click', (e) => {
                e.preventDefault();
                this.reset();
            });
        }

        // Auto-save on input change
        const inputs = document.querySelectorAll('#page2-form input');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.saveData());
        });
    }

    static saveData() {
        const formData = UIUtils.getFormData('#page2-form');
        storage.setPage2Data(formData);
    }

    static calculate() {
        // Get all input values
        const inputs = document.querySelectorAll('#page2-form input');
        const formData = {};
        let hasData = false;

        // Collect data from all inputs
        inputs.forEach(input => {
            if (input.value && !isNaN(input.value)) {
                formData[input.name] = parseFloat(input.value);
                hasData = true;
            }
        });

        // Check if any data is entered
        if (!hasData) {
            UIUtils.showToast('الرجاء إدخال علامة واحدة على الأقل', 'warning');
            return;
        }

        // Calculate results
        const results = GradeCalculator.calculateAdvancedStructured(formData);

        if (Object.keys(results.results).length === 0) {
            UIUtils.showToast('لم يتم إدخال أي علامات صحيحة', 'warning');
            return;
        }

        // Save and display results
        storage.setPage2Results(results);
        UIUtils.displayResults('page2-results', null, results);
        UIUtils.showToast(`✓ تم حساب المعدل: ${results.average.toFixed(2)}/20`, 'success');
    }

    static reset() {
        if (confirm('Are you sure you want to reset all grades? This cannot be undone.')) {
            UIUtils.clearForm('#page2-form');
            storage.resetPage2();
            document.getElementById('page2-results').style.display = 'none';
            UIUtils.showToast('Page 2 data cleared', 'success');
        }
    }
}

// Initialize Page 2 when DOM is ready
//document.addEventListener('DOMContentLoaded', () => {
//    setTimeout(() => Page2.init(), 100);
//});
