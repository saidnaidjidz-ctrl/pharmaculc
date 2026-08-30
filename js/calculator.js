/* ==================== CALCULATOR.JS - CALCULATION LOGIC ==================== */

class GradeCalculator {
    // Validate grade input (0 to 20)
    static validateGrade(grade) {
        if (grade === null || grade === undefined || grade === '') return false;
        const num = parseFloat(grade);
        return !isNaN(num) && num >= 0 && num <= 20;
    }

    // Generic calculation for any pharmacy year
    static calculateYear(yearId, data) {
        const yearConfig = YEARS_CONFIG[yearId];
        if (!yearConfig) {
            console.error(`Year configuration not found for: ${yearId}`);
            return { average: 0, calculatedAverage: 0, results: {}, totalCoef: 0, status: 'weak' };
        }

        let totalWeighted = 0;
        let totalCoef = 0;
        const results = {};

        for (const subject of yearConfig.subjects) {
            const key = subject.key;
            const subjectData = data[key] || {};

            let subjectAverage = 0;
            let hasData = false;
            const testGrades = [];

            // Determine test count (support user choice for subjects like Chimie minérale)
            const testCount = parseInt(subjectData.testCountChoice || subject.count || 1);

            if (subject.type === 'exams') {
                const examCount = subject.count || 2;
                const exams = [];
                for (let i = 1; i <= examCount; i++) {
                    const val = subjectData[`exam${i}`];
                    if (this.validateGrade(val)) {
                        exams.push(parseFloat(val));
                        hasData = true;
                    }
                }
                if (exams.length > 0) {
                    subjectAverage = exams.reduce((a, b) => a + b, 0) / exams.length;
                }
            } else if (subject.type === 'tests') {
                for (let i = 1; i <= testCount; i++) {
                    const val = subjectData[`test${i}`];
                    if (this.validateGrade(val)) {
                        const num = parseFloat(val);
                        testGrades.push(num);
                        hasData = true;
                    }
                }
                if (testGrades.length > 0) {
                    // Average of tests: (T1 + T2 + ... + Tn) / n
                    subjectAverage = testGrades.reduce((a, b) => a + b, 0) / testGrades.length;
                }
            } else if (subject.type === 'single') {
                const val = subjectData.grade;
                if (this.validateGrade(val)) {
                    subjectAverage = parseFloat(val);
                    hasData = true;
                }
            }

            // Handle TP calculation
            // Formula: (4 × Moyenne_Tests + TP) / 5
            // Tests contribute 4/5 of subject grade, TP contributes 1/5
            let tpGrade = null;
            if (subject.hasTP || subject.tpToggleable) {
                const tpVal = subjectData.tp;
                if (this.validateGrade(tpVal)) {
                    tpGrade = parseFloat(tpVal);
                    if (hasData) {
                        // TP formula: (4 × Moyenne_Tests + TP) / 5
                        subjectAverage = (4 * subjectAverage + tpGrade) / 5;
                    } else {
                        // If only TP entered (no test grades)
                        subjectAverage = tpGrade;
                        hasData = true;
                    }
                }
                // If TP is optional and not provided, subjectAverage = moyenne des tests (no penalty)
            }

            if (hasData) {
                const weighted = subjectAverage * subject.coef;
                results[key] = {
                    key: key,
                    name: subject.name,
                    average: parseFloat(subjectAverage.toFixed(2)),
                    testAverage: testGrades.length > 0 ? parseFloat((testGrades.reduce((a, b) => a + b, 0) / testGrades.length).toFixed(2)) : null,
                    tpGrade: tpGrade,
                    testGrades: testGrades,
                    testCount: testCount,
                    coef: subject.coef,
                    weighted: parseFloat(weighted.toFixed(2))
                };
                totalWeighted += weighted;
                totalCoef += subject.coef;
            }
        }

        const calculatedAverage = totalCoef > 0 ? (totalWeighted / totalCoef) : 0;
        
        // Final Average rule: Add +0.05 once to the general calculated average
        // Clamped at 20 max
        const finalAverage = totalCoef > 0 ? Math.min(20, calculatedAverage + 0.05) : 0;

        return {
            calculatedAverage: parseFloat(calculatedAverage.toFixed(2)),
            average: parseFloat(finalAverage.toFixed(2)), // Main display average with +0.05
            bonusAdded: totalCoef > 0 ? 0.05 : 0,
            results: results,
            totalCoef: totalCoef,
            totalWeighted: parseFloat(totalWeighted.toFixed(2)),
            status: this.getStatus(finalAverage)
        };
    }

