import { log } from "console"
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFile, writeFileSync } from "fs"
import { ResponseData } from "./types"

const CACHE_DIR = __dirname + "/.cache"
const CACHE_FILENAME_WITH_DIR = CACHE_DIR + "/cache.proxy"

let memoryCache

export function initializeCache() {
   memoryCache = readCacheFromFile()
}

export function cacheResponse(response: ResponseData, meta: { path: string; requestMethod: string }) {
   if (meta.requestMethod !== "GET") {
      console.log("Skipping cache. Only GET requests are cached.")

      return
   }

   if (!response.ok) {
      return
   }

   memoryCache.set(`${meta.path}-${meta.requestMethod}`, response)

   saveCacheToFileInBackground()
}

export function clearCache() {
   if (memoryCache) {
      memoryCache.clear()
   }

   if (!existsSync(CACHE_FILENAME_WITH_DIR)) {
      return
   }

   unlinkSync(CACHE_FILENAME_WITH_DIR)
}

export function getResponseFromCache(method: string, path: string): ResponseData | undefined {
   return memoryCache.get(`${path}-${method}`)
}

function saveCacheToFileInBackground() {
   writeFile(CACHE_FILENAME_WITH_DIR, JSON.stringify(Object.fromEntries(memoryCache.entries())), "utf-8", (e) => {
      console.log("Cache file saved with new content.")
   })
}

function readCacheFromFile(): Map<string, ResponseData> {
   const directoryExists = existsSync(CACHE_DIR)

   if (!directoryExists) {
      log("Creating cache directory.")
      mkdirSync(CACHE_DIR)
   }

   const cacheFileExists = existsSync(CACHE_FILENAME_WITH_DIR)

   if (!cacheFileExists) {
      console.log("Using blank in-memory cache. Cache file does not exist.")
      return new Map() as Map<string, ResponseData>
   }

   const cacheFromFile = JSON.parse(readFileSync(CACHE_FILENAME_WITH_DIR, "utf-8")) as object | null

   if (!(cacheFromFile instanceof Object)) {
      unlinkSync(CACHE_FILENAME_WITH_DIR)
      console.log("Using blank in-memory cache. Cache from file corrupted. Recreating file.")

      writeFile(CACHE_FILENAME_WITH_DIR, "{}", "utf-8", () => {
         console.log("Cache file recreated with empty content.")
      })
      return new Map() as Map<string, ResponseData>
   }

   const cacheMap = new Map<string, ResponseData>()

   Object.keys(cacheFromFile).forEach((key) => {
      const value = cacheFromFile[key] as ResponseData
      cacheMap.set(key, value)
   })

   console.log("Using in-memory cache from saved cache file.")
   return cacheMap
}
