import { GetSignedUrlConfig, Storage, UploadOptions } from "@google-cloud/storage"
import { CloudHandler } from "../interfaces"
import { GoogleCloudConfig } from "./GoogleCloudConfig"

export class GoogleCloudHandler implements CloudHandler {

    private readonly gcloudConfig = new GoogleCloudConfig()
    private readonly storage: Storage

    constructor() {
        this.storage = new Storage({
            credentials: this.gcloudConfig.getCredentials()
        })
    }

    getInstance(): GoogleCloudHandler {
        return new GoogleCloudHandler()
    }

    async uploadToStorage(filePath: string, bucketName: string): Promise<string>
    async uploadToStorage(filePath: string, bucketName: string, optionsStorage?: UploadOptions): Promise<string> {
        optionsStorage ?
            await this.uploadWithOptions(filePath, bucketName, optionsStorage)
            : await this.uploadWithNoOptions(filePath, bucketName)
        return `File ${filePath} uploaded to bucket ${bucketName}`
    }

    private async uploadWithOptions(filePath: string, bucketName: string, optionsStorage: UploadOptions): Promise<void> {
        await this.storage.bucket(bucketName).upload(filePath, optionsStorage)
    }

    private async uploadWithNoOptions(filePath: string, bucketName: string): Promise<void> {
        await this.storage.bucket(bucketName).upload(filePath)
    }

    async retrieveFromStorage(filePath: string, bucketName: string): Promise<string>
    async retrieveFromStorage(
        filePath: string,
        bucketName: string,
        action?: GetSignedUrlConfig["action"],
        expires?: GetSignedUrlConfig["expires"]
    ): Promise<string> {
        const [url] = await this.storage.bucket(bucketName).file(filePath).getSignedUrl({
            action: action ? action : "read",
            expires: expires ? expires : Date.now() + 1000 * 60 * 60
        })

        return url
    }
}