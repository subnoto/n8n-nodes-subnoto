import type { IExecuteFunctions } from "n8n-workflow";

export function getOptionalWorkspaceUuid(
    executeFunctions: IExecuteFunctions,
    itemIndex: number,
): string | undefined {
    const value = executeFunctions.getNodeParameter("workspaceUuid", itemIndex, "") as string;
    const trimmed = value?.trim();
    return trimmed || undefined;
}

export function withOptionalWorkspace<T extends Record<string, unknown>>(
    body: T,
    workspaceUuid?: string,
): T {
    if (workspaceUuid) {
        return { ...body, workspaceUuid };
    }
    return body;
}
