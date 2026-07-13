import type { ICredentialType, INodeProperties } from "n8n-workflow";

/* eslint-disable @n8n/community-nodes/credential-test-required -- testedBy: subnotoApiTest is set on the Subnoto node credentials in Subnoto.description.ts */
export class SubnotoApi implements ICredentialType {
    name = "subnotoApi";

    displayName = "Subnoto API";

    icon = "file:icons/Subnoto.svg" as const;

    documentationUrl = "https://subnoto.com/documentation/developers/sdks/typescript";

    // Links this credential to the Subnoto node, which runs the SDK-based test via testedBy.
    supportedNodes = ["subnoto"];

    properties: INodeProperties[] = [
        {
            displayName: "API Base URL",
            name: "apiBaseUrl",
            type: "string",
            default: "https://enclave.subnoto.com",
            required: true,
            description:
                'Subnoto enclave URL (e.g. "https://enclave.subnoto.com"). Do not include a trailing slash.',
        },
        {
            displayName: "Access Key",
            name: "accessKey",
            type: "string",
            default: "",
            required: true,
            description: "API access key from your Subnoto workspace settings",
        },
        {
            displayName: "Secret Key",
            name: "secretKey",
            type: "string",
            typeOptions: { password: true },
            default: "",
            required: true,
            description:
                "API secret key as shown in Subnoto (hex-encoded: characters 0-9 and a-f only). Copy it exactly, with no spaces or line breaks.",
        },
        {
            displayName: "Unattested Mode",
            name: "unattested",
            type: "boolean",
            default: false,
            description:
                "Whether to skip remote attestation during the Oak tunnel handshake. Leave disabled unless Subnoto support advises otherwise.",
        },
    ];
}
