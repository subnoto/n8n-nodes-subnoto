import { SubnotoClient } from "@subnoto/api-client";
import type { ICredentialDataDecryptedObject } from "n8n-workflow";
import { parseSubnotoCredentials } from "./parseSubnotoCredentials";

export function createSubnotoClient(credentials: ICredentialDataDecryptedObject): SubnotoClient {
    const parsed = parseSubnotoCredentials(credentials);

    return new SubnotoClient({
        apiBaseUrl: parsed.apiBaseUrl,
        accessKey: parsed.accessKey,
        secretKey: parsed.secretKey,
        unattested: parsed.unattested,
    });
}
