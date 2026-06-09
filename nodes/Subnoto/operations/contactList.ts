import type { IDataObject, IExecuteFunctions } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";
import { callSubnotoPost } from "../helpers/callSubnotoPost";
import { getOptionalWorkspaceUuid, withOptionalWorkspace } from "../helpers/workspaceBody";

export async function executeContactList(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
): Promise<IDataObject[]> {
    const workspaceUuid = getOptionalWorkspaceUuid(this, i);
    const page = this.getNodeParameter("page", i, 1) as number;

    const data = await callSubnotoPost(this, client, "/public/contact/list", {
        body: withOptionalWorkspace({ page }, workspaceUuid),
    });
    const contacts = (data as { contacts?: IDataObject[] }).contacts ?? [];
    return contacts.map((c) => c as IDataObject);
}
