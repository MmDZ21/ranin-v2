import type { IncomingMessage, ServerResponse } from 'node:http';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { createApplication } from '../src/main';

let applicationPromise: Promise<NestExpressApplication> | undefined;

function getApplication() {
  applicationPromise ??= createApplication({
    enableShutdownHooks: false,
  }).then(async (app) => {
    await app.init();
    return app;
  });

  return applicationPromise;
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const app = await getApplication();
  const express = app.getHttpAdapter().getInstance() as (
    request: IncomingMessage,
    response: ServerResponse,
  ) => void;

  express(request, response);
}
