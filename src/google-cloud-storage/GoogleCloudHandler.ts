import { CreateResumableUploadOptions, File, GetSignedUrlConfig, Storage, UploadOptions } from "@google-cloud/storage"
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

    async retrieveFromStorage(
        filePath: string,
        bucketName: string,
        expires?: GetSignedUrlConfig["expires"]
    ): Promise<string> {
        const [url] = await this.storage.bucket(bucketName).file(filePath).getSignedUrl({
            action: "read",
            expires: expires ? expires : Date.now() + 1000 * 60 * 60
        })

        return url
    }

    async getSignedUrl(filePath: string, bucketName: string, options?: CreateResumableUploadOptions): Promise<string> {
        const file = this.storage.bucket(bucketName).file(filePath)
        const url = options ?
            await this.createResumableUploadWithOptions(file, options)
            : await this.createResumableUploadWithNoOptions(file)
        return url
    }

    private async createResumableUploadWithOptions(file: File, options: CreateResumableUploadOptions): Promise<string> {
        const [url] = await file.createResumableUpload(options)
        return url
    }

    private async createResumableUploadWithNoOptions(file: File): Promise<string> {
        const [url] = await file.createResumableUpload()
        return url
    }

}