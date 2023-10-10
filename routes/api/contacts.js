import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
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

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:contactId", isValidId, contactsController.getById);

router.post("/", isEmptyBody, contactAddValidate, contactsController.add);

router.delete("/:contactId", isValidId, contactsController.removeById);

router.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  contactUpdateBody,
  contactsController.updateById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  contactUpdateFavorite,
  contactsController.updateById
);

export default router;
