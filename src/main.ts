import { Plugin, Notice, TFile } from 'obsidian';
import { DataviewListView, VIEW_TYPE_DATAVIEW_LIST } from './view';
import { DataviewListSettings, DataviewQuery } from './types';
import { DataviewListSettingTab } from './settings-tab';
import { VaultScanner } from './services/VaultScanner';

const DEFAULT_SETTINGS: DataviewListSettings = {
    excludedFolders: [],
    excludedFiles: [],
};

export default class DataviewListPlugin extends Plugin {
    settings: DataviewListSettings;
    queries: Map<string, DataviewQuery[]> = new Map();
    private scanner: VaultScanner;

    async onload() {
        await this.loadSettings();
        
        this.scanner = new VaultScanner(
            this.app.vault,
            this.settings.excludedFolders,
            this.settings.excludedFiles
        );

        // Register view
        this.registerView(
            VIEW_TYPE_DATAVIEW_LIST,
            (leaf) => new DataviewListView(leaf, this)
        );

        // Add ribbon icon
        this.addRibbonIcon('list-checks', 'Dataview List', () => {
            this.activateView();
        });

        // Add settings tab
        this.addSettingTab(new DataviewListSettingTab(this.app, this));

        // Add command to scan vault
        this.addCommand({
            id: 'scan-vault-for-queries',
            name: 'Scan vault for Dataview queries',
            callback: () => {
                this.scanVault();
            }
        });
    }

    async scanVault() {
        try {
            const notice = new Notice('Scanning vault for Dataview queries...');
            this.queries = await this.scanner.scanVault();
            notice.setMessage(`Found ${this.queries.size} unique queries`);
            
            const view = this.app.workspace.getLeavesOfType(VIEW_TYPE_DATAVIEW_LIST)[0]?.view;
            if (view instanceof DataviewListView) {
                await view.refresh();
            }
        } catch (error) {
            new Notice('Error scanning vault: ' + error.message);
            console.error('Error scanning vault:', error);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateView() {
        const { workspace } = this.app;
        
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_DATAVIEW_LIST)[0];
        
        if (!leaf) {
            const rightLeaf = workspace.getRightLeaf(false);
            if (rightLeaf) {
                leaf = rightLeaf;
                await leaf.setViewState({
                    type: VIEW_TYPE_DATAVIEW_LIST,
                    active: true,
                });
            }
        }
        
        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }

    async onunload() {
        // Nothing to clean up
    }
}
