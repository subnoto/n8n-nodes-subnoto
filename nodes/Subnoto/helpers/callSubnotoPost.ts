import type { IExecuteFunctions } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { getErrorMessage } from "@subnoto/api-client";

type PostPath = Parameters<SubnotoClient["POST"]>[0];
type PostOptions = Parameters<SubnotoClient["POST"]>[1];

export async function callSubnotoPost(
    executeFunctions: IExecuteFunctions,
    client: SubnotoClient,
    path: PostPath,
    options: { body: Record<string, unknown> },
): Promise<NonNullable<Awaited<ReturnType<SubnotoClient["POST"]>>["data"]>> {
    const response = await client.POST(path, options as unknown as PostOptions);
    if (response.error) {
        throw new NodeOperationError(executeFunctions.getNode(), getErrorMessage(response.error));
    }
    return response.data as NonNullable<typeof response.data>;
}

export function wrapSubnotoError(
    executeFunctions: IExecuteFunctions,
    error: unknown,
): NodeOperationError {
    if (error instanceof NodeOperationError) {
        return error;
    }
    const message = error instanceof Error ? error.message : String(error);
    return new NodeOperationError(executeFunctions.getNode(), message);
}
