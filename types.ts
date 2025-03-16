export interface DataviewQuery {
    query: string;
    filePath: string;
    lineNumber: number;
    fileName: string;  // Adding this for better display
}

export interface QueryGroup {
    queryName: string;
    occurrences: DataviewQuery[];
} 