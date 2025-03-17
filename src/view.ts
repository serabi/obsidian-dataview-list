import { ItemView, WorkspaceLeaf } from 'obsidian';
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
        
        // Create header
        container.createEl('h4', { text: 'Dataview Queries' });

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
                const queryItem = queryList.createEl('li');
                queryItem.createEl('code', { text: query.queryText });
                if (query.lineNumber) {
                    queryItem.createEl('small', { 
                        text: ` (Line ${query.lineNumber})` 
                    });
                }
            });
        }
    }
}

export {}; 