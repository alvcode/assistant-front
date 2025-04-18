import indexRequest from "@/repositories/contact/requests/index-request.js";
import createRequest from "@/repositories/contact/requests/create-request.js";
import deleteRequest from "@/repositories/contact/requests/delete-request.js";
import updateRequest from "@/repositories/contact/requests/update-request.js";
import qrLinkPngRequest from "@/repositories/contact/requests/qr-link-png-request.js";
import qrVCardPngRequest from "@/repositories/contact/requests/qr-vcard-png-request.js";

const contactRepository = {
    index: indexRequest,
    create: createRequest,
    delete: deleteRequest,
    update: updateRequest,
    qrLinkPngRequest: qrLinkPngRequest,
    qrVCardPngRequest: qrVCardPngRequest,
};

export default contactRepository;