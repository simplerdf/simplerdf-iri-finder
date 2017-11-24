/* global describe, it */

const assert = require('assert')
const rdf = require('rdf-ext')
const SimpleCore = require('simplerdf-core')
const SimpleIriFinder = require('..')

describe('simplerdf-iri-finder', () => {
  describe('instance', () => {
    it('should be a constructor', () => {
      assert.equal(typeof SimpleIriFinder, 'function')
    })

    it('should use the default finders to find an IRI and assign it', () => {
      const Simple = SimpleCore.extend(SimpleIriFinder)

      const subject0 = rdf.namedNode('http://example.org/subject0')
      const subject1 = rdf.namedNode('http://example.org/subject1')

      const graph = rdf.dataset([
        rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object0')),
        rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object1')),
        rdf.quad(subject1, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
      ])

      const simple = new Simple({}, null, graph)

      assert.equal(simple.iri().value, subject0.value)
    })

    it('should use the finders given in iriFinders and assign it', () => {
      const iri = rdf.blankNode()

      const finders = [() => {
        return []
      }, () => {
        return [iri]
      }]

      const Simple = SimpleCore.extend(SimpleIriFinder)

      const simple = new Simple({}, null, null, {
        iriFinders: finders
      })

      assert.equal(simple.iri().value, iri.value)
    })
  })

  describe('static', () => {
    describe('.assignIri', () => {
      it('should be a function', () => {
        assert.equal(typeof SimpleIriFinder.assignIri, 'function')
      })

      it('should do nothing if no IRI was found', () => {
        const simple = new SimpleCore({})

        const iri = simple.iri()

        SimpleIriFinder.assignIri(simple)

        assert.equal(simple.iri(), iri)
      })

      it('should assign the found IRI', () => {
        const subject0 = rdf.namedNode('http://example.org/subject0')
        const subject1 = rdf.namedNode('http://example.org/subject1')

        const graph = rdf.dataset([
          rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object0')),
          rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object1')),
          rdf.quad(subject1, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
        ])

        const simple = new SimpleCore({}, null, graph)

        SimpleIriFinder.assignIri(simple)

        assert.equal(simple.iri().value, subject0.value)
      })
    })

    describe('.findIri', () => {
      it('should be a function', () => {
        assert.equal(typeof SimpleIriFinder.findIri, 'function')
      })

      it('should return an empty array if no IRIs were found', () => {
        const iri0 = rdf.blankNode()
        const iri1 = rdf.blankNode()

        const iris = [iri0, iri1]

        const finders = [() => {
          return iris
        }]

        const simple = new SimpleCore({})

        const result = SimpleIriFinder.findIri(simple, null, finders)

        assert.equal(result.value, iri0.value)
      })

      it('should return undefined if no IRI was found', () => {
        const finders = [() => {
          return []
        }]

        const simple = new SimpleCore({})

        const result = SimpleIriFinder.findIri(simple, null, finders)

        assert.equal(result, undefined)
      })
    })

    describe('.findIris', () => {
      it('should be a function', () => {
        assert.equal(typeof SimpleIriFinder.findIris, 'function')
      })

      it('should loop over filters until IRIs has length 1', () => {
        let count = 0

        const iri = rdf.blankNode()

        const finders = [() => {
          count++

          return []
        }, () => {
          count++

          return [iri]
        }, () => {
          count++

          return []
        }]

        const simple = new SimpleCore({})

        const result = SimpleIriFinder.findIris(simple, [], finders)

        assert.equal(result.length, 1)
        assert.equal(count, 2)
        assert.equal(result[0], iri)
      })
    })

    it('should return an empty array if no IRIs were found', () => {
      const finders = [() => {
        return []
      }]

      const simple = new SimpleCore({})

      const result = SimpleIriFinder.findIris(simple, [], finders)

      assert.equal(result.length, 0)
    })

    it('should use default finders of none are given', () => {
      let count = 0

      const defaultFinders = SimpleIriFinder.defaults.iriFinders

      SimpleIriFinder.defaults.iriFinders = [() => {
        count++

        return []
      }]

      const simple = new SimpleCore({})

      SimpleIriFinder.findIris(simple, [])

      SimpleIriFinder.defaults.iriFinders = defaultFinders

      assert.equal(count, 1)
    })

    it('should use current as first default finder', () => {
      const subject = rdf.namedNode('http://example.org/subject')

      const graph = rdf.dataset([
        rdf.quad(subject, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
      ])

      const simple = new SimpleCore({}, subject, graph)

      const result = SimpleIriFinder.findIris(simple)

      assert.equal(result.length, 1)
      assert.equal(result[0].value, subject.value)
    })

    it('should use subject count as second default finder', () => {
      const subject0 = rdf.namedNode('http://example.org/subject0')
      const subject1 = rdf.namedNode('http://example.org/subject1')

      const graph = rdf.dataset([
        rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object0')),
        rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object1')),
        rdf.quad(subject1, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
      ])

      const simple = new SimpleCore({}, null, graph)

      const result = SimpleIriFinder.findIris(simple)

      assert.equal(result.length, 1)
      assert.equal(result[0].value, subject0.value)
    })

    it('should start with an empty array if the IRIs parameter is not given', () => {
      let result

      const finders = [(simple, iris) => {
        result = iris

        return []
      }]

      const simple = new SimpleCore({})

      SimpleIriFinder.findIris(simple, null, finders)

      assert(Array.isArray(result))
      assert.equal(result.length, 0)
    })
  })
})
