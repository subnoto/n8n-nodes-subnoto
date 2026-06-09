import type { ICredentialTestRequest, ICredentialType, INodeProperties } from "n8n-workflow";

export class SubnotoApi implements ICredentialType {
    name = "subnotoApi";

    displayName = "Subnoto API";

    icon = "file:icons/Subnoto.svg" as const;

    documentationUrl = "https://subnoto.com/documentation/developers/sdks/typescript";

    // Links this credential to the Subnoto node, which runs the SDK-based test via testedBy.
    supportedNodes = ["subnoto"];

    // Required for the Test button in the credentials UI. The actual test is executed by
    // Subnoto.methods.credentialTest.subnotoApiTest (whoami via the SDK), not this HTTP request.
    test: ICredentialTestRequest = {
        request: {
            baseURL: "={{$credentials.apiBaseUrl}}",
            url: "/public/utils/whoami",
            method: "POST",
            body: {},
        },
    };

    properties: INodeProperties[] = [
        {
            displayName: "API Base URL",
            name: "apiBaseUrl",
            type: "string",
            default: "https://enclave.subnoto.com",
            required: true,
            description: "Subnoto API base URL",
        },
        {
            displayName: "Access Key",
            name: "accessKey",
            type: "string",
            default: "",
            required: true,
            description: "API access key",
        },
        {
            displayName: "Secret Key",
            name: "secretKey",
            type: "string",
            typeOptions: { password: true },
            default: "",
            required: true,
            description: "API secret key",
        },
        {
            displayName: "Unattested Mode",
            name: "unattested",
            type: "boolean",
            default: false,
            description: "Use unattested mode (default: false)",
        },
    ];
}
