import { Request, Response } from "express";
import { bufferedImage } from "../utils/greyScale";
import { extractTextFromImages } from "../utils/ocrHelper";
import { AadharModel } from "../models/aadharModel";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../shared/constants";
import { AadharDataSchema } from "../shared/validate";
import { AadharData } from "../shared/validate";
import { extractAadhaarInfo } from "../utils/formatData";

export async function ocrController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("Hello");
    const frontImage = req.body.frontImage;
    const backImage = req.body.backImage;
    console.log(frontImage, backImage);
    if (!frontImage || !backImage) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.NO_FILE_UPLOADED,
      });
      return;
    }

    const frontBuffer = await bufferedImage(frontImage);
    const backBuffer = await bufferedImage(backImage);
    const { frontText, backText } = await extractTextFromImages(
      frontBuffer,
      backBuffer
    );
    const parsedData = extractAadhaarInfo(frontText, backText);

    res.status(HTTP_STATUS.OK).json({
      sucess: true,
      message: SUCCESS_MESSAGES.DATA_PARSED,
      parsedData
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.OCR_FAILED).json({
      success: false,
      message: ERROR_MESSAGES.OCR_FAILED,
    });
  }
}

export async function saveDate(req: Request, res: Response): Promise<void> {
  try {
    console.log("Hello Save Data");
    const { data } = req.body;
    console.log(data)
    const parsedResult = AadharDataSchema.safeParse(data);
    console.log(parsedResult)
    if (!parsedResult.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.MISSING_FIELDS,
      });
      return;
    }
    const aadharData: AadharData = parsedResult.data;

    await AadharModel.create(aadharData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_SAVED,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function getAadharList(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const aadharData = await AadharModel.find();

    if (!aadharData || aadharData.length === 0) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      aadharData,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function deleteData(req: Request, res: Response): Promise<void> {
  try {
    const id = req.query.id as string;
    if (!id) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.ID_NOT_PROVIDED,
      });
      return;
    }

    const aadhar = await AadharModel.findByIdAndDelete(id);
    if (!aadhar) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DOCUMENT_DELETED,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}
