function matchingGraph (simple, iris) {
  if (iris.length === 0) {
    return simple.graph()
  }

  return simple.graph().filter((quad) => {
    return iris.some(iri => iri.value === quad.subject.value)
  })
}

module.exports = matchingGraph
