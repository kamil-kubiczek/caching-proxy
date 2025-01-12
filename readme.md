## About project

This is a simple implementation of an HTTP proxy that supports in-memory caching, with additional support for writing cache data to a file asynchronously in the background. This helps restore cache when proxy is run again. Proxy is designed to handle only GET requests, other HTTP methods aren't cached.

**Project status: 🟢Ready to use**

---

## Features

Features provided by CLI and described here - https://roadmap.sh/projects/caching-server

---

## How to run proxy in CLI

**Prerequisites:**

-  must have `node 20.x.x` installed
-  must have `npm@8.19.4 or higher` installed

**Steps**

1. Inside project root directory run `npm run build`
1. Then run `node dist/index.js -o <origin-url> -p <port>`

**Help**
If you need help with command options use `node dist/index.js -h`

---
