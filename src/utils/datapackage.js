import fetch from 'isomorphic-fetch'
const {open} = require('data.js')
const toArray = require('stream-to-array')


export async function fetchDataOnly(resource, {basePath} = {}) {

  const tabularFormats = ['csv', 'tsv', 'xls', 'xlsx']

  if (tabularFormats.includes(resource.descriptor.format)) {
    const file = await open(resource.descriptor, {basePath})
    const rowStream = await file.rows()
    return await toArray(rowStream)
  } else if (resource.descriptor.format && resource.descriptor.format.includes('json')) {
    // Fetch as JSON data
    if (resource.descriptor.data) {
      return resource.descriptor.data
    } else {
      const response = await fetch(resource.source)
      return await response.json()
    }
  } else {
    // TODO: Fetch other formats, e.g., PDF...
    return 'Fetching this format is not available at the moment.'
  }
}
