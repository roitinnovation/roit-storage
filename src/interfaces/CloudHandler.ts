export interface CloudHandler {
    uploadToStorage: (filePath: string, bucketName: string) => Promise<string>
    retrieveFromStorage: (filePath: string, bucketName: string) => Promise<string>
}