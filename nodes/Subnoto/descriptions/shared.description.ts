import type { INodeProperties } from "n8n-workflow";

export const WORKSPACE_UUID_DESCRIPTION = "Leave empty to use the team default workspace";

export function workspaceUuidField(
    displayOptions: INodeProperties["displayOptions"],
): INodeProperties {
    return {
        displayName: "Workspace UUID",
        name: "workspaceUuid",
        type: "string",
        default: "",
        displayOptions,
        description: WORKSPACE_UUID_DESCRIPTION,
    };
}

export const recipientCollection: INodeProperties = {
    displayName: "Recipients",
    name: "recipients",
    type: "fixedCollection",
    typeOptions: {
        multipleValues: true,
    },
    default: {},
    required: true,
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
};

const blockOptionFields: INodeProperties[] = [
    {
        displayName: "Label",
        name: "label",
        type: "string",
        default: "",
        required: true,
    },
    {
        displayName: "Value",
        name: "value",
        type: "string",
        default: "",
        required: true,
    },
];

export const blockCollection: INodeProperties = {
    displayName: "Blocks",
    name: "blocks",
    type: "fixedCollection",
    typeOptions: {
        multipleValues: true,
    },
    default: {},
    options: [
        {
            name: "block",
            displayName: "Block",
            values: [
                {
                    displayName: "Default Value",
                    name: "defaultValue",
                    type: "string",
                    default: "",
                    displayOptions: {
                        show: {
                            type: ["date", "dropdown", "number", "radio", "text", "textInput"],
                        },
                    },
                },
                {
                    displayName: "Default Value",
                    name: "defaultValueBoolean",
                    type: "boolean",
                    default: false,
                    displayOptions: {
                        show: { type: ["checkbox"] },
                    },
                },
                {
                    displayName: "Height",
                    name: "height",
                    type: "number",
                    default: 0,
                    displayOptions: {
                        hide: { type: ["signature"] },
                    },
                },
                {
                    displayName: "Image File Type",
                    name: "fileType",
                    type: "string",
                    default: "image/png",
                    displayOptions: {
                        show: { type: ["image"] },
                    },
                },
                {
                    displayName: "Image Source (Base64)",
                    name: "src",
                    type: "string",
                    typeOptions: { rows: 4 },
                    default: "",
                    displayOptions: {
                        show: { type: ["image"] },
                    },
                },
                {
                    displayName: "Max",
                    name: "max",
                    type: "number",
                    default: 0,
                    displayOptions: {
                        show: { type: ["number"] },
                    },
                },
                {
                    displayName: "Max Length",
                    name: "maxLength",
                    type: "number",
                    default: 0,
                    displayOptions: {
                        show: { type: ["text", "textInput"] },
                    },
                },
                {
                    displayName: "Min",
                    name: "min",
                    type: "number",
                    default: 0,
                    displayOptions: {
                        show: { type: ["number"] },
                    },
                },
                {
                    displayName: "Options",
                    name: "options",
                    type: "fixedCollection",
                    typeOptions: { multipleValues: true },
                    default: {},
                    required: true,
                    displayOptions: {
                        show: { type: ["dropdown", "radio"] },
                    },
                    options: [
                        {
                            name: "option",
                            displayName: "Option",
                            values: blockOptionFields,
                        },
                    ],
                },
                {
                    displayName: "Page",
                    name: "page",
                    type: "string",
                    default: "1",
                    description: "Page number (e.g. 1)",
                },
                {
                    displayName: "Placeholder",
                    name: "placeholder",
                    type: "string",
                    default: "",
                    displayOptions: {
                        show: {
                            type: ["checkbox", "date", "dropdown", "number", "radio", "textInput"],
                        },
                    },
                },
                {
                    displayName: "Recipient Email",
                    name: "recipientEmail",
                    type: "string",
                    default: "",
                    placeholder: "email@example.com",
                },
                {
                    displayName: "Required",
                    name: "required",
                    type: "boolean",
                    default: false,
                },
                {
                    displayName: "Step",
                    name: "step",
                    type: "number",
                    default: 0,
                    displayOptions: {
                        show: { type: ["number"] },
                    },
                },
                {
                    displayName: "Templated Text",
                    name: "templatedText",
                    type: "options",
                    options: [
                        { name: "Email", value: "email" },
                        { name: "Full Name", value: "fullname" },
                        { name: "Phone", value: "phone" },
                    ],
                    default: "email",
                    displayOptions: {
                        show: { type: ["text"] },
                    },
                },
                {
                    displayName: "Text",
                    name: "text",
                    type: "string",
                    default: "",
                    displayOptions: {
                        show: { type: ["text", "textInput"] },
                    },
                },
                {
                    displayName: "Type",
                    name: "type",
                    type: "options",
                    options: [
                        { name: "Checkbox", value: "checkbox" },
                        { name: "Date", value: "date" },
                        { name: "Dropdown", value: "dropdown" },
                        { name: "Image", value: "image" },
                        { name: "Number", value: "number" },
                        { name: "Radio", value: "radio" },
                        { name: "Signature", value: "signature" },
                        { name: "Text", value: "text" },
                        { name: "Text Input", value: "textInput" },
                    ],
                    default: "signature",
                },
                {
                    displayName: "Width",
                    name: "width",
                    type: "number",
                    default: 0,
                    displayOptions: {
                        hide: { type: ["signature"] },
                    },
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
};

export const pageField = (displayOptions: INodeProperties["displayOptions"]): INodeProperties => ({
    displayName: "Page",
    name: "page",
    type: "number",
    default: 1,
    typeOptions: { minValue: 1 },
    displayOptions,
    description: "Page number (1-indexed, up to 50 results per page)",
});

export const languageOptions = [
    { name: "English", value: "en" },
    { name: "Finnish", value: "fi" },
    { name: "French", value: "fr" },
    { name: "Italian", value: "it" },
    { name: "Spanish", value: "es" },
];
