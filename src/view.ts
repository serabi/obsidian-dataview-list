import { ItemView, WorkspaceLeaf, ButtonComponent, TFile } from 'obsidian';
import type DataviewListPlugin from './main';

export const VIEW_TYPE_DATAVIEW_LIST = 'dataview-list-view';

export class DataviewListView extends ItemView {
    plugin: DataviewListPlugin;

    constructor(leaf: WorkspaceLeaf, plugin: DataviewListPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return VIEW_TYPE_DATAVIEW_LIST;
    }

    getDisplayText() {
        return 'Dataview List';
    }

    async onOpen() {
        await this.refresh();
    }

    async refresh() {
        const container = this.containerEl.children[1];
        container.empty();
        
        // Create header container
        const headerContainer = container.createEl('div', {
            cls: 'dataview-list-header'
        });

        // Add title
        headerContainer.createEl('h4', { 
            text: 'Dataview Queries',
            cls: 'dataview-list-title'
        });

        // Add scan button
        new ButtonComponent(headerContainer)
            .setButtonText('Scan Vault')
            .setIcon('search')
            .onClick(async () => {
                await this.plugin.scanVault();
            });

        // Add some space after the header
        headerContainer.createEl('hr');

        // If no queries found, show message
        if (!this.plugin.queries.size) {
            container.createEl('p', { 
                text: 'No queries found. Click the scan button to search for queries.' 
            });
            return;
        }

        // Create list of queries
        for (const [file, queries] of this.plugin.queries) {
            const fileEl = container.createEl('details');
            fileEl.createEl('summary', { text: file });
            
            const queryList = fileEl.createEl('ul');
            queries.forEach(query => {
                const queryItem = queryList.createEl('li', {
                    cls: 'dataview-list-item'
                });
                
                // Create clickable container
                const clickableContainer = queryItem.createEl('div', {
                    cls: 'dataview-list-item-content'
                });
                
                // Add query text
                clickableContainer.createEl('code', { text: query.queryText });
                if (query.lineNumber) {
                    clickableContainer.createEl('small', { 
                        text: ` (Line ${query.lineNumber})` 
                    });
                }
                
                // Add click handler
                clickableContainer.addEventListener('click', async () => {
                    const file = this.app.vault.getAbstractFileByPath(query.filePath);
                    if (file instanceof TFile) {
                        const leaf = this.app.workspace.getLeaf(true);
                        await leaf.openFile(file, { active: true });
                        
                        // Wait for the editor to be ready
                        setTimeout(() => {
                            const editor = (leaf.view as any).editor;
                            if (editor) {
                                const line = query.lineNumber - 1; // Convert to 0-based index
                                editor.setCursor({ line, ch: 0 });
                                editor.focus();
                            }
                        }, 100);
                    }
                });
            });
        }
    }
}

export {}; 