/* ==================== CALCULATOR.JS - CALCULATION LOGIC ==================== */

class GradeCalculator {
    // Page 1: Basic Semester Calculator
    static calculateBasicSemester(grades) {
        const subjects = {
            'Organic': 3,
            'History of Pharmacy': 1,
            'Biostatistics': 1.5,
            'Cell Biology': 3,
            'Plant Biology': 2,
            'Physics': 2
        };

        let totalWeighted = 0;
        let totalCoef = 0;
        const results = {};

        for (const [subject, coef] of Object.entries(subjects)) {
            const grade = parseFloat(grades[subject]) || 0;
            if (grade > 0) {
                results[subject] = {
                    average: grade,  // Changed from 'grade' to 'average' for consistency
                    coef: coef,
                    weighted: grade * coef
                };
                totalWeighted += grade * coef;
                totalCoef += coef;
            }
        }

        const average = totalCoef > 0 ? (totalWeighted / totalCoef).toFixed(2) : 0;

        return {
            average: parseFloat(average),
            results: results,
            totalCoef: totalCoef,
            status: this.getStatus(parseFloat(average))
        };
    }

    // Page 2: Advanced Structured Calculator
    static calculateAdvancedStructured(data) {
        const subjectConfigs = {
            'Organic': { coef: 3, exams: 2 },
            'Cell Biology': { coef: 3, tests: 3 },
            'Plant Biology': { coef: 2, tests: 2, hasTP: true },
            'Biostatistics': { coef: 1.5 },
            'Informatics': { coef: 1.5 },
            'Anatomy': { coef: 1 },
            'Physiology': { coef: 1 },
            'English': { coef: 1 }
        };

        let totalWeighted = 0;
        let totalCoef = 0;
        const results = {};

        for (const [subject, config] of Object.entries(subjectConfigs)) {
            const subjectKey = subject.toLowerCase().replace(/\s+/g, '');
            const subjectData = data[subjectKey] || {};

            let subjectAverage = 0;
            let hasData = false;

            if (config.exams) {
                const exams = [];
                for (let i = 1; i <= config.exams; i++) {
                    const grade = parseFloat(subjectData[`exam${i}`]) || null;
                    if (grade !== null && grade > 0) {
                        exams.push(grade);
                        hasData = true;
                    }
                }
                if (exams.length > 0) {
                    subjectAverage = exams.reduce((a, b) => a + b) / exams.length;
                }
            } else if (config.tests) {
                const tests = [];
                for (let i = 1; i <= config.tests; i++) {
                    const grade = parseFloat(subjectData[`test${i}`]) || null;
                    if (grade !== null && grade > 0) {
                        tests.push(grade);
                        hasData = true;
                    }
                }
                if (tests.length > 0) {
                    subjectAverage = tests.reduce((a, b) => a + b) / tests.length;
                }
            } else {
                const grade = parseFloat(subjectData.grade) || null;
                if (grade !== null && grade > 0) {
                    subjectAverage = grade;
                    hasData = true;
                }
            }

            // Add TP/TD if applicable
            if (config.hasTP) {
                const tp = parseFloat(subjectData.tp) || null;
                if (tp !== null && tp > 0) {
                    subjectAverage = (subjectAverage + tp) / 2;
                    hasData = true;
                }
            }

            if (hasData && subjectAverage > 0) {
                results[subject] = {
                    average: parseFloat(subjectAverage.toFixed(2)),
                    coef: config.coef,
                    weighted: subjectAverage * config.coef
                };
                totalWeighted += subjectAverage * config.coef;
                totalCoef += config.coef;
            }
        }

        const average = totalCoef > 0 ? (totalWeighted / totalCoef).toFixed(2) : 0;

        return {
            average: parseFloat(average),
            results: results,
            totalCoef: totalCoef,
            status: this.getStatus(parseFloat(average))
        };
    }

    // Page 3: Custom Calculator
    static calculateCustom(subjects) {
        let totalWeighted = 0;
        let totalCoef = 0;
        const results = {};

        subjects.forEach((subject, index) => {
            const { name, coef, exams, tp } = subject;
            let subjectAverage = 0;
            let hasData = false;

            if (exams && exams.length > 0) {
                const validGrades = exams
                    .map(e => parseFloat(e) || null)
                    .filter(e => e !== null && e >= 0 && e <= 20);

                if (validGrades.length > 0) {
                    subjectAverage = validGrades.reduce((a, b) => a + b) / validGrades.length;
                    hasData = true;
                }
            }

            if (tp !== undefined && tp !== null && tp !== '') {
                const tpGrade = parseFloat(tp) || null;
                if (tpGrade !== null && tpGrade >= 0 && tpGrade <= 20) {
                    if (hasData) {
                        subjectAverage = (subjectAverage + tpGrade) / 2;
                    } else {
                        subjectAverage = tpGrade;
                    }
                    hasData = true;
                }
            }

            if (hasData && subjectAverage > 0) {
                results[index] = {
                    name: name,
                    average: parseFloat(subjectAverage.toFixed(2)),
                    coef: parseFloat(coef),
                    weighted: subjectAverage * parseFloat(coef)
                };
                totalWeighted += subjectAverage * parseFloat(coef);
                totalCoef += parseFloat(coef);
            }
        });

        const average = totalCoef > 0 ? (totalWeighted / totalCoef).toFixed(2) : 0;

        return {
            average: parseFloat(average),
            results: results,
            totalCoef: totalCoef,
            status: this.getStatus(parseFloat(average))
        };
    }

    // Get performance status
    static getStatus(average) {
        if (average >= 14) return 'good';
        if (average >= 10) return 'medium';
        return 'weak';
    }

    // Get status label (with Arabic translations)
    static getStatusLabel(status) {
        const labels = {
            'good': { en: 'Excellent', ar: 'ممتاز', emoji: '✅' },
            'medium': { en: 'Medium', ar: 'متوسط', emoji: '⚠️' },
            'weak': { en: 'Weak', ar: 'ضعيف', emoji: '❌' }
        };
        return labels[status] || labels.weak;
    }

    // Calculate cumulative average across all pages
    static calculateCumulativeAverage(page1Results, page2Results, page3Results) {
        const averages = [];
        
        if (page1Results && page1Results.average) {
            averages.push(page1Results.average);
        }
        if (page2Results && page2Results.average) {
            averages.push(page2Results.average);
        }
        if (page3Results && page3Results.average) {
            averages.push(page3Results.average);
        }

        if (averages.length === 0) return 0;
        const cumulative = averages.reduce((a, b) => a + b) / averages.length;
        return parseFloat(cumulative.toFixed(2));
    }

    // Validate grade input
    static validateGrade(grade) {
        const num = parseFloat(grade);
        return !isNaN(num) && num >= 0 && num <= 20;
    }

    // Get color based on grade
    static getGradeColor(average) {
        if (average >= 14) return '#10b981'; // Green
        if (average >= 10) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    }
}
