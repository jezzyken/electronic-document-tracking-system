<template>
  <v-container>
    <v-card elevation="2">
      <v-card-title class="d-flex align-center py-3 px-4">
        <h2 class="text-h5 font-weight-bold mb-0">Document Requests</h2>
      </v-card-title>

      <v-divider></v-divider>

      <v-toolbar flat class="px-4">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.studentId"
              label="Student ID"
              prepend-inner-icon="mdi-account"
              dense
              outlined
              rounded
              hide-details
              class="mt-6"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Status"
              prepend-inner-icon="mdi-filter-variant"
              dense
              outlined
              rounded
              hide-details
              class="mt-6"
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="requests"
        :loading="loading"
        :footer-props="{
          'items-per-page-options': [5, 10, 15, 20],
          showFirstLastPage: true,
        }"
        class="elevation-0"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            small
            label
            text-color="white"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="primary"
                @click="viewRequest(item)"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View Request</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="info"
                @click="openUpdateDialog(item)"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                :disabled="item.status === 'completed'"
              >
                <v-icon small>mdi-update</v-icon>
              </v-btn>
            </template>
            <span>{{
              item.status === "completed"
                ? "Cannot update completed requests"
                : "Update Status"
            }}</span>
          </v-tooltip>

          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="error"
                @click="confirmDelete(item)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete Request</span>
          </v-tooltip> -->
        </template>

        <template v-slot:no-data>
          <v-alert type="info" class="ma-4" text>No requests found</v-alert>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="updateDialog" max-width="500">
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h6">Update Request Status</span>
        </v-card-title>

        <v-card-text>
          <v-select
            v-model="statusUpdate.status"
            :items="statusOptions"
            label="New Status"
            outlined
            dense
            class="mb-4"
          ></v-select>
          <v-textarea
            v-model="statusUpdate.notes"
            label="Notes"
            outlined
            dense
            rows="3"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="py-3 px-4">
          <v-spacer></v-spacer>
          <v-btn
            text
            color="grey darken-1"
            @click="updateDialog = false"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn color="primary" @click="updateRequest" :loading="loading">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewDialog" max-width="800">
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h6">Request Details</span>
          <v-spacer></v-spacer>
          <v-chip
            v-if="selectedRequest"
            :color="getStatusColor(selectedRequest.status)"
            label
            text-color="white"
          >
            {{ selectedRequest?.status }}
          </v-chip>
        </v-card-title>

        <v-card-text v-if="selectedRequest">
          <v-row>
            <v-col cols="6">
              <p>
                <strong>Tracking Number:</strong>
                {{ selectedRequest.trackingNumber }}
              </p>
              <p><strong>Full Name:</strong> {{ selectedRequest.fullName }}</p>
              <p>
                <strong>Student ID:</strong> {{ selectedRequest.studentId }}
              </p>
              <p><strong>Email:</strong> {{ selectedRequest.email }}</p>
              <p><strong>Phone:</strong> {{ selectedRequest.phone }}</p>
            </v-col>
            <v-col cols="6">
              <p><strong>Purpose:</strong> {{ selectedRequest.purpose }}</p>
              <p><strong>Requested Documents:</strong></p>
              <ul>
                <li
                  v-for="doc in selectedRequest.requestedDocuments"
                  :key="doc"
                >
                  {{ doc }}
                </li>
              </ul>
              <p><strong>Notes:</strong> {{ selectedRequest.notes }}</p>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <h3 class="text-h6 mb-4">Status History</h3>
          <v-timeline dense>
            <v-timeline-item
              v-for="(history, index) in selectedRequest.statusHistory"
              :key="index"
              :color="getStatusColor(history.status)"
              small
            >
              <template v-slot:opposite>
                {{ new Date(history.timestamp).toLocaleDateString() }}
              </template>
              <v-card class="elevation-1">
                <v-card-text>
                  <p class="mb-0">
                    <strong>Status:</strong> {{ history.status }}
                  </p>
                  <p class="mb-0" v-if="history.notes">
                    <strong>Notes:</strong> {{ history.notes }}
                  </p>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>

        <v-card-actions class="py-3 px-4">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="viewDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="py-3 px-4">
          <span class="text-h6">Delete Request</span>
        </v-card-title>

        <v-card-text class="pt-3">
          Are you sure you want to delete this request? This action cannot be
          undone.
        </v-card-text>

        <v-card-actions class="py-3 px-4">
          <v-spacer></v-spacer>
          <v-btn
            text
            color="grey darken-1"
            @click="deleteDialog = false"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn color="error" @click="deleteRequest" :loading="loading">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      top
      right
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DocumentRequestList",
  data() {
    return {
      headers: [
        { text: "Tracking Number", value: "trackingNumber" },
        { text: "Full Name", value: "fullName" },
        { text: "Student ID", value: "studentId" },
        { text: "Status", value: "status" },
        { text: "Created At", value: "createdAt" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      options: {},
      filters: {
        studentId: "",
        status: "",
      },
      deleteDialog: false,
      updateDialog: false,
      viewDialog: false,
      selectedRequest: null,
      statusUpdate: {
        status: "",
        notes: "",
      },
      statusOptions: [
        "pending",
        "processing",
        "ready",
        "completed",
        "cancelled",
        "rejected",
      ],
      snackbar: {
        show: false,
        text: "",
        color: "",
      },
    };
  },
  computed: {
    ...mapGetters("documentRequest", ["requests", "loading", "pagination"]),
  },
  methods: {
    ...mapActions("documentRequest", [
      "fetchRequests",
      "deleteRequest",
      "updateRequestStatus",
      "fetchRequest",
    ]),

    showSnackbar(text, color = "success") {
      this.snackbar = {
        show: true,
        text,
        color,
      };
    },
    getStatusColor(status) {
      const colors = {
        pending: "warning",
        processing: "info",
        ready: "success",
        completed: "success",
        cancelled: "error",
        rejected: "error",
      };
      return colors[status] || "grey";
    },
    async fetchData() {
      const params = {
        page: this.options.page,
        limit: this.options.itemsPerPage,
        ...this.filters,
      };
      await this.fetchRequests(params);
    },
    viewRequest(request) {
      this.selectedRequest = request;
      this.viewDialog = true;
    },
    openUpdateDialog(request) {
      if (request.status === "completed") {
        this.showSnackbar("Completed requests cannot be updated", "warning");
        return;
      }
      this.selectedRequest = request;
      this.statusUpdate = {
        status: request.status,
        notes: "",
      };
      this.updateDialog = true;
    },
    async updateRequest() {
      if (!this.selectedRequest || !this.statusUpdate.status) return;

      if (this.selectedRequest.status === "completed") {
        this.showSnackbar("Completed requests cannot be updated", "warning");
        this.updateDialog = false;
        return;
      }

      try {
        await this.updateRequestStatus({
          trackingNumber: this.selectedRequest.trackingNumber,
          statusData: {
            status: this.statusUpdate.status,
            notes: this.statusUpdate.notes,
          },
        });
        this.showSnackbar("Status updated successfully");
        this.updateDialog = false;
        this.fetchData();
      } catch (error) {
        this.showSnackbar("Failed to update status", "error");
      }
    },
    confirmDelete(request) {
      this.selectedRequest = request;
      this.deleteDialog = true;
    },
    async deleteRequest() {
      if (this.selectedRequest) {
        try {
          await this.deleteRequest(this.selectedRequest.trackingNumber);
          this.showSnackbar("Request deleted successfully");
          this.deleteDialog = false;
          this.selectedRequest = null;
          this.fetchData();
        } catch (error) {
          this.showSnackbar("Failed to delete request", "error");
        }
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
