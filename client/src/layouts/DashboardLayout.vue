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
        <v-list-item>
          <v-list-item-icon>
            <v-icon class="white--text">mdi-home-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title class="white--text">GIT E-DTS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <template v-for="item in menuItems">
          <!-- Regular menu item -->
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

          <!-- Group with sub-items -->
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="white" elevation="1">
      <v-app-bar-nav-icon
        @click.stop="toggleDrawer"
        color="#a52a2a"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="brown--text text--darken-4"
        >  {{capitalizedRouteName}}</v-toolbar-title
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
      { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },
      { title: "Upload", icon: "mdi-upload", to: "/uploads" },
      {
        title: "Documents",
        icon: "mdi-file-document-multiple",
        children: [
          {
            title: "Documents",
            icon: "mdi-file-document",
            to: "/documents",
          },
          {
            title: "Document Library",
            icon: "mdi-library",
            to: "/document-library",
          },
          {
            title: "Document Request",
            icon: "mdi-file-send",
            to: "/request",
          },
        ],
      },
      {
        title: "Users",
        icon: "mdi-account-group",
        children: [
          {
            title: "Users",
            icon: "mdi-account",
            to: "/users",
          },
          {
            title: "Roles",
            icon: "mdi-shield-account",
            to: "/user-roles",
          },
          {
            title: "Receipts",
            icon: "mdi-receipt",
            to: "/",
          },
        ],
      },
      { title: "Settings", icon: "mdi-cog", to: "/settings" },
      { title: "Reports", icon: "mdi-chart-box", to: "/reports" },
    ],
    accountMenu: [
      {
        title: "Profile",
        icon: "mdi-account",
        action: "goToProfile",
      },
      {
        title: "Logout",
        icon: "mdi-logout",
        action: "logout",
      },
    ],
  }),

  computed: {
  capitalizedRouteName() {
    return this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1);
  }
},

  methods: {
    ...mapActions("auth", ["logout"]),

    isGroupActive(item) {
      if (!item.children) return false;
      return item.children.some((child) => this.$route.path === child.to);
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
</style>
