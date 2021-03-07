import { CloudConfig } from "../interfaces";
import { Environment } from 'roit-environment'
import { CredentialBody } from 'google-auth-library'

export class GoogleCloudConfig implements CloudConfig {

    private readonly credentials: CredentialBody

    constructor() {
        const credentialFile = Environment.getProperty('pubSubCredential')
        this.credentials = require(credentialFile)
    }

    getConfig(): GoogleCloudConfig {
        return this
    }

    getCredentials(): CredentialBody {
        return this.credentials
    }
}