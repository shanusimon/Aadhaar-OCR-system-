import { Router } from "express";
import {
  deleteData,
  getAadharList,
  ocrController,
  saveDate,
} from "../controllers/ocrControllers";

const router = Router();

router.post("/extract-data", ocrController);
router.post("/save-data", saveDate);
router.get("/aadhar-list", getAadharList);
router.delete("/delete-data", deleteData);

export default router;
