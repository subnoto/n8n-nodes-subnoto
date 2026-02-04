import {
    NodeConnectionTypes,
    type IDataObject,
    type IExecuteFunctions,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
} from "n8n-workflow";
import { SubnotoClient } from "@subnoto/api-client";

export class Subnoto implements INodeType {
    description: INodeTypeDescription = {
        displayName: "Subnoto",
        name: "subnoto",
        icon: "file:Subnoto.svg",
        group: ["transform"],
        version: 1,
        description: "Upload documents, add recipients and signature blocks, send envelopes via Subnoto",
        defaults: {
            name: "Subnoto",
        },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: "subnotoApi",
                required: true,
            },
        ],
        properties: [
            {
                displayName: "Resource",
                name: "resource",
                type: "options",
                options: [
                    {
                        name: "Envelope",
                        value: "envelope",
                    },
                    {
                        name: "Workspace",
                        value: "workspace",
                    },
                ],
                default: "envelope",
                noDataExpression: true,
                required: true,
            },
            {
                displayName: "Operation",
                name: "operation",
                type: "options",
                displayOptions: {
                    show: { resource: ["envelope"] },
                },
                options: [
                    {
                        name: "Upload Document",
                        value: "uploadDocument",
                        description: "Upload a document and create an envelope",
                        action: "Upload a document",
                    },
                    {
                        name: "Add Recipients",
                        value: "addRecipients",
                        description: "Add recipients to an envelope",
                        action: "Add recipients",
                    },
                    {
                        name: "Add Blocks",
                        value: "addBlocks",
                        description: "Add signature blocks to a document",
                        action: "Add signature blocks",
                    },
                    {
                        name: "Send",
                        value: "send",
                        description: "Send the envelope",
                        action: "Send envelope",
                    },
                ],
                default: "uploadDocument",
                noDataExpression: true,
            },
            {
                displayName: "Operation",
                name: "operation",
                type: "options",
                displayOptions: {
                    show: { resource: ["workspace"] },
                },
                options: [
                    {
                        name: "List",
                        value: "list",
                        description: "List all workspaces the API key owner is a member of",
                        action: "List workspaces",
                    },
                ],
                default: "list",
                noDataExpression: true,
            },
            // Upload Document
            {
                displayName: "Workspace UUID",
                name: "workspaceUuid",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["uploadDocument"] },
                },
                description: "Workspace where the envelope will be created",
            },
            {
                displayName: "Envelope Title",
                name: "envelopeTitle",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["uploadDocument"] },
                },
                description: "Title of the envelope",
            },
            {
                displayName: "Binary Property",
                name: "binaryPropertyName",
                type: "string",
                default: "data",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["uploadDocument"] },
                },
                placeholder: "data",
                description: "Name of the binary property containing the PDF or Word document",
            },
            // Add Recipients
            {
                displayName: "Workspace UUID",
                name: "workspaceUuid",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["addRecipients"] },
                },
            },
            {
                displayName: "Envelope UUID",
                name: "envelopeUuid",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["addRecipients"] },
                },
            },
            {
                displayName: "Recipients",
                name: "recipients",
                type: "fixedCollection",
                typeOptions: {
                    multipleValues: true,
                },
                default: {},
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["addRecipients"] },
                },
                options: [
                    {
                        name: "recipient",
                        displayName: "Recipient",
                        values: [
                            {
                                displayName: "Email",
                                name: "email",
                                type: "string",
                                default: "",
                                placeholder: "email@example.com",
                                required: true,
                            },
                            {
                                displayName: "First Name",
                                name: "firstname",
                                type: "string",
                                default: "",
                            },
                            {
                                displayName: "Last Name",
                                name: "lastname",
                                type: "string",
                                default: "",
                            },
                            {
                                displayName: "Label",
                                name: "label",
                                type: "string",
                                default: "",
                                description: "Optional label matching template recipient (e.g. signer, customer)",
                            },
                        ],
                    },
                ],
            },
            // Add Blocks
            {
                displayName: "Workspace UUID",
                name: "workspaceUuid",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["addBlocks"] },
                },
            },
            {
                displayName: "Envelope UUID",
                name: "envelopeUuid",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["addBlocks"] },
                },
            },
            {
                displayName: "Document UUID",
                name: "documentUuid",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["addBlocks"] },
                },
            },
            {
                displayName: "Blocks",
                name: "blocks",
                type: "fixedCollection",
                typeOptions: {
                    multipleValues: true,
                },
                default: {},
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["addBlocks"] },
                },
                options: [
                    {
                        name: "block",
                        displayName: "Block",
                        values: [
                            {
                                displayName: "Type",
                                name: "type",
                                type: "options",
                                options: [{ name: "Signature", value: "signature" }],
                                default: "signature",
                            },
                            {
                                displayName: "Page",
                                name: "page",
                                type: "string",
                                default: "1",
                                description: "Page number (e.g. 1)",
                            },
                            {
                                displayName: "X",
                                name: "x",
                                type: "number",
                                default: 100,
                                description: "X position in points",
                            },
                            {
                                displayName: "Y",
                                name: "y",
                                type: "number",
                                default: 200,
                                description: "Y position in points",
                            },
                            {
                                displayName: "Recipient Email",
                                name: "recipientEmail",
                                type: "string",
                                default: "",
                                placeholder: "email@example.com",
                                required: true,
                            },
                        ],
                    },
                ],
            },
            // Send
            {
                displayName: "Workspace UUID",
                name: "workspaceUuid",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["send"] },
                },
            },
            {
                displayName: "Envelope UUID",
                name: "envelopeUuid",
                type: "string",
                default: "",
                required: true,
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["send"] },
                },
            },
            {
                displayName: "Custom Invitation Message",
                name: "customInvitationMessage",
                type: "string",
                default: "",
                displayOptions: {
                    show: { resource: ["envelope"], operation: ["send"] },
                },
                description: "Optional message included in the invitation email",
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const credentials = await this.getCredentials("subnotoApi");
        if (!credentials?.apiBaseUrl || !credentials?.accessKey || !credentials?.secretKey) {
            throw new Error("Subnoto API credentials (apiBaseUrl, accessKey, secretKey) are required");
        }

        const client = new SubnotoClient({
            apiBaseUrl: credentials.apiBaseUrl as string,
            accessKey: credentials.accessKey as string,
            secretKey: credentials.secretKey as string,
            unattested: (credentials.unattested as boolean) ?? false,
        });

        const resource = this.getNodeParameter("resource", 0) as string;
        const operation = this.getNodeParameter("operation", 0) as string;
        const items = this.getInputData();
        const returnData: IDataObject[] = [];

        if (resource === "workspace" && operation === "list" && items.length === 0) {
            const response = await client.POST("/public/workspace/list", { body: {} });
            const workspaces =
                (response.data as { workspaces?: IDataObject[] } | undefined)?.workspaces ?? [];
            for (const w of workspaces) {
                returnData.push(w as IDataObject);
            }
            return [this.helpers.returnJsonArray(returnData)];
        }

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === "workspace") {
                    if (operation === "list") {
                        if (i === 0) {
                            const response = await client.POST("/public/workspace/list", {
                                body: {},
                            });
                            const workspaces =
                                (response.data as { workspaces?: IDataObject[] } | undefined)?.workspaces ?? [];
                            for (const w of workspaces) {
                                returnData.push(w as IDataObject);
                            }
                        }
                        continue;
                    }
                } else if (resource === "envelope") {
                    if (operation === "uploadDocument") {
                        const workspaceUuid = this.getNodeParameter("workspaceUuid", i) as string;
                        const envelopeTitle = this.getNodeParameter("envelopeTitle", i) as string;
                        const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i) as string;

                        this.helpers.assertBinaryData(i, binaryPropertyName);
                        const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                        if (!fileBuffer) {
                            throw new Error(`No binary data found for property "${binaryPropertyName}"`);
                        }

                        const result = await client.uploadDocument({
                            workspaceUuid,
                            fileBuffer,
                            envelopeTitle,
                        });

                        returnData.push({
                            ...(items[i].json as IDataObject),
                            envelopeUuid: result.envelopeUuid,
                            documentUuid: result.documentUuid,
                        });
                    } else if (operation === "addRecipients") {
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

                        returnData.push({
                            envelopeUuid,
                            success: true,
                            json: items[i].json,
                        });
                    } else if (operation === "addBlocks") {
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

                        returnData.push({
                            envelopeUuid,
                            documentUuid,
                            success: true,
                            json: items[i].json,
                        });
                    } else if (operation === "send") {
                        const workspaceUuid = this.getNodeParameter("workspaceUuid", i) as string;
                        const envelopeUuid = this.getNodeParameter("envelopeUuid", i) as string;
                        const customInvitationMessage = this.getNodeParameter("customInvitationMessage", i) as string;

                        await client.POST("/public/envelope/send", {
                            body: {
                                workspaceUuid,
                                envelopeUuid,
                                ...(customInvitationMessage ? { customInvitationMessage } : {}),
                            },
                        });

                        returnData.push({
                            envelopeUuid,
                            success: true,
                            json: items[i].json,
                        });
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { ...items[i].json, error: (error as Error).message },
                        error: (error as Error).message,
                    });
                } else {
                    throw error;
                }
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
