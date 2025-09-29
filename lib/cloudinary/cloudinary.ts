import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});
interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
    format?: string;
    // other fields you might need
}
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
    // file ko buffer me convert karna
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "avatars" }, // Cloudinary ke andar avatars folder
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload failed, no result returned"));
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                });
            }
        );

        uploadStream.end(buffer);
    });
}
