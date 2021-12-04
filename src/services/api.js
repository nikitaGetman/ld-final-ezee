/* eslint-disable no-underscore-dangle */
import client from '@/http/client';
import linesData from '@/api/lines.json';
import incidentsData from '@/api/incidents.json';
// import clustersData from '@/api/clusters.json';
import clustersNewData from '@/api/clusters_raw.json';
import ratingData from '@/api/regions_rating.json';
import plansData from '@/api/plans.json';

const apiService = {
  fetchIncidents() {
    return client
      .get('/incidents')
      .then(res => {
        const otherLevels = res.features.filter(f => f.properties.dangerLevel === 2 || f.properties.dangerLevel === 3);
        if (otherLevels.length < 2) {
          console.warn('mix incidents with other danger levels');
          const model = { ...incidentsData, features: [...res.features, ...incidentsData.features.slice(2)] };
          return model;
        }
        return res;
      })
      .catch(() => incidentsData);
  },

  fetchIncident(id) {
    return client.get('/incident', { params: { id } }).catch(() => {
      const model = incidentsData.features.filter(f => f.properties.id === id)[0];
      return model;
    });
  },

  fetchClusters() {
    return Promise.resolve(clustersNewData);
    // return client.get('/clusters').catch(() => clustersData);
  },

  fetchStatistic() {
    return client.get('/statistic').catch(() => ratingData);
  },

  fetchLines() {
    return Promise.resolve(linesData);
  },

  fetchPlans() {
    return client.get('/plans').catch(() => plansData);
  },

  // eslint-disable-next-line
  fetchPlan(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(clustersNewData);
      }, 1500);
    });
  },
};

export default apiService;
