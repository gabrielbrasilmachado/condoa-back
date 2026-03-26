import 'reflect-metadata'
import express from 'express'
import { corsMiddleware } from './shared/http/middlewares/cors.middleware'
import { router } from './shared/http/routes'

const app = express()

app.use(corsMiddleware)
app.use(express.json())
app.use(router)

export { app }
