import { NormalModule } from './NormalModule'

export class NormalModuleFactory {
  create(data) {
    return new NormalModule(data)
  }
}
