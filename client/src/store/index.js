import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import users from "./modules/users";
import dashboard from "./modules/dashboard";
import departments from "./modules/departments";
import courses from "./modules/courses";
import subjects from "./modules/subjects";
import students from "./modules/students";
import professors from "./modules/professors";
import teacherLoad from "./modules/teacherLoad";
import schedules from "./modules/schedules";
import reports from "./modules/reports";
import enrollments from "./modules/enrollments";
import documents from "./modules/documents";
import roles from "./modules/roles";


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    users,
    dashboard,
    departments,
    courses,
    subjects,
    students,
    teacherLoad,
    professors,
    schedules,
    reports,
    enrollments,
    documents,
    roles
  },
});
