import type { INodeProperties } from "n8n-workflow";
import {
    blockCollection,
    pageField,
    recipientCollection,
    workspaceUuidField,
} from "./shared.description";

export const envelopeOperations: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        displayOptions: {
            show: { resource: ["envelope"] },
        },
        options: [
            {
                name: "Add Blocks",
                value: "addBlocks",
                description: "Add signature or text blocks to a document",
                action: "Add blocks",
            },
            {
                name: "Add Recipients",
                value: "addRecipients",
                description: "Add recipients to an envelope",
                action: "Add recipients",
            },
            {
                name: "Create From Template",
                value: "createFromTemplate",
                description: "Create an envelope from a template",
                action: "Create envelope from template",
            },
            {
                name: "Delete",
                value: "delete",
                description: "Delete an envelope",
                action: "Delete an envelope",
            },
            {
                name: "Get",
                value: "get",
                description: "Get an envelope by UUID",
                action: "Get an envelope",
            },
            {
                name: "List",
                value: "list",
                description: "List envelopes in a workspace",
                action: "List envelopes",
            },
            {
                name: "Send",
                value: "send",
                description: "Send the envelope",
                action: "Send envelope",
            },
            {
                name: "Update",
                value: "update",
                description: "Update envelope settings",
                action: "Update an envelope",
            },
            {
                name: "Upload Document",
                value: "uploadDocument",
                description: "Upload a document and create an envelope",
                action: "Upload a document",
            },
            {
                name: "Upload Document and Send",
                value: "uploadDocumentAndSend",
                description:
                    "Upload a document, add recipients and optional blocks, then send in one step",
                action: "Upload document and send",
            },
        ],
        default: "uploadDocument",
        noDataExpression: true,
    },
];

const envelopeOpsWithWorkspace = [
    "uploadDocument",
    "uploadDocumentAndSend",
    "createFromTemplate",
    "addRecipients",
    "addBlocks",
    "send",
    "list",
    "get",
    "update",
    "delete",
];

export const envelopeFields: INodeProperties[] = [
    workspaceUuidField({
        show: { resource: ["envelope"], operation: envelopeOpsWithWorkspace },
    }),
    {
        displayName: "Envelope Title",
        name: "envelopeTitle",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
            show: {
                resource: ["envelope"],
                operation: ["uploadDocument", "uploadDocumentAndSend"],
            },
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
            show: {
                resource: ["envelope"],
                operation: ["uploadDocument", "uploadDocumentAndSend"],
            },
        },
        placeholder: "data",
        description: "Name of the binary property containing the PDF or Word document",
    },
    {
        displayName: "Template UUID",
        name: "templateUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
            show: { resource: ["envelope"], operation: ["createFromTemplate"] },
        },
    },
    {
        displayName: "Envelope UUID",
        name: "envelopeUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
            show: {
                resource: ["envelope"],
                operation: ["addRecipients", "addBlocks", "send", "get", "update", "delete"],
            },
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
        ...recipientCollection,
        displayOptions: {
            show: {
                resource: ["envelope"],
                operation: ["addRecipients", "createFromTemplate", "uploadDocumentAndSend"],
            },
        },
    },
    {
        ...blockCollection,
        required: true,
        displayOptions: {
            show: { resource: ["envelope"], operation: ["addBlocks"] },
        },
    },
    {
        ...blockCollection,
        displayOptions: {
            show: { resource: ["envelope"], operation: ["uploadDocumentAndSend"] },
        },
    },
    pageField({
        show: { resource: ["envelope"], operation: ["list"] },
    }),
    {
        displayName: "Tags",
        name: "tags",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["envelope"], operation: ["list", "update"] },
        },
        placeholder: "tag1, tag2",
        description: "Comma-separated tag names",
    },
    {
        displayName: "Status",
        name: "status",
        type: "multiOptions",
        options: [
            { name: "Approving", value: "approving" },
            { name: "Canceled", value: "canceled" },
            { name: "Complete", value: "complete" },
            { name: "Declined", value: "declined" },
            { name: "Draft", value: "draft" },
            { name: "Expired", value: "expired" },
            { name: "Signing", value: "signing" },
            { name: "Uploading", value: "uploading" },
        ],
        default: [],
        displayOptions: {
            show: { resource: ["envelope"], operation: ["list"] },
        },
        description: "Filter envelopes by status",
    },
    {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["envelope"], operation: ["update"] },
        },
        description: "New title for the envelope",
    },
    {
        displayName: "Expiration Period (Days)",
        name: "expirationPeriod",
        type: "number",
        default: 0,
        typeOptions: { minValue: 0, maxValue: 90 },
        displayOptions: {
            show: { resource: ["envelope"], operation: ["update"] },
        },
        description: "Days until invitation link expires (1-90). Leave 0 to skip.",
    },
    {
        displayName: "Reminder Frequency (Days)",
        name: "reminderFrequencyPeriod",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["envelope"], operation: ["update"] },
        },
        description: "Days between reminders. Leave empty to skip, or enter null to disable.",
    },
    {
        displayName: "Signature Order",
        name: "signatureOrder",
        type: "boolean",
        default: false,
        displayOptions: {
            show: { resource: ["envelope"], operation: ["update"] },
        },
    },
    {
        displayName: "Use User as Sender Name",
        name: "useUserAsSenderName",
        type: "boolean",
        default: false,
        displayOptions: {
            show: { resource: ["envelope"], operation: ["update"] },
        },
    },
    {
        displayName: "Custom Invitation Message",
        name: "customInvitationMessage",
        type: "string",
        default: "",
        displayOptions: {
            show: {
                resource: ["envelope"],
                operation: ["send", "update", "uploadDocumentAndSend"],
            },
        },
        description: "Optional message included in the invitation email",
    },
];
