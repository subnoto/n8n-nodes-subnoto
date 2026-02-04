import type { IDataObject } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";

export async function executeWorkspaceList(client: SubnotoClient): Promise<IDataObject[]> {
    const response = await client.POST("/public/workspace/list", { body: {} });
    const workspaces =
        (response.data as { workspaces?: IDataObject[] } | undefined)?.workspaces ?? [];
    return workspaces.map((w) => w as IDataObject);
}
