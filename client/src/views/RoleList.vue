<template>
  <v-container>
    <v-card elevation="2">
      <v-card-title class="d-flex align-center py-3 px-4">
        <h2 class="text-h5 font-weight-bold mb-0">Role Management</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="openCreateModal"
          prepend-icon="mdi-plus"
          class="px-4"
        >
          Create New Role
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="roles"
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
              label="Search roles..."
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

        <template v-slot:[`item.name`]="{ item }">
          <div class="font-weight-medium">{{ item.name }}</div>
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

        <template v-slot:[`item.permissions`]="{ item }">
          <v-chip
            v-for="permission in item.permissions"
            :key="permission"
            class="mr-1 mb-1"
            small
            outlined
            color="primary"
          >
            {{ permission }}
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
            <span>Edit Role</span>
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
            <span>Delete Role</span>
          </v-tooltip>
        </template>

        <template v-slot:no-data>
          <v-alert type="info" class="ma-4" text> No roles found </v-alert>
        </template>

        <template v-slot:progress>
          <v-overlay :value="loading" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </template>
      </v-data-table>
    </v-card>

    <!-- Enhanced Create/Edit Modal -->
    <v-dialog v-model="showModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h5">{{
            isEditing ? "Edit Role" : "Create Role"
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
              v-model="roleForm.name"
              label="Role Name"
              required
              outlined
              dense
              :rules="[(v) => !!v || 'Name is required']"
            ></v-text-field>

            <v-select
              v-model="roleForm.permissions"
              :items="availablePermissions"
              label="Permissions"
              multiple
              chips
              outlined
              dense
              required
              :rules="[
                (v) => v.length > 0 || 'At least one permission is required',
              ]"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 3" small label class="mr-1">
                  {{ item }}
                </v-chip>
                <span v-if="index === 3" class="text-caption grey--text">
                  (+{{ roleForm.permissions.length - 3 }} more)
                </span>
              </template>
            </v-select>

            <v-textarea
              v-model="roleForm.description"
              label="Description"
              rows="3"
              outlined
              dense
              class="mt-3"
              placeholder="Enter role description..."
            ></v-textarea>

            <v-switch
              v-model="roleForm.isActive"
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

    <!-- Enhanced Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h6">Delete Role</span>
        </v-card-title>

        <v-card-text class="pt-3">
          Are you sure you want to delete this role? This action cannot be
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

    <!-- Enhanced Snackbar -->
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
  name: "RoleManagement",

  data() {
    return {
      search: "",
      isFocused: false,
      valid: true,
      showModal: false,
      showDeleteDialog: false,
      isEditing: false,
      roleForm: {
        name: "",
        permissions: [],
        description: "",
        isActive: true,
      },
      currentRoleId: null,
      headers: [
        { text: "Name", value: "name" },
        { text: "Permissions", value: "permissions" },
        { text: "Description", value: "description" },
        { text: "Status", value: "isActive" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      availablePermissions: ["read", "write", "update", "delete"],
      snackbar: {
        show: false,
        text: "",
        color: "",
      },
    };
  },

  computed: {
    ...mapState("roles", ["loading", "error"]),
    ...mapGetters("roles", ["roles"]),
  },

  methods: {
    ...mapActions("roles", [
      "fetchRoles",
      "createRole",
      "updateRole",
      "deleteRole",
    ]),

    showSnackbar(text, color = "success") {
      this.snackbar = {
        show: true,
        text,
        color,
      };
    },

    openCreateModal() {
      this.isEditing = false;
      this.roleForm = {
        name: "",
        permissions: [],
        description: "",
        isActive: true,
      };
      this.showModal = true;
    },

    openEditModal(role) {
      this.isEditing = true;
      this.currentRoleId = role._id;
      this.roleForm = {
        name: role.name,
        permissions: [...role.permissions],
        description: role.description,
        isActive: role.isActive,
      };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.$refs.form.reset();
    },

    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      try {
        if (this.isEditing) {
          await this.updateRole({
            id: this.currentRoleId,
            roleData: this.roleForm,
          });
          this.showSnackbar("Role updated successfully");
        } else {
          await this.createRole(this.roleForm);
          this.showSnackbar("Role created successfully");
        }
        this.closeModal();
        await this.fetchRoles();
      } catch (error) {
        this.showSnackbar(error.message || "An error occurred", "error");
      }
    },

    confirmDelete(id) {
      this.currentRoleId = id;
      this.showDeleteDialog = true;
    },

    async handleDelete() {
      try {
        await this.deleteRole(this.currentRoleId);
        this.showSnackbar("Role deleted successfully");
        this.showDeleteDialog = false;
        await this.fetchRoles();
      } catch (error) {
        this.showSnackbar(error.message || "An error occurred", "error");
      }
    },
  },

  async created() {
    try {
      await this.fetchRoles();
    } catch (error) {
      this.showSnackbar(error.message || "Failed to fetch roles", "error");
    }
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
</style>