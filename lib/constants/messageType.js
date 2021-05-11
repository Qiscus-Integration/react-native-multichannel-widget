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
    TYPING: "typing",
    CAROUSEL: "carousel",
    POSTBACK_TEXT: "postback_text",
    BUTTON_POSTBACK_RESPONSE: "button_postback_response",
    BUTTON: "buttons",
    SYSTEM_EVENT_SEQUENCE_QUEUE: "sequence_queue",

}
export let SupportImageType = ["png","jpg","jpeg"]
export let SupportVideoType = ["mp4"]

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};
