<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      :mini-variant.sync="mini"
      width="240"
      mini-variant-width="64"
      :temporary="$vuetify.breakpoint.mobile"
      color="#a52a2a"
      dark
    >
      <v-list dense class="drawer-list">
        <div class="user-profile pa-4">
          <div class="text-center">
            <v-avatar
              size="40"
              class="mb-3"
              color="grey lighten-4"
              elevation="2"
            >
              <span class="primary--text font-weight-medium text-caption">{{
                userInitials
              }}</span>
            </v-avatar>
          </div>

          <!-- Only show details when not in mini mode -->
          <div v-if="!mini" class="user-details text-center">
            <h3 class="text-subtitle-1 font-weight-medium mb-1">
              {{ currentUser.name }}
            </h3>
            <p class="text-caption mb-2 white--text">
              {{ currentUser.email }}
            </p>
            <div class="role-info">
              <v-chip
                small
                class="mr-1 mb-1"
                color="white"
                text-color="white"
                outlined
              >
                {{ currentUser.department }}
              </v-chip>
              <v-chip
                small
                class="mb-1"
                color="white"
                text-color="white"
                outlined
              >
                {{ currentUser.role.name }}
              </v-chip>
            </div>
          </div>
        </div>
        <v-divider class="mb-2"></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon class="white--text">mdi-home-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title class="white--text">GIT E-DTS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <template v-for="item in filteredMenuItems">
          <template
            v-if="!item.show || (item.show === 'isAdmin' ? isAdmin : true)"
          >
            <v-list-item
              v-if="!item.children"
              :key="item.title"
              :to="item.to"
              link
              class="drawer-item white--text"
              :class="{ 'active-item': $route.path === item.to }"
            >
              <v-list-item-icon>
                <v-icon class="white--text">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content v-if="!mini">
                <v-list-item-title class="white--text">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-group
              v-else
              :key="item.title"
              :prepend-icon="item.icon"
              class="drawer-item"
              :value="isGroupActive(item)"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="white--text">{{
                    item.title
                  }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="child in item.children"
                :key="child.title"
                :to="child.to"
                link
                class="drawer-sub-item white--text"
                :class="{ 'active-item': $route.path === child.to }"
              >
                <v-list-item-icon>
                  <v-icon class="white--text">{{ child.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-if="!mini">
                  <v-list-item-title class="white--text">{{
                    child.title
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="white" elevation="1">
      <v-app-bar-nav-icon
        @click.stop="toggleDrawer"
        color="#a52a2a"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="brown--text text--darken-4">
        {{ capitalizedRouteName }}</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="#a52a2a">mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in accountMenu"
            :key="item.title"
            @click="handleAction(item.action)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DashboardLayout",

  data: () => ({
    drawer: true,
    mini: false,
    menuItems: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/admin/dashboard",
      },
      // { title: "Upload", icon: "mdi-upload", to: "/admin/uploads" },
      { title: "Student Request Page", icon: "mdi-clipboard-text-outline", to: "/" },
      {
        title: "Documents",
        icon: "mdi-file-document-multiple",
        defaultOpen: true,
        children: [
          {
            title: "Documents",
            icon: "mdi-file-document",
            to: "/admin/documents",
          },
          // {
          //   title: "Document Library",
          //   icon: "mdi-library",
          //   to: "/admin/document-library",
          // },
          {
            title: "Document Request",
            icon: "mdi-file-send",
            to: "/admin/request-list",
          },
        ],
      },
      {
        title: "Admin",
        icon: "mdi-account-group",
        show: "isAdmin",
        children: [
          {
            title: "Users",
            icon: "mdi-account-multiple",
            to: "/admin/users",
          },
          {
            title: "Roles",
            icon: "mdi-shield-account",
            to: "/admin/user-roles",
          },
          {
            title: "Departments",
            icon: "mdi-domain",
            to: "/admin/departments",
          },
          {
            title: "Status",
            icon: "mdi-checkbox-marked-circle-outline",
            to: "/admin/status",
          },
        ],
      },
      // { title: "Settings", icon: "mdi-cog", to: "/admin/settings" },
      { title: "Reports", icon: "mdi-chart-box", to: "/admin/reports" },
    ],
    accountMenu: [
      // {
      //   title: "Profile",
      //   icon: "mdi-account",
      //   action: "goToProfile",
      // },
      {
        title: "Logout",
        icon: "mdi-logout",
        action: "logout",
      },
    ],
  }),

  computed: {
    capitalizedRouteName() {
      return (
        this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1)
      );
    },
    isAdmin() {
      const userData = JSON.parse(localStorage.getItem("user"));
      return userData?.role?.name === "Admin";
    },
    filteredMenuItems() {
      return this.menuItems.filter((item) => {
        if (item.show === "isAdmin" && !this.isAdmin) {
          return false;
        }

        if (item.title === "Dashboard") {
          const userData = JSON.parse(localStorage.getItem("user"));
          if (userData?.role?.name === "Staff") {
            return false;
          }
        }

        return true;
      });
    },
    currentUser() {
      try {
        const userData = JSON.parse(localStorage.getItem("user")) || {};

        if (!userData) {
          return null;
        }

        return {
          name:
            (userData?.name !== "undefined undefined" && userData?.name) ||
            (userData?.fullName !== "undefined undefined" &&
              userData?.fullName) ||
            userData?.email ||
            "User",
          email: userData?.email || "",
          role: userData?.role || { name: "Guest" },
          department: userData?.department?.name || "Guest",
        };
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    },
    userInitials() {
      const name = this.currentUser?.name || "Admin";

      if (name.includes("@")) {
        return name[0].toUpperCase();
      }

      const words = name.split(" ");
      return words
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },
  },

  methods: {
    ...mapActions("auth", ["logout"]),

    isGroupActive(item) {
      if (!item.children) return false;
      return (
        item.defaultOpen ||
        item.children.some((child) => this.$route.path === child.to)
      );
    },

    toggleDrawer() {
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = !this.drawer;
      } else {
        this.mini = !this.mini;
        this.drawer = true;
      }
    },

    goToProfile() {
      this.$router.push({ name: "Profile" });
    },

    handleAction(action) {
      if (this[action]) {
        this[action]();
      }
    },
  },

  watch: {
    $route() {
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = false;
      }
    },
  },
};
</script>

<style>
.drawer-list {
  color: white !important;
}

.drawer-list .v-list-item__icon .v-icon {
  color: white !important;
}

.v-list-group__header.v-list-item--active:before {
  opacity: 0.12;
  background-color: white !important;
}

.v-list-group__header .v-list-group__header__prepend-icon.v-icon {
  color: white !important;
}

.v-list-group__header .v-list-group__header__append-icon.v-icon {
  color: white !important;
}

.active-item {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: white !important;
}

.active-item .v-icon {
  color: white !important;
}

.v-list-group--active > .v-list-group__header {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.drawer-sub-item.active-item {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: white !important;
  margin-left: 8px !important;
  border-radius: 0 4px 4px 0 !important;
}

.drawer-item:hover,
.drawer-sub-item:hover {
  background-color: rgba(255, 255, 255, 0.04) !important;
}

.v-list-item,
.v-icon,
.v-list-item__title {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out !important;
}

.user-details {
  line-height: 1.4;
}

.role-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.v-chip {
  font-size: 11px !important;
}
</style>
