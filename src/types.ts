export type ResponseData = {
   body: any
   headers: {
      [key: string]: string
   }
   ok: Response["ok"]
   status: Response["status"]
   statusText: Response["statusText"]
   url: Response["url"]
}
