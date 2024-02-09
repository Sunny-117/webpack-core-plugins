import babylon from 'babylon'
import { Tapable } from 'tapable'

export class Parser extends Tapable {
  parse(source) {
    return babylon.parse(source, {
      sourceType: 'module',
      plugins: ['dynamicImport'],
    })
  }
}
