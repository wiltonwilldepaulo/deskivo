import { ipcMain, BrowserWindow } from 'electron';
import Template from '../mixin/Template.js';

function getWin(event) {
    return BrowserWindow.fromWebContents(event.sender);
}

ipcMain.handle('window:open', (_e, name, opts = {}) => {
    const win = Template.create(name, opts);
    Template.loadView(win, name);
});

ipcMain.handle('window:openModal', (e, name, opts = {}) => {
    const parent = getWin(e);
    if (!parent) return;

    const win = Template.create(name, {
        width: 560,
        height: 420,
        resizable: false,
        minimizable: false,
        maximizable: false,
        parent: parent,
        modal: true,
        ...opts,
    });

    Template.loadView(win, name);
});

// ── Customer ────────────────────────

ipcMain.handle('customer:insert', async (_e, data) => {
    const [result] = await connection('customers').insert(data).returning('*');
    return result;
});

ipcMain.handle('customer:find', async (_e, where = {}) => {
    return connection('customers').where(where).select('*');
});

ipcMain.handle('customer:update', async (_e, id, data) => {
    return connection('customers').where({ id }).update(data);
});

ipcMain.handle('customer:delete', async (_e, id) => {
    return connection('customers').where({ id }).del();
});