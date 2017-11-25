/* global describe, it */

const assert = require('assert')
const current = require('../current')
const rdf = require('rdf-ext')
const Simple = require('simplerdf-core')

describe('current', () => {
  it('should be a function', () => {
    assert.equal(typeof current, 'function')
  })

  it('should build a filter', () => {
    const filter = current()

    assert.equal(typeof filter, 'function')
  })

  it('should return an empty array if the graph is empty', () => {
    const graph = rdf.dataset()

    const simple = new Simple({}, null, graph)

    const iris = current()(simple, [])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 0)
  })

  it('should return the current IRI if there is subject triple in the graph', () => {
    const subject = rdf.namedNode('http://example.org/subject')

    const graph = rdf.dataset([
      rdf.quad(subject, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
    ])

    const simple = new Simple({}, subject, graph)

    const iris = current()(simple, [])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 1)
    assert.equal(iris[0].value, subject.value)
  })

  it('should return an empty array if the graph doesn\'t contain a matching subject triple', () => {
    const subject0 = rdf.namedNode('http://example.org/subject0')
    const subject1 = rdf.namedNode('http://example.org/subject1')

    const graph = rdf.dataset([
      rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
    ])

    const simple = new Simple({}, subject1, graph)

    const iris = current()(simple, [])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 0)
  })
})
