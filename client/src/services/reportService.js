import api from './api';

export default {
  getScheduleReports(params) {
    return api.get('/report/class-schedules', { params });
  },
};