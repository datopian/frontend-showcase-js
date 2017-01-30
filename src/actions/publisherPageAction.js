import * as actionTypes from "../constants/actionTypes";
import * as api from '../api';


export function getAllPackageForPublisherSuccess(packages) {
  return {
    type: actionTypes.FETCH_PACKAGES_SUCCESS,
    packages: packages.items
  };
}

export function getPublisherDetailsSuccess(details) {
  return {
    type: actionTypes.FETCH_PUB_DETAILS_SUCCESS,
    details: details.data
  };
}

export function getAllPackageForPublisher(publisherName) {
  return dispatch => {
    return api.getPackagesOfPublisher(publisherName).then(response => {
      dispatch(getAllPackageForPublisherSuccess(response.data));
    }).catch(error => {
      throw(error);
    });
  };
}

export function getPublisherDetails(publisherName) {
  return dispatch => {
    return api.getPublisherDetails(publisherName).then(response => {
      dispatch(getPublisherDetailsSuccess(response.data));
    }).catch(error => {
      throw(error);
    });
  };
}


