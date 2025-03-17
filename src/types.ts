export interface DataviewListSettings {
    excludedFolders: string[];
    excludedFiles: string[];
}

export interface DataviewQuery {
    queryText: string;
    filePath: string;
    fileName: string;
    lineNumber: number;
} 