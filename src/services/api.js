/* eslint-disable no-underscore-dangle */
// import client from './http/client'
import linesData from '@/api/lines.json';
import incidentsData from '@/api/incidents.json';
import clustersData from '@/api/clusters.json';
import ratingData from '@/api/regions_rating.json';
import plansData from '@/api/plans.json';

const apiService = {
  fetchIncidents() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(incidentsData);
      }, 1500);
    });
  },

  fetchIncident(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const model = incidentsData.features.filter(f => f.properties.id === id)[0];
        resolve(model);
      }, 1500);
    });
  },

  fetchClusters() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(clustersData);
      }, 1500);
    });
  },

  fetchStatistic() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(ratingData);
      }, 1500);
    });
  },

  fetchLines() {
    return Promise.resolve(linesData);
  },

  fetchPlans() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(plansData);
      }, 1500);
    });
  },

  fetchPlan(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(clustersData);
      }, 1500);
    });
  },
};

export default apiService;
