import type { IDataObject } from "n8n-workflow";

function mapBlockOptions(optionsCollection: { option?: IDataObject[] } | undefined): IDataObject[] {
    return (optionsCollection?.option ?? []).map((option) => ({
        label: option.label,
        value: option.value,
    }));
}

function applyCommonBlockFields(base: IDataObject, b: IDataObject): void {
    if (b.height !== undefined && b.height !== "" && Number(b.height) > 0) {
        base.height = Number(b.height);
    }
    if (b.width !== undefined && b.width !== "" && Number(b.width) > 0) {
        base.width = Number(b.width);
    }
    if (b.recipientEmail) {
        base.recipientEmail = b.recipientEmail;
    }
    if (b.required === true) {
        base.required = true;
    }
    if (b.placeholder) {
        base.placeholder = b.placeholder;
    }
}

function applyDefaultValue(base: IDataObject, b: IDataObject, type: string): void {
    if (type === "checkbox") {
        if (b.defaultValueBoolean !== undefined) {
            base.defaultValue = b.defaultValueBoolean as boolean;
        }
        return;
    }

    if (b.defaultValue === undefined || b.defaultValue === "") {
        return;
    }

    if (type === "number") {
        base.defaultValue = Number(b.defaultValue);
        return;
    }

    base.defaultValue = b.defaultValue;
}

export function mapBlocks(blocksCollection: { block?: IDataObject[] }): IDataObject[] {
    const blockList = blocksCollection?.block ?? [];
    return blockList.map((b: IDataObject) => {
        const type = (b.type as string) ?? "signature";
        const base: IDataObject = {
            type,
            page: String(b.page ?? "1"),
            x: Number(b.x ?? 100),
            y: Number(b.y ?? 200),
        };

        applyCommonBlockFields(base, b);
        applyDefaultValue(base, b, type);

        switch (type) {
            case "text":
                base.text = b.text ?? "";
                if (b.templatedText) {
                    base.templatedText = b.templatedText;
                }
                if (b.maxLength !== undefined && b.maxLength !== "" && Number(b.maxLength) > 0) {
                    base.maxLength = Number(b.maxLength);
                }
                break;
            case "textInput":
                if (b.text) {
                    base.text = b.text;
                }
                if (b.maxLength !== undefined && b.maxLength !== "" && Number(b.maxLength) > 0) {
                    base.maxLength = Number(b.maxLength);
                }
                break;
            case "image":
                base.src = b.src ?? "";
                base.fileType = b.fileType ?? "image/png";
                break;
            case "number":
                if (b.min !== undefined && b.min !== "") {
                    base.min = Number(b.min);
                }
                if (b.max !== undefined && b.max !== "") {
                    base.max = Number(b.max);
                }
                if (b.step !== undefined && b.step !== "") {
                    base.step = Number(b.step);
                }
                break;
            case "radio":
            case "dropdown": {
                const options = mapBlockOptions(b.options as { option?: IDataObject[] });
                if (options.length > 0) {
                    base.options = options;
                }
                break;
            }
            case "checkbox":
            case "date":
            case "signature":
                break;
            default:
                break;
        }

        return base;
    });
}
