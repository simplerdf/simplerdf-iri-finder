const bySubjectCount = require('./lib/bySubjectCount')
const current = require('./lib/current')

class SimpleIriFinder {
  init (context, iri, graph, options) {
    SimpleIriFinder.assignIri(this, null, options.iriFinders)
  }

  static assignIri (simple, iris, finders) {
    const iri = SimpleIriFinder.findIri(simple, iris, finders)

    if (iri) {
      simple._core.iri = iri
    }
  }

  static findIri (simple, iris, finders) {
    return SimpleIriFinder.findIris(simple, iris, finders).shift()
  }

  static findIris (simple, iris, finders) {
    finders = finders || SimpleIriFinder.defaults.iriFinders

    return finders.reduce((iris, finder) => {
      if (iris.length === 1) {
        return iris
      }

      return finder(simple, iris)
    }, iris || [])
  }
}

SimpleIriFinder.defaults = {
  iriFinders: [current(), bySubjectCount()]
}

module.exports = SimpleIriFinder
