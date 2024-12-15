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
        :headers="dynamicHeaders"
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
            ></v-text-field>
          </v-toolbar>
        </template>

        <template v-slot:[`item.fullName`]="{ item }">
          <div class="font-weight-medium">
            {{
              item.firstName && item.lastName
                ? `${item.firstName} ${item.lastName}`
                : "Admin"
            }}
          </div>
        </template>

        <template v-slot:[`item.department`]="{ item }">
          <div>{{ item.department?.name }}</div>
        </template>

        <template v-slot:[`item.role`]="{ item }">
          <v-chip small label color="primary" text-color="white">
            {{ item.role?.name }}
          </v-chip>
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

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom v-if="item.email !== 'admin@app.dev'">
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

          <v-tooltip bottom v-if="item.email !== 'admin@app.dev'">
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

        <template v-slot:no-data>
          <v-alert type="info" class="ma-4" text>No users found</v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Modal -->
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
            <!-- Role Selection First -->
            <v-select
              v-model="userForm.role"
              :items="roles"
              item-text="name"
              item-value="_id"
              label="Role"
              required
              outlined
              dense
              :rules="[(v) => !!v || 'Please select a role first']"
              @change="handleRoleChange"
            ></v-select>

            <!-- Other fields only shown after role is selected -->
            <template v-if="userForm.role">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="userForm.firstName"
                    label="First Name"
                    required
                    outlined
                    dense
                    :rules="[(v) => !!v || 'First name is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="userForm.lastName"
                    label="Last Name"
                    required
                    outlined
                    dense
                    :rules="[(v) => !!v || 'Last name is required']"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="userForm.email"
                label="Email"
                type="email"
                required
                outlined
                dense
                :rules="emailRules"
              ></v-text-field>

              <v-text-field
                v-if="!isEditing"
                v-model="userForm.password"
                label="Password"
                type="password"
                required
                outlined
                dense
                :rules="passwordRules"
              ></v-text-field>

              <!-- Employee ID only for non-admin roles -->
              <v-text-field
                v-if="!isAdminRole"
                v-model="userForm.employeeId"
                label="Employee ID"
                outlined
                dense
              ></v-text-field>

              <!-- Department and Position only for non-admin roles -->
              <template v-if="!isAdminRole">
                <v-select
                  v-model="userForm.department"
                  :items="departments"
                  item-text="name"
                  item-value="_id"
                  label="Department"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Department is required']"
                ></v-select>

                <v-text-field
                  v-model="userForm.position"
                  label="Position"
                  required
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Position is required']"
                ></v-text-field>
              </template>

              <v-switch
                v-model="userForm.isActive"
                label="Active Status"
                color="success"
                class="mt-2"
                hide-details
              ></v-switch>
            </template>
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
      isFocused: false,
      valid: true,
      showModal: false,
      showDeleteDialog: false,
      isEditing: false,
      isAdminRole: false,
      currentUserId: null,
      userForm: {
        role: null,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        employeeId: "",
        department: null,
        position: "",
        isActive: true,
      },
      baseHeaders: [
        { text: "Name", value: "fullName" },
        { text: "Email", value: "email" },
        { text: "Role", value: "role.name" },
        { text: "Status", value: "isActive" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      nonAdminHeaders: [
        { text: "Employee ID", value: "employeeId" },
        { text: "Department", value: "department.name" },
        { text: "Position", value: "position" },
      ],
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 8 || "Password must be at least 8 characters",
      ],
      snackbar: {
        show: false,
        text: "",
        color: "",
      },
    };
  },

  computed: {
    ...mapState({
      loading: (state) => state.users.loading,
      error: (state) => state.users.error,
      users: (state) => state.users.users,
      roles: (state) => state.roles.roles,
      departments: (state) => state.departments.departments,
    }),

    dynamicHeaders() {
      // Filter users to check if there are any admin users
      const hasAdminUsers = this.users.some(
        (user) => user.role?.name.toLowerCase() === "admin"
      );

      // If there are admin users, show only base headers for them
      if (hasAdminUsers) {
        return [...this.baseHeaders];
      }

      // For non-admin users, include all headers
      return [
        ...this.baseHeaders.slice(0, 2),
        ...this.nonAdminHeaders,
        ...this.baseHeaders.slice(2),
      ];
    },
  },

  methods: {
    ...mapActions({
      fetchUsers: "users/fetchUsers",
      createUser: "users/createUser",
      updateUser: "users/updateUser",
      deleteUser: "users/deleteUser",
      fetchRoles: "roles/fetchRoles",
      fetchDepartments: "departments/fetchDepartments",
    }),

    showSnackbar(text, color = "success") {
      this.snackbar = {
        show: true,
        text,
        color,
      };
    },

    handleRoleChange(roleId) {
      const selectedRole = this.roles.find((role) => role._id === roleId);
      this.isAdminRole = selectedRole?.name.toLowerCase() === "admin";

      if (this.isAdminRole) {
        this.userForm.employeeId = "";
        this.userForm.department = null;
        this.userForm.position = "";
      }
    },

    openCreateModal() {
      this.isEditing = false;
      this.userForm = {
        role: null,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        employeeId: "",
        department: null,
        position: "",
        isActive: true,
      };
      this.isAdminRole = false;
      this.showModal = true;
    },

    openEditModal(user) {
      this.isEditing = true;
      this.currentUserId = user._id;
      this.userForm = {
        role: user.role?._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        employeeId: user.employeeId,
        department: user.department?._id,
        position: user.position,
        isActive: user.isActive,
      };
      this.handleRoleChange(user.role?._id);
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.$refs.form.reset();
      this.isAdminRole = false;
    },

    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      try {
        const userData = { ...this.userForm };

        // Remove non-admin fields if admin role
        if (this.isAdminRole) {
          delete userData.employeeId;
          delete userData.department;
          delete userData.position;
        }

        if (this.isEditing) {
          await this.updateUser({
            id: this.currentUserId,
            userData,
          });
          this.showSnackbar("User updated successfully");
        } else {
          await this.createUser(userData);
          this.showSnackbar("User created successfully");
        }
        this.closeModal();
        await this.fetchUsers();
      } catch (error) {
        this.showSnackbar(error.message || "An error occurred", "error");
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
        await this.fetchUsers();
      } catch (error) {
        this.showSnackbar(error.message || "An error occurred", "error");
      }
    },
  },

  async created() {
    try {
      await Promise.all([
        this.fetchUsers(),
        this.fetchRoles(),
        this.fetchDepartments(),
      ]);
    } catch (error) {
      this.showSnackbar(error.message || "Failed to fetch data", "error");
    }
  },

  watch: {
    "userForm.role"(newRole) {
      if (!newRole) {
        // Reset form fields when role is cleared
        this.userForm.employeeId = "";
        this.userForm.department = null;
        this.userForm.position = "";
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

.v-data-table >>> .v-data-table__wrapper {
  overflow-x: auto;
}

.v-card {
  border-radius: 8px;
}

.v-dialog > .v-card {
  border-radius: 8px;
}
</style>
