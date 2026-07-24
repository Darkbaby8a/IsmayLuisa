import Busboy from "busboy";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método no permitido",
    };
  }

  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: event.headers,
    });

    const buffers = [];

    busboy.on("file", (name, file) => {
      file.on("data", (data) => {
        buffers.push(data);
      });
    });

    busboy.on("finish", async () => {
      try {
        const buffer = Buffer.concat(buffers);

        const resultado = await new Promise((ok, error) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "boda",
              },
              (err, result) => {
                if (err) return error(err);

                ok(result);
              },
            )
            .end(buffer);
        });

        resolve({
          statusCode: 200,

          body: JSON.stringify(resultado),
        });
      } catch (e) {
        resolve({
          statusCode: 500,

          body: JSON.stringify(e),
        });
      }
    });

    busboy.end(Buffer.from(event.body, "base64"));
  });
}
