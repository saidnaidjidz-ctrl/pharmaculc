/* ==================== STORAGE.JS - LOCAL STORAGE MANAGEMENT ==================== */

class DataStorage {
    constructor() {
        this.dbName = 'pharmcalc_db';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.dbName)) {
            localStorage.setItem(this.dbName, JSON.stringify({
                page1: {
                    data: {},
                    results: null
                },
                page2: {
                    data: {},
                    results: null
                },
                page3: {
                    subjects: [],
                    results: null
                },
                semesters: [],
                currentSemester: null,
                preferences: {
                    darkMode: false
                }
            }));
        }
    }

    getData() {
        const data = localStorage.getItem(this.dbName);
        return data ? JSON.parse(data) : null;
    }

    setData(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    }

    // Page 1 Methods
    setPage1Data(data) {
        const allData = this.getData();
        allData.page1.data = data;
        this.setData(allData);
    }

    getPage1Data() {
        return this.getData().page1.data;
    }

    setPage1Results(results) {
        const allData = this.getData();
        allData.page1.results = results;
        this.setData(allData);
    }

    getPage1Results() {
        return this.getData().page1.results;
    }

    // Page 2 Methods
    setPage2Data(data) {
        const allData = this.getData();
        allData.page2.data = data;
        this.setData(allData);
    }

    getPage2Data() {
        return this.getData().page2.data;
    }

    setPage2Results(results) {
        const allData = this.getData();
        allData.page2.results = results;
        this.setData(allData);
    }

    getPage2Results() {
        return this.getData().page2.results;
    }

    // Page 3 Methods
    setPage3Subjects(subjects) {
        const allData = this.getData();
        allData.page3.subjects = subjects;
        this.setData(allData);
    }

    getPage3Subjects() {
        return this.getData().page3.subjects;
    }

    setPage3Results(results) {
        const allData = this.getData();
        allData.page3.results = results;
        this.setData(allData);
    }

    getPage3Results() {
        return this.getData().page3.results;
    }

    // Semester Methods
    saveSemester(semesterName, semesterData) {
        const allData = this.getData();
        const semester = {
            id: Date.now(),
            name: semesterName,
            date: new Date().toLocaleDateString(),
            data: semesterData
        };
        allData.semesters.push(semester);
        this.setData(allData);
        return semester.id;
    }

    getSemesters() {
        return this.getData().semesters;
    }

    deleteSemester(semesterId) {
        const allData = this.getData();
        allData.semesters = allData.semesters.filter(s => s.id !== semesterId);
        this.setData(allData);
    }

    // Preferences Methods
    setDarkMode(enabled) {
        const allData = this.getData();
        allData.preferences.darkMode = enabled;
        this.setData(allData);
    }

    getDarkMode() {
        return this.getData().preferences.darkMode;
    }

    // Reset Methods
    resetPage1() {
        const allData = this.getData();
        allData.page1 = { data: {}, results: null };
        this.setData(allData);
    }

    resetPage2() {
        const allData = this.getData();
        allData.page2 = { data: {}, results: null };
        this.setData(allData);
    }

    resetPage3() {
        const allData = this.getData();
        allData.page3 = { subjects: [], results: null };
        this.setData(allData);
    }

    resetAll() {
        localStorage.removeItem(this.dbName);
        this.initializeStorage();
    }

    // Get all results for dashboard
    getAllResults() {
        const data = this.getData();
        return {
            page1: data.page1.results,
            page2: data.page2.results,
            page3: data.page3.results
        };
    }

    // Export data as JSON
    exportData() {
        return this.getData();
    }

    // Import data from JSON
    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            this.setData(data);
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }
}

// Create global storage instance
const storage = new DataStorage();
