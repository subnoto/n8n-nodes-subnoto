import { SubnotoClient } from "@subnoto/api-client";
import type { ICredentialDataDecryptedObject } from "n8n-workflow";

export function createSubnotoClient(
    credentials: ICredentialDataDecryptedObject,
): SubnotoClient {
    return new SubnotoClient({
        apiBaseUrl: (credentials.apiBaseUrl as string) || "https://enclave.subnoto.com",
        accessKey: credentials.accessKey as string,
        secretKey: credentials.secretKey as string,
        unattested: (credentials.unattested as boolean) ?? false,
    });
}
