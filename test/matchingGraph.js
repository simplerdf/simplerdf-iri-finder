/* global describe, it */

const assert = require('assert')
const matchingGraph = require('../lib/matchingGraph')
const rdf = require('rdf-ext')
const Simple = require('simplerdf-core')

describe('matching-graph', () => {
  it('should be a function', () => {
    assert.equal(typeof matchingGraph, 'function')
  })

  it('should return the input graph if the IRIs array is empty', () => {
    const subject = rdf.namedNode('http://example.org/subject')
    const graph = rdf.dataset([
      rdf.quad(subject, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
    ])
    const simple = new Simple(subject, {}, graph)

    const matches = matchingGraph(simple, [])

    assert.equal(matches.toCanonical(), graph.toCanonical())
  })

  it('should return only triples with subject matching the IRIs', () => {
    const subject0 = rdf.namedNode('http://example.org/subject0')
    const subject1 = rdf.namedNode('http://example.org/subject1')
    const graph = rdf.dataset([
      rdf.quad(subject0, rdf.namedNode('http://example.org/predicate'), rdf.literal('object')),
      rdf.quad(subject1, rdf.namedNode('http://example.org/predicate'), rdf.literal('object'))
    ])
    const simple = new Simple(subject0, {}, graph)

    const expected = graph.match(subject0)

    const matches = matchingGraph(simple, [subject0])

    assert.equal(matches.toCanonical(), expected.toCanonical())
  })
})
