/* ==================== STORAGE.JS - LOCAL STORAGE MANAGEMENT ==================== */

class DataStorage {
    constructor() {
        this.dbName = 'pharmcalc_db';
        this.initializeStorage();
    }

    initializeStorage() {
        let existing = localStorage.getItem(this.dbName);
        if (!existing) {
            const initialData = {
                page1: { data: {}, results: null },
                page2: { data: {}, results: null }, // Year 1 legacy
                page3: { subjects: [], results: null }, // Custom
                year1: { data: {}, results: null },
                year2: { data: {}, results: null },
                year3: { data: {}, results: null },
                year4: { data: {}, results: null },
                year5: { data: {}, results: null },
                semesters: [],
                currentSemester: null,
                preferences: { darkMode: false }
            };
            localStorage.setItem(this.dbName, JSON.stringify(initialData));
        } else {
            // Ensure newly added year keys exist without wiping existing data
            try {
                const data = JSON.parse(existing);
                let modified = false;
                ['year1', 'year2', 'year3', 'year4', 'year5'].forEach(yr => {
                    if (!data[yr]) {
                        data[yr] = { data: {}, results: null };
                        modified = true;
                    }
                });
                if (modified) {
                    localStorage.setItem(this.dbName, JSON.stringify(data));
                }
            } catch (e) {
                console.error('Storage schema migration error:', e);
            }
        }
    }

    getData() {
        const data = localStorage.getItem(this.dbName);
        return data ? JSON.parse(data) : {};
    }

    setData(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    }

    // Generic Year Methods
    setYearData(yearId, data) {
        const allData = this.getData();
        if (!allData[yearId]) allData[yearId] = { data: {}, results: null };
        allData[yearId].data = data;

        // Bridge year1 <-> page2 for legacy compatibility
        if (yearId === 'year1') {
            if (!allData.page2) allData.page2 = { data: {}, results: null };
            allData.page2.data = data;
        }
        this.setData(allData);
    }

    getYearData(yearId) {
        const allData = this.getData();
        if (yearId === 'year1') {
            return (allData.year1 && Object.keys(allData.year1.data || {}).length > 0)
                ? allData.year1.data
                : (allData.page2 ? allData.page2.data : {});
        }
        return allData[yearId] ? allData[yearId].data : {};
    }

    setYearResults(yearId, results) {
        const allData = this.getData();
        if (!allData[yearId]) allData[yearId] = { data: {}, results: null };
        allData[yearId].results = results;

        // Bridge year1 <-> page2
        if (yearId === 'year1') {
            if (!allData.page2) allData.page2 = { data: {}, results: null };
            allData.page2.results = results;
        }
        this.setData(allData);
    }

    getYearResults(yearId) {
        const allData = this.getData();
        if (yearId === 'year1') {
            return (allData.year1 && allData.year1.results)
                ? allData.year1.results
                : (allData.page2 ? allData.page2.results : null);
        }
        return allData[yearId] ? allData[yearId].results : null;
    }

    resetYear(yearId) {
        const allData = this.getData();
        if (allData[yearId]) {
            allData[yearId] = { data: {}, results: null };
        }
        if (yearId === 'year1' && allData.page2) {
            allData.page2 = { data: {}, results: null };
        }
        this.setData(allData);
    }

    // Page 1 Methods (Legacy)
    setPage1Data(data) {
        const allData = this.getData();
        if (!allData.page1) allData.page1 = {};
        allData.page1.data = data;
        this.setData(allData);
    }

    getPage1Data() {
        return this.getData().page1 ? this.getData().page1.data : {};
    }

    setPage1Results(results) {
        const allData = this.getData();
        if (!allData.page1) allData.page1 = {};
        allData.page1.results = results;
        this.setData(allData);
    }

    getPage1Results() {
        return this.getData().page1 ? this.getData().page1.results : null;
    }

    // Page 2 Methods (Legacy 1st Year)
    setPage2Data(data) {
        this.setYearData('year1', data);
    }

    getPage2Data() {
        return this.getYearData('year1');
    }

    setPage2Results(results) {
        this.setYearResults('year1', results);
    }

    getPage2Results() {
        return this.getYearResults('year1');
    }

    resetPage2() {
        this.resetYear('year1');
    }

    // Page 3 Methods (Custom Calculator)
    setPage3Subjects(subjects) {
        const allData = this.getData();
        if (!allData.page3) allData.page3 = {};
        allData.page3.subjects = subjects;
        this.setData(allData);
    }

    getPage3Subjects() {
        return this.getData().page3 ? this.getData().page3.subjects : [];
    }

    setPage3Results(results) {
        const allData = this.getData();
        if (!allData.page3) allData.page3 = {};
        allData.page3.results = results;
        this.setData(allData);
    }

    getPage3Results() {
        return this.getData().page3 ? this.getData().page3.results : null;
    }

    resetPage3() {
        const allData = this.getData();
        allData.page3 = { subjects: [], results: null };
        this.setData(allData);
    }

    // Preferences
    setDarkMode(enabled) {
        const allData = this.getData();
        if (!allData.preferences) allData.preferences = {};
        allData.preferences.darkMode = enabled;
        this.setData(allData);
    }

    getDarkMode() {
        const allData = this.getData();
        return allData.preferences ? allData.preferences.darkMode : false;
    }

    setLanguage(lang) {
        const allData = this.getData();
        if (!allData.preferences) allData.preferences = {};
        allData.preferences.language = lang;
        this.setData(allData);
        localStorage.setItem('pharmacalc_lang', lang);
    }

    getLanguage() {
        const allData = this.getData();
        if (allData.preferences && allData.preferences.language) {
            return allData.preferences.language;
        }
        return localStorage.getItem('pharmacalc_lang') || 'ar';
    }

    resetAll() {
        localStorage.removeItem(this.dbName);
        this.initializeStorage();
    }

    // Get all results for Dashboard & Export
    getAllResults() {
        const data = this.getData();
        return {
            year1: (data.year1 && data.year1.results) ? data.year1.results : (data.page2 ? data.page2.results : null),
            year2: data.year2 ? data.year2.results : null,
            year3: data.year3 ? data.year3.results : null,
            year4: data.year4 ? data.year4.results : null,
            year5: data.year5 ? data.year5.results : null,
            page2: (data.year1 && data.year1.results) ? data.year1.results : (data.page2 ? data.page2.results : null),
            page3: data.page3 ? data.page3.results : null
        };
    }

    exportData() {
        return this.getData();
    }

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
