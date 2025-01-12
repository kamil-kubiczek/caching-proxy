#!/usr/bin/env node
import { program } from "commander"
import { createServer } from "http"
import { handleRequest } from "./http.js"
import { clearCache, initializeCache } from "./cache.js"

export const proxyCli = program
   .version("0.0.1")
   .description("Simple caching proxy using in-memory cache and file-based storage. Only GET requests are cached.")
   .option("-p, --port <type>", "port to run on", null)
   .option("-o, --origin <type>", "origin to proxy", null)
   .option("--clear-cache", "use to clear cache")
   .action((options) => {
      validatePassedOptions(options)

      if (options.clearCache) {
         clearCache()
         console.log("Cache cleared. Removed cache file.")
         return
      }

      console.log(`Caching proxy started on localhost:${options.port} with origin ${options.origin}`)
      const server = createServer((req, res) => {
         handleRequest(req, res, {
            origin: options.origin
         })
      })

      initializeCache()
      server.listen(options.port)
   })

function validatePassedOptions(parsedArguments: any) {
   const validationErrors = []

   if (parsedArguments.clearCache) {
      return
   }

   if (!parsedArguments.origin) {
      validationErrors.push("Missing origin. Specify origin using -o | --origin")
   }

   if (parsedArguments.origin && typeof parsedArguments.origin !== "string") {
      validationErrors.push("-o | --origin --> must be string.")
   }

   if (!parsedArguments.port) {
      validationErrors.push("Missing port. Specify port using -p | --port")
   }

   if (parsedArguments.port && isNaN(Number(parsedArguments.port))) {
      validationErrors.push("-p | --port --> must be a number.")
   }

   if ((parsedArguments.port && Number(parsedArguments.port) < 0) || Number(parsedArguments.port) > 65535) {
      validationErrors.push("-p | --port --> must be between 0 and 65535.")
   }

   if (parsedArguments.port && Number(parsedArguments.port) % 1 !== 0) {
      validationErrors.push("-p | --port --> must be an integer.")
   }

   if (parsedArguments.port && Number(parsedArguments.port) === 0) {
      validationErrors.push("-p | --port --> must not be 0.")
   }

   if (validationErrors.length > 0) {
      console.error(validationErrors.join("\n"))
      process.exit(1)
   }
}
