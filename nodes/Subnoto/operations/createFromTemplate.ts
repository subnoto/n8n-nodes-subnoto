import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";
import { mapRecipients } from "../helpers/mapRecipients";
import { getOptionalWorkspaceUuid, withOptionalWorkspace } from "../helpers/workspaceBody";

export async function executeCreateFromTemplate(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const templateUuid = this.getNodeParameter("templateUuid", i) as string;
    const recipientsCollection = this.getNodeParameter("recipients", i) as {
        recipient?: IDataObject[];
    };
    const recipients = mapRecipients(recipientsCollection);

    const data = await callSubnotoPost(this, client, "/public/envelope/create-from-template", {
        body: withOptionalWorkspace({ templateUuid, recipients }, workspaceUuid),
    });

    return {
        ...(items[i].json as IDataObject),
        ...(data as IDataObject),
    };
}
