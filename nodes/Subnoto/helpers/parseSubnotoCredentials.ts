import type { ICredentialDataDecryptedObject } from "n8n-workflow";

const HEX_SECRET_KEY_PATTERN = /^[0-9a-fA-F]+$/;
const DEFAULT_API_BASE_URL = "https://enclave.subnoto.com";

export interface ParsedSubnotoCredentials {
    apiBaseUrl: string;
    accessKey: string;
    secretKey: string;
    unattested: boolean;
}

export function parseSubnotoCredentials(
    credentials: ICredentialDataDecryptedObject,
): ParsedSubnotoCredentials {
    const apiBaseUrl = (
        (credentials.apiBaseUrl as string | undefined)?.trim() || DEFAULT_API_BASE_URL
    ).replace(/\/+$/, "");
    const accessKey = (credentials.accessKey as string | undefined)?.trim() ?? "";
    const secretKey = (credentials.secretKey as string | undefined)?.trim() ?? "";

    if (!accessKey) {
        throw new Error("Access key is required");
    }
    if (!secretKey) {
        throw new Error("Secret key is required");
    }
    if (!HEX_SECRET_KEY_PATTERN.test(secretKey)) {
        throw new Error(
            "Secret key must be hex-encoded (characters 0-9 and a-f only, with no spaces or prefixes)",
        );
    }

    return {
        apiBaseUrl,
        accessKey,
        secretKey,
        unattested: (credentials.unattested as boolean) ?? false,
    };
}
