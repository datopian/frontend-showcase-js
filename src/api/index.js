import axios from 'axios';

export function getPackageMetadata(publisher, pack) {
  return axios.get(`https://staging.datapackaged.com/api/package/${publisher}/${pack}`);
}

export function getPublisherDetails(publisher) {
  return axios.get(`https://staging.datapackaged.com/api/profile/publisher/${publisher}`);
}

export function getPackagesOfPublisher(publisher) {
  return axios.get(`https://staging.datapackaged.com/api/search/package?q=* publisher:${publisher}`);
}
