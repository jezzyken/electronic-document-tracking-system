<template>
  <v-container>
    <v-card elevation="2">
      <v-card-title class="d-flex align-center py-3 px-4">
        <h2 class="text-h5 font-weight-bold mb-0">User Management</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="openCreateModal"
          prepend-icon="mdi-plus"
          class="px-4"
        >
          Create New User
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        :search="search"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [5, 10, 15, 20],
          showFirstLastPage: true,
        }"
        class="elevation-0"
      >
        <template v-slot:top>
          <v-toolbar flat class="px-4 d-flex justify-end">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search users..."
              hide-details
              dense
              outlined
              rounded
              class="mt-6"
              clearable
              @click:clear="search = ''"
              :class="{ 'focused-field': isFocused }"
              @focus="isFocused = true"
              @blur="isFocused = false"
              style="max-width: 300px"
            ></v-text-field>
          </v-toolbar>
        </template>

        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip
            :color="item.isActive ? 'success' : 'grey'"
            :text-color="item.isActive ? 'white' : ''"
            small
            label
          >
            {{ item.isActive ? "Active" : "Inactive" }}
          </v-chip>
        </template>

        <template v-slot:[`item.role`]="{ item }">
          <v-chip small outlined color="primary">
            {{ item.role ? item.role.name : "No Role" }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="primary"
                @click="openEditModal(item)"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit User</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="error"
                @click="confirmDelete(item._id)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete User</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <!-- User Form Dialog -->
    <v-dialog v-model="showModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h5">{{
            isEditing ? "Edit User" : "Create User"
          }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="userForm.username"
              label="Username"
              required
              outlined
              dense
              :rules="[(v) => !!v || 'Username is required']"
            ></v-text-field>

            <v-text-field
              v-model="userForm.email"
              label="Email"
              type="email"
              required
              outlined
              dense
              :rules="[
                (v) => !!v || 'Email is required',
                (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
              ]"
            ></v-text-field>

            <v-text-field
              v-model="userForm.password"
              label="Password"
              type="password"
              outlined
              dense
              :rules="[
                (v) =>
                  !isEditing || !!v || 'Password is required for new users',
              ]"
            ></v-text-field>

            <v-select
              v-model="userForm.role"
              :items="roles"
              item-text="name"
              item-value="_id"
              label="Role"
              required
              outlined
              dense
              :rules="[(v) => !!v || 'Role is required']"
            ></v-select>

            <v-switch
              v-model="userForm.isActive"
              label="Active Status"
              color="success"
              class="mt-2"
              hide-details
            ></v-switch>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-3 px-4">
          <v-spacer></v-spacer>
          <v-btn
            text
            color="grey darken-1"
            @click="closeModal"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="handleSubmit"
            :loading="loading"
            :disabled="!valid"
          >
            {{ isEditing ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h6">Delete User</span>
        </v-card-title>

        <v-card-text class="pt-3">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </v-card-text>

        <v-card-actions class="py-3 px-4">
          <v-spacer></v-spacer>
          <v-btn
            text
            color="grey darken-1"
            @click="showDeleteDialog = false"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn color="error" @click="handleDelete" :loading="loading">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      top
      right
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "UserManagement",

  data() {
    return {
      search: "",
      valid: true,
      showModal: false,
      showDeleteDialog: false,
      isEditing: false,
      isFocused: false,
      currentUserId: null,
      userForm: {
        username: "",
        email: "",
        password: "",
        role: null,
        isActive: true,
      },
      headers: [
        { text: "Username", value: "username" },
        { text: "Email", value: "email" },
        { text: "Role", value: "role.name" },
        { text: "Status", value: "isActive" },
        { text: "Created At", value: "createdAt" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      snackbar: {
        show: false,
        text: "",
        color: "",
      },
    };
  },

  computed: {
    ...mapState("users", ["loading", "error"]),
    ...mapGetters("users", ["users"]),
    ...mapState("roles", ["roles"]),
  },

  methods: {
    ...mapActions("users", [
      "fetchUsers",
      "createUser",
      "updateUser",
      "deleteUser",
    ]),
    ...mapActions("roles", ["fetchRoles"]),

    showSnackbar(text, color = "success") {
      this.snackbar = {
        show: true,
        text,
        color,
      };
    },

    resetForm() {
      this.userForm = {
        username: "",
        email: "",
        password: "",
        role: null,
        isActive: true,
      };
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    },

    openCreateModal() {
      this.isEditing = false;
      this.resetForm();
      this.showModal = true;
    },

    openEditModal(user) {
      this.isEditing = true;
      this.currentUserId = user._id;
      this.userForm = {
        username: user.username,
        email: user.email,
        password: "", // Clear password field for editing
        role: user.role?._id,
        isActive: user.isActive,
      };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
      this.currentUserId = null;
    },

    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      try {
        if (this.isEditing) {
          // Only include password if it was changed
          const userData = { ...this.userForm };
          if (!userData.password) {
            delete userData.password;
          }

          await this.updateUser({
            id: this.currentUserId,
            userData,
          });
          this.showSnackbar("User updated successfully");
        } else {
          await this.createUser(this.userForm);
          this.showSnackbar("User created successfully");
        }
        this.closeModal();
        await this.fetchUsers();
      } catch (error) {
        this.showSnackbar(
          error.response?.data?.message || "An error occurred",
          "error"
        );
      }
    },

    confirmDelete(id) {
      this.currentUserId = id;
      this.showDeleteDialog = true;
    },

    async handleDelete() {
      try {
        await this.deleteUser(this.currentUserId);
        this.showSnackbar("User deleted successfully");
        this.showDeleteDialog = false;
        this.currentUserId = null;
      } catch (error) {
        this.showSnackbar(
          error.response?.data?.message || "An error occurred",
          "error"
        );
      }
    },

    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString();
    },
  },

  async created() {
    try {
      await Promise.all([this.fetchUsers(), this.fetchRoles()]);
    } catch (error) {
      this.showSnackbar(
        error.response?.data?.message || "Failed to load data",
        "error"
      );
    }
  },

  watch: {
    error(newError) {
      if (newError) {
        this.showSnackbar(newError, "error");
      }
    },
  },
};
</script>

<style scoped>
.focused-field {
  transition: all 0.3s ease;
}

.focused-field:deep(.v-input__slot) {
  background: #f5f5f5;
}

.v-data-table :deep(th) {
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-chip.small {
  height: 24px;
}

/* Custom scrollbar for the modal */
:deep(.v-dialog) {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

:deep(.v-dialog::-webkit-scrollbar) {
  width: 8px;
}

:deep(.v-dialog::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.v-dialog::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.v-card-title {
  word-break: break-word;
}

.error--text {
  color: #ff5252 !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .v-data-table :deep(th),
  .v-data-table :deep(td) {
    padding: 0 8px !important;
  }

  .v-btn {
    min-width: unset;
  }
}
</style>
