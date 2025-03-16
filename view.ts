import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import DataviewListPlugin from './main';
import { DataviewQuery } from './types';

export const VIEW_TYPE_DATAVIEW_LIST = 'dataview-list-view';

export class DataviewListView extends ItemView {
    plugin: DataviewListPlugin;
    queryContainer: HTMLElement;

    constructor(leaf: WorkspaceLeaf, plugin: DataviewListPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_DATAVIEW_LIST;
    }

    getDisplayText(): string {
        return 'Dataview List';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        
        // Add header
        container.createEl('h4', { text: 'Dataview Queries' });
        
        // Create query container
        this.queryContainer = container.createDiv('query-list-container');
        
        // Add refresh button
        const refreshButton = container.createEl('button', {
            text: 'Refresh Queries'
        });
        refreshButton.addEventListener('click', () => {
            this.plugin.scanVault();
        });

        await this.displayQueries();
    }

    async displayQueries() {
        this.queryContainer.empty();
        // We'll implement the actual query display logic in the next step
    }

    private async navigateToFile(filePath: string, lineNumber: number) {
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
            const leaf = this.app.workspace.getLeaf();
            await leaf.openFile(file);
            
            // Set cursor to the line containing the query
            const view = this.app.workspace.getActiveViewOfType(this.app.workspace.getActiveViewType());
            if (view && view.editor) {
                view.editor.setCursor({ line: lineNumber, ch: 0 });
            }
        }
    }
} 