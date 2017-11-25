const matchingGraph = require('./lib/matchingGraph')

function bySubjectCount () {
  return findBySubjectCount
}

function findBySubjectCount (simple, iris) {
  const graph = matchingGraph(simple, iris)

  const counts = graph.toArray().reduce((counts, quad) => {
    counts[quad.subject.value] = counts[quad.subject.value] || {
      count: 0,
      node: quad.subject
    }

    counts[quad.subject.value].count++

    return counts
  }, {})

  const max = Object.keys(counts).reduce((max, key) => {
    const count = counts[key]

    if (count.count > max.count) {
      return count
    } else {
      return max
    }
  }, {count: 0})

  return max.count === 0 ? [] : [max.node]
}

module.exports = bySubjectCount
