import { App, PluginSettingTab, Setting } from 'obsidian';
import DataviewListPlugin from './main';

export class DataviewListSettingTab extends PluginSettingTab {
    plugin: DataviewListPlugin;

    constructor(app: App, plugin: DataviewListPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Dataview List Settings' });

        new Setting(containerEl)
            .setName('Excluded Folders')
            .setDesc('Folders to exclude from scanning (one per line)')
            .addTextArea(text => text
                .setPlaceholder('folder1\nfolder2')
                .setValue(this.plugin.settings.excludedFolders.join('\n'))
                .onChange(async (value) => {
                    this.plugin.settings.excludedFolders = value.split('\n').filter(x => x.trim());
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Excluded Files')
            .setDesc('Files to exclude from scanning (one per line)')
            .addTextArea(text => text
                .setPlaceholder('file1.md\nfile2.md')
                .setValue(this.plugin.settings.excludedFiles.join('\n'))
                .onChange(async (value) => {
                    this.plugin.settings.excludedFiles = value.split('\n').filter(x => x.trim());
                    await this.plugin.saveSettings();
                }));
    }
} 