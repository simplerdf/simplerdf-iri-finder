function current () {
  return findCurrent
}

function findCurrent (simple) {
  if (simple.graph().match(simple.iri()).length > 0) {
    return [simple.iri()]
  }

  return []
}

module.exports = current
