// S3 client for the Railway bucket. Objects are private; the public site
// never sees a bucket URL; app/media/[...key]/route.js proxies every read.

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

let client = null;

const s3 = () => {
  if (!client) {
    client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }
  return client;
};

const bucket = () => process.env.S3_BUCKET;

export async function putObject(key, body, contentType) {
  await s3().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function deleteObject(key) {
  await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}

// Returns { body, contentType, contentLength } or null when the key does not
// exist. `body` is the SDK stream; callers turn it into a web stream with
// body.transformToWebStream().
export async function getObjectStream(key) {
  try {
    const res = await s3().send(
      new GetObjectCommand({ Bucket: bucket(), Key: key })
    );
    return {
      body: res.Body,
      contentType: res.ContentType || 'application/octet-stream',
      contentLength: res.ContentLength ?? null,
    };
  } catch (err) {
    if (
      err?.name === 'NoSuchKey' ||
      err?.name === 'NotFound' ||
      err?.$metadata?.httpStatusCode === 404
    ) {
      return null;
    }
    throw err;
  }
}
