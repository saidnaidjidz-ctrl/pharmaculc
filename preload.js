/* ==================== ELECTRON PRELOAD SCRIPT ==================== */

const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppName: () => ipcRenderer.invoke('get-app-name'),
    isDev: process.env.NODE_ENV === 'development'
});

console.log('✅ Preload script loaded - Secure context ready');
