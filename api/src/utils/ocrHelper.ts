import { createWorker, Worker } from "tesseract.js";

export async function extractTextFromImages(
  frontBuffer: Buffer,
  backBuffer: Buffer
): Promise<{ frontText: string; backText: string }> {
  const worker: Worker = await createWorker();

  try {
    await worker.reinitialize("eng");

    const frontTextResult = await worker.recognize(frontBuffer);
    const backTextResult = await worker.recognize(backBuffer);

    const frontText = frontTextResult.data.text;
    const backText = backTextResult.data.text;

    return { frontText, backText };
  } catch (error) {
    throw new Error("Failed to perform OCR on the Aadhaar images.");
  } finally {
    await worker.terminate();
  }
}
