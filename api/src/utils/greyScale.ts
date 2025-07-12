import fetch from "node-fetch";
import sharp from 'sharp';

export async function bufferedImage(ImageUrl:string):Promise<Buffer> {
        const response =  await fetch(ImageUrl);
        if(!response.ok){
            throw new Error(`Failed to Fectch Image From Cloudinary ${ImageUrl}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        return await sharp(imageBuffer).greyscale().toBuffer();
}