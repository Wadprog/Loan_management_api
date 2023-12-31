import path from 'path'
import favicon from 'serve-favicon'
import helmet from 'helmet'
import cors from 'cors'
import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
// import socketio from '@feathersjs/socketio'
import { HookContext as FeathersHookContext } from '@feathersjs/feathers'
import morgan from 'morgan'

/** Custom dependencies */
import database from './models'
import { Application } from './declarations'
import logger from './utils/logger'
import middleware from './middleware'
import services from './services'
import appHooks from './app.hooks'
// import channels from './channels'

import authentication from './authentication'
import sequelize from './sequelize'
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers())
export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false
  })
)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// Host the public folder
app.use('/', express.static(app.get('public')))

// Set up Plugins and providers
app.configure(express.rest())
// app.configure(socketio())

app.configure(sequelize)

// app.configure(middleware)
app.configure(authentication)
app.configure(database)
app.get('startSequelize')()
app.configure(services)
// app.configure(channels);

app.use('/test', (req: any, res: any) => {
  const subdomain = req.headers['x-forwarded-host'].split('.')[0]

  res.send(subdomain)
})

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger } as any))
app.hooks(appHooks)

export default app
