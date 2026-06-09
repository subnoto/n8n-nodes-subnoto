import type { IDataObject, IExecuteFunctions } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";

export async function executeWorkspaceList(
    executeFunctions: IExecuteFunctions,
    client: SubnotoClient,
): Promise<IDataObject[]> {
    const data = await callSubnotoPost(executeFunctions, client, "/public/workspace/list", {
        body: {},
    });
    const workspaces = (data as { workspaces?: IDataObject[] }).workspaces ?? [];
    return workspaces.map((w) => w as IDataObject);
}
