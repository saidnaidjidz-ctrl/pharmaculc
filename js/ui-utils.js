/* ==================== UI-UTILS.JS - UI HELPER FUNCTIONS ==================== */

class UIUtils {
    // Show notification toast
    static showToast(message, type = 'success', duration = 3000) {
        const toast = document.getElementById('notificationToast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast ${type} active`;

        setTimeout(() => {
            toast.classList.remove('active');
        }, duration);
    }

    // Display results section
    static displayResults(containerId, results, calculation = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        let html = `<div class="results-header">📊 النتائج</div>`;

        if (calculation && calculation.results) {
            for (const [key, value] of Object.entries(calculation.results)) {
                // Use grade or average field (support both)
                const grade = value.grade !== undefined ? value.grade : (value.average || 0);
                const statusClass = this.getStatusClass(calculation.status);
                html += `
                    <div class="result-item">
                        <div>
                            <div class="result-label">${value.name || key}</div>
                            <div style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.25rem;">
                                المعامل: ${value.coef}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="result-value">${parseFloat(grade).toFixed(2)}/20</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(grade / 20) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Overall average
            const statusLabel = GradeCalculator.getStatusLabel(calculation.status);
            const statusClass = this.getStatusClass(calculation.status);
            html += `
                <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-xl); border-top: 2px solid var(--border-color);">
                    <div class="result-item">
                        <div class="result-label" style="font-size: 1.125rem; font-weight: 700;">
                            <i class="fas fa-crown"></i> المعدل الكلي
                        </div>
                        <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                            <div class="result-value" style="font-size: 2rem;">${parseFloat(calculation.average).toFixed(2)}</div>
                            <div class="result-status ${statusClass}">
                                ${statusLabel.emoji} ${statusLabel.ar}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
        container.style.display = 'block';
        console.log(`✓ Results displayed in ${containerId}`);
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
        return parseFloat(grade).toFixed(2);
    }

    // Create form input for subject
    static createSubjectInput(subject, coefficient, placeholder = '') {
        const container = document.createElement('div');
        container.className = 'form-group';

        const label = document.createElement('label');
        label.innerHTML = `${subject} <span style="font-size: 0.85rem; color: var(--text-light);">(coef: ${coefficient})</span>`;

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = '20';
        input.step = '0.5';
        input.placeholder = placeholder || 'Enter grade (0-20)';
        input.name = subject.toLowerCase().replace(/\s+/g, '');
        input.value = '';

        container.appendChild(label);
        container.appendChild(input);

        return { container, input };
    }

    // Toggle modal visibility
    static toggleModal(modalId, show = true) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (show) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        } else {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    // Create custom subject card for page 3
    static createCustomSubjectCard(subject, index) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.dataset.index = index;

        const header = document.createElement('div');
        header.className = 'subject-header';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'subject-name';
        nameSpan.textContent = subject.name;

        const coefSpan = document.createElement('span');
        coefSpan.className = 'subject-coef';
        coefSpan.textContent = `Coef: ${subject.coef}`;

        header.appendChild(nameSpan);
        header.appendChild(coefSpan);

        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'subject-inputs';

        // Create exam inputs
        if (subject.exams && subject.exams.length > 0) {
            subject.exams.forEach((exam, i) => {
                const group = document.createElement('div');
                group.className = 'form-group';
                group.style.marginBottom = 'var(--spacing-md)';

                const label = document.createElement('label');
                label.className = 'input-label';
                label.textContent = `Exam ${i + 1}`;

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.max = '20';
                input.step = '0.5';
                input.placeholder = '0-20';
                input.value = exam || '';
                input.className = 'exam-input';
                input.dataset.index = i;
                input.dataset.subjectIndex = index;

                group.appendChild(label);
                group.appendChild(input);
                inputsDiv.appendChild(group);
            });
        }

        // Add TP/TD input if needed
        if (subject.hasTP) {
            const group = document.createElement('div');
            group.className = 'form-group';
            group.style.marginBottom = 'var(--spacing-md)';

            const label = document.createElement('label');
            label.className = 'input-label';
            label.textContent = 'TP/TD';

            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.max = '20';
            input.step = '0.5';
            input.placeholder = '0-20';
            input.value = subject.tp || '';
            input.className = 'tp-input';
            input.dataset.subjectIndex = index;

            group.appendChild(label);
            group.appendChild(input);
            inputsDiv.appendChild(group);
        }

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
        removeBtn.onclick = () => removeCustomSubject(index);

        card.appendChild(header);
        card.appendChild(inputsDiv);
        card.appendChild(removeBtn);

        return card;
    }

    // Get current form data
    static getFormData(formSelector) {
        const form = document.querySelector(formSelector);
        if (!form) return {};

        const data = {};
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.name) {
                if (input.type === 'checkbox') {
                    data[input.name] = input.checked;
                } else if (input.type === 'number') {
                    data[input.name] = input.value ? parseFloat(input.value) : 0;
                } else {
                    data[input.name] = input.value;
                }
            }
        });

        return data;
    }

    // Create stat card for dashboard
    static createStatCard(icon, label, value, status = null) {
        const card = document.createElement('div');
        card.className = 'stat-card';

        let statusClass = '';
        if (status === 'good') {
            statusClass = 'color: var(--success-color);';
        } else if (status === 'medium') {
            statusClass = 'color: var(--warning-color);';
        } else if (status === 'weak') {
            statusClass = 'color: var(--danger-color);';
        }

        card.innerHTML = `
            <div class="stat-icon" style="${statusClass}">
                ${icon}
            </div>
            <div class="stat-label">${label}</div>
            <div class="stat-value">${typeof value === 'number' ? value.toFixed(2) : value}</div>
        `;

        return card;
    }

    // Check if form has valid data
    static hasValidData(formData) {
        return Object.values(formData).some(val => val && val !== 0);
    }

    // Disable/Enable button
    static setButtonState(buttonId, disabled = false) {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.disabled = disabled;
            btn.style.opacity = disabled ? '0.5' : '1';
        }
    }

    // Clear form
    static clearForm(formSelector) {
        const form = document.querySelector(formSelector);
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
        }
    }

    // Animate value change
    static animateValue(element, startValue, endValue, duration = 1000) {
        const range = endValue - startValue;
        const increment = range / (duration / 16);
        let currentValue = startValue;

        const animate = () => {
            currentValue += increment;
            if ((increment > 0 && currentValue >= endValue) || (increment < 0 && currentValue <= endValue)) {
                currentValue = endValue;
            }
            element.textContent = currentValue.toFixed(2);

            if (currentValue !== endValue) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Format date
    static formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options);
    }
}
