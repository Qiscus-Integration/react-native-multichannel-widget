export const MessageType = {
    TEXT: "text",
    IMAGE: "image",
    ATTACHMENT: "file_attachment",
    LINK: "link",
    CUSTOM: "custom",
    PRODUCT: "product",
    SYSTEM_EVENT: "system_event",
    CARD: "card",
    REPLY: "reply",
    UNKNOWN: "unknown",
}
export let SupportImageType = ["png","jpg","jpeg"]

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};
