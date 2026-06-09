import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";
import { getOptionalWorkspaceUuid, withOptionalWorkspace } from "../helpers/workspaceBody";

export async function executeContactDelete(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const emailsRaw = this.getNodeParameter("emails", i) as string;
    const emails = emailsRaw
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

    await callSubnotoPost(this, client, "/public/contact/delete", {
        body: withOptionalWorkspace({ emails }, workspaceUuid),
    });

    return {
        emails,
        success: true,
        json: items[i].json,
    };
}
