import { CloudConfig } from "../interfaces";
import { Environment } from 'roit-environment'
import { CredentialBody } from 'google-auth-library'

export class GoogleCloudConfig implements CloudConfig {

    private readonly credentials: CredentialBody | undefined

    constructor() {
        const credentialFile = Environment.getProperty('googleStorageCredential')
        if(credentialFile) {
            this.credentials = require(credentialFile)
        }
    }

    getConfig(): GoogleCloudConfig {
        return this
    }

    getCredentials(): CredentialBody | undefined {
        return this.credentials
    }
}