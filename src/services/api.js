/* eslint-disable no-underscore-dangle */
// import client from './http/client'
import linesData from '@/api/lines.json';

const apiService = {
  fetchLines() {
    return Promise.resolve(linesData);
  },
};

export default apiService;
