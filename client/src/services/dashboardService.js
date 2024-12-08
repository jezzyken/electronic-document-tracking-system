import api from './api';

export default {
  getDashboardData() {
    return api.get('/dashboard/data');
  },
  getRecentActivities() {
    return api.get('/dashboard/activities');
  },
  getWeeklyAttendance() {
    return api.get('/dashboard/weekly-attendance');
  },
  getClassDistribution() {
    return api.get('/dashboard/class-distribution');
  }
};