export interface DataviewQuery {
    query: string;
    filePath: string;
    fileName: string;
    lineNumber: number;
}

export interface DataviewListSettings {
    excludedFolders: string[];
    excludedFiles: string[];
} 