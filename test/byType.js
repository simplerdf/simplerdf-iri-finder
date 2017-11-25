/* global describe, it */

const assert = require('assert')
const byType = require('../byType')
const rdf = require('rdf-ext')
const Simple = require('simplerdf-core')

describe('byType', () => {
  it('should be a function', () => {
    assert.equal(typeof byType, 'function')
  })

  it('should build a filter', () => {
    const filter = byType(rdf.namedNode('http://example.org/type'))

    assert.equal(typeof filter, 'function')
  })

  it('should return an empty array if the graph is empty', () => {
    const graph = rdf.dataset()

    const simple = new Simple({}, null, graph)

    const iris = byType(rdf.namedNode('http://example.org/type'))(simple, [])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 0)
  })

  it('should return an empty array if no type matches', () => {
    const subject0 = rdf.namedNode('http://example.org/subject0')
    const subject1 = rdf.namedNode('http://example.org/subject1')

    const type0 = rdf.namedNode('http://example.org/type0')
    const type1 = rdf.namedNode('http://example.org/type1')

    const graph = rdf.dataset([
      rdf.quad(subject0, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), type0),
      rdf.quad(subject1, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
    ])

    const simple = new Simple({}, null, graph)

    const iris = byType(type1)(simple, [])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 0)
  })

  it('should return the subject with the given type in an array', () => {
    const subject0 = rdf.namedNode('http://example.org/subject0')
    const subject1 = rdf.namedNode('http://example.org/subject1')

    const type = rdf.namedNode('http://example.org/type')

    const graph = rdf.dataset([
      rdf.quad(subject0, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), type),
      rdf.quad(subject1, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
    ])

    const simple = new Simple({}, null, graph)

    const iris = byType(type)(simple, [])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 1)
    assert.equal(iris[0].value, subject0.value)
  })

  it('should return multiple subjects if there are multiple matches', () => {
    const subject0 = rdf.namedNode('http://example.org/subject0')
    const subject1 = rdf.namedNode('http://example.org/subject1')

    const type = rdf.namedNode('http://example.org/type')

    const graph = rdf.dataset([
      rdf.quad(subject0, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), type),
      rdf.quad(subject1, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), type)
    ])

    const simple = new Simple({}, null, graph)

    const iris = byType(type)(simple, []).map(iri => iri.value)

    assert(Array.isArray(iris))
    assert.equal(iris.length, 2)
    assert(iris.indexOf(subject0.value) !== -1)
    assert(iris.indexOf(subject1.value) !== -1)
  })

  it('should process only the quads with a matching subject in the IRIs array', () => {
    const subject0 = rdf.namedNode('http://example.org/subject0')
    const subject1 = rdf.namedNode('http://example.org/subject1')

    const type = rdf.namedNode('http://example.org/type')

    const graph = rdf.dataset([
      rdf.quad(subject0, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), type),
      rdf.quad(subject1, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), type)
    ])

    const simple = new Simple({}, null, graph)

    const iris = byType(type)(simple, [subject0])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 1)
    assert.equal(iris[0].value, subject0.value)
  })
})
