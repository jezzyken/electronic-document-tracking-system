<template>
  <v-container>
    <v-card elevation="2">
      <v-card-title class="d-flex align-center py-3 px-4">
        <h2 class="text-h5 font-weight-bold mb-0">Department Management</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openCreateModal" prepend-icon="mdi-plus" class="px-4">
          Create New Department
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table :headers="headers" :items="departments" :loading="loading" :search="search" :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [5, 10, 15, 20],
          showFirstLastPage: true,
        }" class="elevation-0">
        <template v-slot:top>
          <v-toolbar flat class="px-4 d-flex justify-end">
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search departments..." hide-details
              dense outlined rounded class="mt-6" clearable @click:clear="search = ''"
              :class="{ 'focused-field': isFocused }" @focus="isFocused = true"
              @blur="isFocused = false"></v-text-field>
          </v-toolbar>
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <div class="font-weight-medium">{{ item.name }}</div>
        </template>

        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip :color="item.isActive ? 'success' : 'grey'" :text-color="item.isActive ? 'white' : ''" small label>
            {{ item.isActive ? "Active" : "Inactive" }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small color="primary" @click="openEditModal(item)" class="mr-2" v-bind="attrs" v-on="on">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit Department</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small color="error" @click="confirmDelete(item._id)" v-bind="attrs" v-on="on">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete Department</span>
          </v-tooltip>
        </template>

        <template v-slot:no-data>
          <v-alert type="info" class="ma-4" text>No departments found</v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Modal -->
    <v-dialog v-model="showModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h5">{{ isEditing ? "Edit Department" : "Create Department" }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
            <v-text-field v-model="departmentForm.name" label="Department Name" required outlined dense
              :rules="[(v) => !!v || 'Name is required']"></v-text-field>

            <v-switch v-model="departmentForm.isActive" label="Active Status" color="success" class="mt-2"
              hide-details></v-switch>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-3 px-4">
          <v-spacer></v-spacer>
          <v-btn text color="grey darken-1" @click="closeModal" :disabled="loading">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="handleSubmit" :loading="loading" :disabled="!valid">
            {{ isEditing ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h6">Delete Department</span>
        </v-card-title>

        <v-card-text class="pt-3">
          Are you sure you want to delete this department? This action cannot be undone.
        </v-card-text>

        <v-card-actions class="py-3 px-4">
          <v-spacer></v-spacer>
          <v-btn text color="grey darken-1" @click="showDeleteDialog = false" :disabled="loading">
            Cancel
          </v-btn>
          <v-btn color="error" @click="handleDelete" :loading="loading">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" top right>
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "DepartmentManagement",

  data() {
    return {
      search: "",
      isFocused: false,
      valid: true,
      showModal: false,
      showDeleteDialog: false,
      isEditing: false,
      departmentForm: {
        name: "",
        isActive: true,
      },
      currentDepartmentId: null,
      headers: [
        { text: "Name", value: "name" },
        { text: "Status", value: "isActive" },
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
    ...mapState("departments", ["loading", "error"]),
    ...mapGetters("departments", ["departments"]),
  },

  methods: {
    ...mapActions("departments", [
      "fetchDepartments",
      "createDepartment",
      "updateDepartment",
      "deleteDepartment",
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
      this.departmentForm = {
        name: "",
        isActive: true,
      };
      this.showModal = true;
    },

    openEditModal(department) {
      this.isEditing = true;
      this.currentDepartmentId = department._id;
      this.departmentForm = {
        name: department.name,
        isActive: department.isActive,
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
          await this.updateDepartment({
            id: this.currentDepartmentId,
            departmentData: this.departmentForm,
          });
          this.showSnackbar("Department updated successfully");
        } else {
          await this.createDepartment(this.departmentForm);
          this.showSnackbar("Department created successfully");
        }
        this.closeModal();
        await this.fetchDepartments();
      } catch (error) {
        this.showSnackbar(error.message || "An error occurred", "error");
      }
    },

    confirmDelete(id) {
      this.currentDepartmentId = id;
      this.showDeleteDialog = true;
    },

    async handleDelete() {
      try {
        await this.deleteDepartment(this.currentDepartmentId);
        this.showSnackbar("Department deleted successfully");
        this.showDeleteDialog = false;
        await this.fetchDepartments();
      } catch (error) {
        this.showSnackbar(error.message || "An error occurred", "error");
      }
    },
  },

  async created() {
    try {
      await this.fetchDepartments();
    } catch (error) {
      this.showSnackbar(error.message || "Failed to fetch departments", "error");
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