    // Page 1: Basic Semester Calculator (Legacy)
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
            if (this.validateGrade(grade) && grade > 0) {
                results[subject] = {
                    name: subject,
                    average: grade,
                    coef: coef,
                    weighted: grade * coef
                };
                totalWeighted += grade * coef;
                totalCoef += coef;
            }
        }

        const calculatedAverage = totalCoef > 0 ? (totalWeighted / totalCoef) : 0;
        const finalAverage = totalCoef > 0 ? Math.min(20, calculatedAverage + 0.05) : 0;

        return {
            calculatedAverage: parseFloat(calculatedAverage.toFixed(2)),
            average: parseFloat(finalAverage.toFixed(2)),
            bonusAdded: totalCoef > 0 ? 0.05 : 0,
            results: results,
            totalCoef: totalCoef,
            status: this.getStatus(finalAverage)
        };
    }

    // Page 2: Advanced Structured Calculator (1st Year Legacy / Bridge)
    static calculateAdvancedStructured(data) {
        return this.calculateYear('year1', data);
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
                    .map(e => parseFloat(e))
                    .filter(e => GradeCalculator.validateGrade(e));

                if (validGrades.length > 0) {
                    subjectAverage = validGrades.reduce((a, b) => a + b, 0) / validGrades.length;
                    hasData = true;
                }
            }

            if (tp !== undefined && tp !== null && tp !== '') {
                const tpGrade = parseFloat(tp);
                if (GradeCalculator.validateGrade(tpGrade)) {
                    if (hasData) {
                        // TP formula: (4 × Moyenne_Tests + TP) / 5
                        subjectAverage = (4 * subjectAverage + tpGrade) / 5;
                    } else {
                        subjectAverage = tpGrade;
                    }
                    hasData = true;
                }
            }

            if (hasData && subjectAverage >= 0) {
                const coefNum = parseFloat(coef) || 1;
                results[index] = {
                    name: name,
                    average: parseFloat(subjectAverage.toFixed(2)),
                    coef: coefNum,
                    weighted: parseFloat((subjectAverage * coefNum).toFixed(2))
                };
                totalWeighted += subjectAverage * coefNum;
                totalCoef += coefNum;
            }
        });

        const calculatedAverage = totalCoef > 0 ? (totalWeighted / totalCoef) : 0;
        const finalAverage = totalCoef > 0 ? Math.min(20, calculatedAverage + 0.05) : 0;

        return {
            calculatedAverage: parseFloat(calculatedAverage.toFixed(2)),
            average: parseFloat(finalAverage.toFixed(2)),
            bonusAdded: totalCoef > 0 ? 0.05 : 0,
            results: results,
            totalCoef: totalCoef,
            status: this.getStatus(finalAverage)
        };
    }

    // Get performance status
    static getStatus(average) {
        if (average >= 14) return 'good';
        if (average >= 10) return 'medium';
        return 'weak';
    }

    // Get status label (with Arabic & English translations)
    static getStatusLabel(status) {
        const labels = {
            'good': { en: 'Excellent', ar: 'ناجح بملاحظة جيدة', emoji: '✅' },
            'medium': { en: 'Admitted', ar: 'ناجح / مقبول', emoji: '🎉' },
            'weak': { en: 'Ajourné', ar: 'راسب / مؤجل', emoji: '❌' }
        };
        return labels[status] || labels.weak;
    }

    // Get color based on grade
    static getGradeColor(average) {
        if (average >= 14) return '#10b981'; // Green
        if (average >= 10) return '#3b82f6'; // Blue/Neutral
        return '#ef4444'; // Red
    }
}
