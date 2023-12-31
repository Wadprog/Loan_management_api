// Initializes the `cities` service on path `/cities`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Cities } from './cities.class'
import hooks from './cities.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    cities: Cities & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: app.get('sequelizeClient').models.Cities,
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/cities', new Cities(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('cities')

  service.hooks(hooks)
}
