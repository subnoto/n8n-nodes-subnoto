import type { IDataObject } from "n8n-workflow";

export function mapRecipients(recipientsCollection: { recipient?: IDataObject[] }): IDataObject[] {
    const recipientList = recipientsCollection?.recipient ?? [];
    return recipientList.map((r: IDataObject) => {
        const recipient: IDataObject = {
            type: "manual",
            email: r.email,
            firstname: r.firstname ?? "",
            lastname: r.lastname ?? "",
        };
        if (r.label) {
            recipient.label = r.label;
        }
        return recipient;
    });
}
