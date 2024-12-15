import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const publicRoutes = [
  {
    path: '',
    name: 'Home',
    component: () => import("@/views/public/LandingPage.vue"),
  },
  {
    path: 'track',
    name: 'TrackRequest',
    component: () => import('@/views/public/TrackingPage.vue')
  },
  {
    path: 'request',
    name: 'RequestDocument',
    component: () => import('@/views/public/DocumentRequestPage.vue')
  },
  {
    path: "login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { guest: true },
  }
];

const adminRoutes = [
  {
    path: "",
    redirect: "dashboard",
  },
  {
    path: "dashboard",
    name: "Dashboard",
    component: () => import("@/views/admin/DashboardView.vue"),
  },
  {
    path: "uploads",
    name: "uploads",
    component: () => import("@/views/admin/UploadDocument.vue"),
  },
  {
    path: "request-list",
    name: "request-list",
    component: () => import("@/views/admin/RequestList.vue"),
  },
  {
    path: "documents",
    name: "documents",
    component: () => import("@/views/admin/DocumentList.vue"),
  },
  {
    path: "document-library",
    name: "documentLibrary",
    component: () => import("@/views/admin/DocumentLibrary.vue"),
  },
  {
    path: "settings",
    name: "settings",
    component: () => import("@/views/admin/Settings.vue"),
  },
  {
    path: "users",
    name: "users",
    component: () => import("@/views/admin/UserList.vue"),
  },
  {
    path: "status",
    name: "status",
    component: () => import("@/views/admin/StatusList.vue"),
  },
  {
    path: "departments",
    name: "departments",
    component: () => import("@/views/admin/DepartmentList.vue"),
  },
  {
    path: "user-roles",
    name: "roles",
    component: () => import("@/views/admin/RoleList.vue"),
  },
  {
    path: "reports",
    component: () => import("@/views/admin/Reports.vue"),
    children: [
      {
        path: "",
        name: "Reports",
      },
    ],
  }
];

const routes = [
  {
    path: '/',
    component: () => import("@/layouts/PublicLayout.vue"),
    children: publicRoutes
  },
  {
    path: "/admin",
    component: () => import("@/layouts/DashboardLayout.vue"),
    meta: { requiresAuth: true },
    children: adminRoutes
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = store.getters["auth/isAuthenticated"];

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.guest && isAuthenticated) {
    next("/admin/dashboard");
  } else {
    next();
  }
});

export default router;