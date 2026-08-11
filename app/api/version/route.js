// Which build is serving. The console polls this and offers a reload when
// the answer changes - Railway stamps every deploy with the commit sha; the
// process start time is the fallback so the endpoint never lies twice.

export const dynamic = 'force-dynamic';

const FALLBACK = `boot-${Date.now()}`;

export async function GET() {
  return Response.json({
    version: process.env.RAILWAY_GIT_COMMIT_SHA || FALLBACK
  });
}
