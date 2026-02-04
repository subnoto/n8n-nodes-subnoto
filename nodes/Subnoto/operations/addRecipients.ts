import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";

export async function executeAddRecipients(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = this.getNodeParameter("workspaceUuid", i) as string;
    const envelopeUuid = this.getNodeParameter("envelopeUuid", i) as string;
    const recipientsCollection = this.getNodeParameter("recipients", i) as {
        recipient?: IDataObject[];
    };
    const recipientList = recipientsCollection?.recipient ?? [];
    const recipients = recipientList.map(
        (r: IDataObject) =>
            ({
                type: "manual",
                email: r.email,
                firstname: r.firstname ?? "",
                lastname: r.lastname ?? "",
                ...(r.label ? { label: r.label } : {}),
            }) as IDataObject,
    );

    await client.POST("/public/envelope/add-recipients", {
        body: {
            workspaceUuid,
            envelopeUuid,
            recipients: recipients as Parameters<SubnotoClient["POST"]> extends [
                { path: "/public/envelope/add-recipients"; body: infer B },
            ]
                ? B extends { recipients: infer R }
                    ? R
                    : never
                : never,
        },
    });

    return {
        envelopeUuid,
        success: true,
        json: items[i].json,
    };
}
