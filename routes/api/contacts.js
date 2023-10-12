import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import authenticate from "../../middlewares/authenticate.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import isValidId from "../../middlewares/isValidId.js";
import validateBody from "../../decorators/validateBody.js";
import {
  contactAddSchema,
  contactUpdateFavoriteSchema,
  contactUpdateSchema,
} from "../../models/contacts.js";

const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateFavorite = validateBody(contactUpdateFavoriteSchema);
const contactUpdateBody = validateBody(contactUpdateSchema);

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", isValidId, contactsController.getById);

contactsRouter.post(
  "/",
  isEmptyBody,
  contactAddValidate,
  contactsController.add
);

contactsRouter.delete("/:contactId", isValidId, contactsController.removeById);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  contactUpdateBody,
  contactsController.updateById
);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  contactUpdateFavorite,
  contactsController.updateById
);

export default contactsRouter;
