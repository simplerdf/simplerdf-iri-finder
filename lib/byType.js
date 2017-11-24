const matchingGraph = require('./matchingGraph')
const rdf = require('rdf-ext')

const ns = {
  type: rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
}

function byType (type) {
  return findByType.bind(null, type)
}

function findByType (type, simple, iris) {
  const graph = matchingGraph(simple, iris)

  return graph.match(null, ns.type, type).toArray().map(quad => quad.subject)
}

module.exports = byType
