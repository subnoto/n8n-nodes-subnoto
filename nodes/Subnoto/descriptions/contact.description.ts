import type { INodeProperties } from "n8n-workflow";
import { languageOptions, pageField, workspaceUuidField } from "./shared.description";

export const contactOperations: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        displayOptions: {
            show: { resource: ["contact"] },
        },
        options: [
            {
                name: "Create",
                value: "create",
                description: "Create contacts in a workspace",
                action: "Create contacts",
            },
            {
                name: "Delete",
                value: "delete",
                description: "Delete contacts by email",
                action: "Delete contacts",
            },
            {
                name: "Get",
                value: "get",
                description: "Get a contact by email",
                action: "Get a contact",
            },
            {
                name: "List",
                value: "list",
                description: "List contacts in a workspace",
                action: "List contacts",
            },
            {
                name: "Update",
                value: "update",
                description: "Update a contact",
                action: "Update a contact",
            },
        ],
        default: "list",
        noDataExpression: true,
    },
];

const contactOpsWithWorkspace = ["create", "get", "list", "update", "delete"];

const contactValueFields: INodeProperties[] = [
    {
        displayName: "Address Line 1",
        name: "addressLine1",
        type: "string",
        default: "",
    },
    {
        displayName: "Address Line 2",
        name: "addressLine2",
        type: "string",
        default: "",
    },
    {
        displayName: "City",
        name: "city",
        type: "string",
        default: "",
    },
    {
        displayName: "Company",
        name: "company",
        type: "string",
        default: "",
    },
    {
        displayName: "Country",
        name: "country",
        type: "string",
        default: "",
    },
    {
        displayName: "Email",
        name: "email",
        type: "string",
        placeholder: "name@email.com",
        default: "",
        required: true,
    },
    {
        displayName: "First Name",
        name: "firstname",
        type: "string",
        default: "",
        required: true,
    },
    {
        displayName: "Job Title",
        name: "jobTitle",
        type: "string",
        default: "",
    },
    {
        displayName: "Language",
        name: "language",
        type: "options",
        options: languageOptions,
        default: "en",
    },
    {
        displayName: "Last Name",
        name: "lastname",
        type: "string",
        default: "",
        required: true,
    },
    {
        displayName: "Phone",
        name: "phone",
        type: "string",
        default: "",
    },
    {
        displayName: "Zip Code",
        name: "zipCode",
        type: "string",
        default: "",
    },
];

export const contactFields: INodeProperties[] = [
    workspaceUuidField({
        show: { resource: ["contact"], operation: contactOpsWithWorkspace },
    }),
    pageField({
        show: { resource: ["contact"], operation: ["list"] },
    }),
    {
        displayName: "Contacts",
        name: "contacts",
        type: "fixedCollection",
        typeOptions: { multipleValues: true },
        default: {},
        required: true,
        displayOptions: {
            show: { resource: ["contact"], operation: ["create"] },
        },
        options: [
            {
                name: "contact",
                displayName: "Contact",
                values: contactValueFields,
            },
        ],
    },
    {
        displayName: "Email",
        name: "email",
        type: "string",
        placeholder: "name@email.com",
        default: "",
        required: true,
        displayOptions: {
            show: { resource: ["contact"], operation: ["get", "update"] },
        },
    },
    {
        displayName: "Emails",
        name: "emails",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
            show: { resource: ["contact"], operation: ["delete"] },
        },
        placeholder: "email1@example.com, email2@example.com",
        description: "Comma-separated email addresses of contacts to delete",
    },
    {
        displayName: "First Name",
        name: "firstname",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Last Name",
        name: "lastname",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Phone",
        name: "phone",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Language",
        name: "language",
        type: "options",
        options: languageOptions,
        default: "en",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Job Title",
        name: "jobTitle",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Company",
        name: "company",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Address Line 1",
        name: "addressLine1",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Address Line 2",
        name: "addressLine2",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Zip Code",
        name: "zipCode",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "City",
        name: "city",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
    {
        displayName: "Country",
        name: "country",
        type: "string",
        default: "",
        displayOptions: {
            show: { resource: ["contact"], operation: ["update"] },
        },
    },
];
