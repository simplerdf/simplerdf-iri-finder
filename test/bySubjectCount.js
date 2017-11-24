/* global describe, it */

const assert = require('assert')
const bySubjectCount = require('../lib/bySubjectCount')
const rdf = require('rdf-ext')
const Simple = require('simplerdf-core')

describe('bySubjectCount', () => {
  it('should be a function', () => {
    assert.equal(typeof bySubjectCount, 'function')
  })

  it('should build a filter', () => {
    const filter = bySubjectCount()

    assert.equal(typeof filter, 'function')
  })

  it('should return an empty array if the graph is empty', () => {
    const graph = rdf.dataset()

    const simple = new Simple({}, null, graph)

    const iris = bySubjectCount()(simple, [])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 0)
  })

  it('should return the subject with the highest count in an array', () => {
    const subject0 = rdf.namedNode('http://example.org/subject0')
    const subject1 = rdf.namedNode('http://example.org/subject1')

    const graph = rdf.dataset([
      rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object0')),
      rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object1')),
      rdf.quad(subject1, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
    ])

    const simple = new Simple({}, null, graph)

    const iris = bySubjectCount()(simple, [])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 1)
    assert.equal(iris[0].value, subject0.value)
  })

  it('should process only the quads with a matching subject in the IRIs array', () => {
    const subject0 = rdf.namedNode('http://example.org/subject0')
    const subject1 = rdf.namedNode('http://example.org/subject1')

    const graph = rdf.dataset([
      rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object0')),
      rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object1')),
      rdf.quad(subject1, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
    ])

    const simple = new Simple({}, null, graph)

    const iris = bySubjectCount()(simple, [subject1])

    assert(Array.isArray(iris))
    assert.equal(iris.length, 1)
    assert.equal(iris[0].value, subject1.value)
  })
})
