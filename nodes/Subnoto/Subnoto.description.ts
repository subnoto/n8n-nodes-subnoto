/* eslint-disable n8n-nodes-base/node-filename-against-convention -- description in separate file by design */
import { NodeConnectionTypes, type INodeTypeDescription } from "n8n-workflow";

export const subnotoDescription: INodeTypeDescription = {
    displayName: "Subnoto",
    name: "subnoto",
    icon: "file:Subnoto.svg",
    group: ["transform"],
    version: 1,
    description:
        "Upload documents, add recipients and signature blocks, send envelopes via Subnoto",
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
                            description:
                                "Optional label matching template recipient (e.g. signer, customer)",
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
                            displayName: "Page",
                            name: "page",
                            type: "string",
                            default: "1",
                            description: "Page number (e.g. 1)",
                        },
                        {
                            displayName: "Recipient Email",
                            name: "recipientEmail",
                            type: "string",
                            default: "",
                            placeholder: "email@example.com",
                            required: true,
                        },
                        {
                            displayName: "Type",
                            name: "type",
                            type: "options",
                            options: [{ name: "Signature", value: "signature" }],
                            default: "signature",
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
