import { IncomingMessage, ServerResponse } from "http"
import { cacheResponse, getResponseFromCache } from "./cache.js"
import { ResponseData } from "./types"

export async function handleRequest(
   req: IncomingMessage,
   res: ServerResponse,
   meta: {
      origin: string
   }
) {
   const method = req.method

   const path = req.url

   console.log("Received request", method, path)

   const cachedResponse = getResponseFromCache(method, path)

   let responseToReturn = cachedResponse

   if (!cachedResponse) {
      const response = await handleOriginRequest(method, meta.origin, path)

      cacheResponse(response, {
         path,
         requestMethod: method
      })

      responseToReturn = response
   }

   res.writeHead(responseToReturn.status, responseToReturn.statusText, {
      "content-type": responseToReturn.headers["content-type"],
      "X-Cache": cachedResponse ? "HIT" : "MISS"
   }).end(JSON.stringify(responseToReturn.body))
}

export async function handleOriginRequest(method: Request["method"], origin: string, path: string): Promise<ResponseData> {
   const response = await fetch(origin + path, { method })

   return {
      body: await response.text(),
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: response.url
   }
}
