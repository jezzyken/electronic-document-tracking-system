import api from './api';

export default {
  getSchedules() {
    return api.get('/class-schedule');
  },

  getSchedule(id) {
    return api.get(`/class-schedule/${id}`);
  },

  getTeacherSchedule(id) {
    return api.get(`/class-schedule/teacher/${id}`);
  },

  createSchedule(scheduleData) {
    return api.post('/class-schedule', scheduleData);
  },

  updateSchedule(id, scheduleData) {
    return api.patch(`/class-schedule/${id}`, scheduleData);
  },

  deleteSchedule(id) {
    return api.delete(`/class-schedule/${id}`);
  }
};