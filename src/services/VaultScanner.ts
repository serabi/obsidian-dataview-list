import { TFile, Vault } from 'obsidian';
import { DataviewQuery } from '../types';

export class VaultScanner {
    private vault: Vault;
    private excludedFolders: string[];
    private excludedFiles: string[];

    constructor(vault: Vault, excludedFolders: string[] = [], excludedFiles: string[] = []) {
        this.vault = vault;
        this.excludedFolders = excludedFolders;
        this.excludedFiles = excludedFiles;
    }

    async scanVault(): Promise<Map<string, DataviewQuery[]>> {
        const queryMap = new Map<string, DataviewQuery[]>();
        const markdownFiles = this.vault.getMarkdownFiles();

        for (const file of markdownFiles) {
            if (this.shouldSkipFile(file)) continue;

            try {
                const queries = await this.scanFile(file);
                
                for (const query of queries) {
                    if (!queryMap.has(query.query)) {
                        queryMap.set(query.query, []);
                    }
                    queryMap.get(query.query)?.push(query);
                }
            } catch (error) {
                console.error(`Error scanning file ${file.path}:`, error);
            }
        }

        return queryMap;
    }

    private async scanFile(file: TFile): Promise<DataviewQuery[]> {
        const content = await this.vault.cachedRead(file);
        const queries: DataviewQuery[] = [];
        
        // Regular expression to match strings ending with ::
        // Captures everything before :: that isn't a newline
        const queryRegex = /([^\n:]+)::/g;
        let match;

        while ((match = queryRegex.exec(content)) !== null) {
            const query = match[1].trim();
            const lineNumber = this.getLineNumber(content, match.index);
            
            queries.push({
                query,
                filePath: file.path,
                fileName: file.basename,
                lineNumber
            });
        }

        return queries;
    }

    private getLineNumber(content: string, index: number): number {
        const contentBeforeMatch = content.slice(0, index);
        return contentBeforeMatch.split('\n').length;
    }

    private shouldSkipFile(file: TFile): boolean {
        // Check if file is in excluded files list
        if (this.excludedFiles.includes(file.path)) {
            return true;
        }

        // Check if file is in excluded folders
        return this.excludedFolders.some(folder => 
            file.path.startsWith(folder)
        );
    }
} 