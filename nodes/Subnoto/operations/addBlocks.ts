import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import type { SubnotoClient } from "@subnoto/api-client";

export async function executeAddBlocks(
    this: IExecuteFunctions,
    i: number,
    client: SubnotoClient,
    items: INodeExecutionData[],
): Promise<IDataObject> {
    const workspaceUuid = this.getNodeParameter("workspaceUuid", i) as string;
    const envelopeUuid = this.getNodeParameter("envelopeUuid", i) as string;
    const documentUuid = this.getNodeParameter("documentUuid", i) as string;
    const blocksCollection = this.getNodeParameter("blocks", i) as {
        block?: IDataObject[];
    };
    const blockList = blocksCollection?.block ?? [];
    const blocks = blockList.map(
        (b: IDataObject) =>
            ({
                type: b.type ?? "signature",
                page: String(b.page ?? "1"),
                x: Number(b.x ?? 100),
                y: Number(b.y ?? 200),
                recipientEmail: b.recipientEmail,
            }) as IDataObject,
    );

    await client.POST("/public/envelope/add-blocks", {
        body: {
            workspaceUuid,
            envelopeUuid,
            documentUuid,
            blocks: blocks as Parameters<SubnotoClient["POST"]> extends [
                { path: "/public/envelope/add-blocks"; body: infer B },
            ]
                ? B extends { blocks: infer R }
                    ? R
                    : never
                : never,
        },
    });

    return {
        envelopeUuid,
        documentUuid,
        success: true,
        json: items[i].json,
    };
}
