import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";

const f = createUploadthing();

export const ourFileRouter = {

    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .input(z.object({ configId: z.string().optional() }))
        .middleware(async ({ input }) => {
            return { input }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("onUploadComplete called");
            const { configId } = metadata.input;
            console.log(`configId: ${configId}`);
            const res = await fetch(file.url);
            console.log(`res: ${res}`);
            const buffer = await res.arrayBuffer();
            console.log(`buffer: ${buffer}`);
            const imgMetaData = await sharp(buffer).metadata();
            console.log(`imgMetaData: ${imgMetaData}`);
            const { width, height } = imgMetaData;
            if (!configId) {
                console.log("Starting new configuration");
                const configuration = await db.configuration.create({
                    data: {
                        imageUrl: file.url,
                        height: height || 500,
                        width: width || 500
                    }
                });
                console.log(`Created configuration: ${configuration}`);
                return { configId: configuration.id };
            }
            else {
                console.log("Updating existing configuration");
                const updatedConfiguration = await db.configuration.update({
                    where: {
                        id: configId
                    },
                    data: {
                        croppedImageUrl: file.url,
                    }
                });
                console.log(`Updated configuration: ${updatedConfiguration}`);
                return { configId: updatedConfiguration.id };
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
