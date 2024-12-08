<template>
  <div class="ma-4">
    <v-card elevation="2" class="rounded-lg">
      <v-card-title
        class="d-flex justify-space-between align-center pa-4 bg-grey-lighten-4"
      >
        <span class="text-h5 font-weight-medium">Documents</span>
        <v-btn
          color="primary"
          :to="{ name: 'uploads' }"
          prepend-icon="mdi-upload"
          class="text-none"
        >
          Upload Document
        </v-btn>
      </v-card-title>

      <v-tabs v-model="activeTab" background-color="primary" dark>
        <v-tab :value="0"> All </v-tab>
        <v-tab
          v-for="status in statuses"
          :key="status.value"
          :value="status.value"
        >
          {{ status.text }}
          <v-badge
            :content="getStatusCount(status.value)"
            :value="getStatusCount(status.value)"
            color="success"
            class="ml-2"
          ></v-badge>
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-select
              v-model="filters.department"
              :items="departments"
              label="Department"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-data-table
        :headers="headers"
        :items="filteredDocuments"
        :loading="loading"
        :search="search"
        :items-per-page="10"
      >
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(getDisplayStatus(item))" small>
            {{ getDisplayStatus(item) }}
          </v-chip>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="primary"
                  class="mr-1"
                  v-bind="attrs"
                  v-on="on"
                  @click="download(item)"
                >
                  <v-icon size="18">mdi-download</v-icon>
                </v-btn>
              </template>
              <span>Download</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="warning"
                  class="mr-1"
                  v-bind="attrs"
                  v-on="on"
                  @click="openStatusDialog(item)"
                >
                  <v-icon size="18">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Update Status</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                  @click="confirmDelete(item)"
                >
                  <v-icon size="18">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>

      <v-dialog v-model="statusDialog.show" max-width="400">
        <v-card>
          <v-card-title>Update Status</v-card-title>
          <v-card-text>
            <v-select
              v-model="statusDialog.status"
              :items="statuses"
              item-text="text"
              item-value="value"
              label="Status"
            ></v-select>
            <v-textarea
              v-model="statusDialog.remarks"
              label="Remarks"
              rows="3"
              placeholder="Add remarks about this status change"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="statusDialog.show = false">Cancel</v-btn>
            <v-btn color="primary" @click="updateStatus" :loading="updating"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog.show" max-width="400">
        <v-card>
          <v-card-title>Delete Document</v-card-title>
          <v-card-text>
            Are you sure you want to delete this document?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog.show = false">Cancel</v-btn>
            <v-btn color="error" @click="deleteDocument" :loading="deleting"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { format } from "date-fns";

export default {
  data: () => ({
    activeTab: 0,
    search: "",
    updating: false,
    deleting: false,
    filters: {
      department: null,
    },
    headers: [
      { text: "Name", value: "name" },
      { text: "Recipient", value: "department" },
      { text: "Status", value: "status" },
      { text: "Remarks", value: "remarks" },
      { text: "Uploaded By", value: "uploadedBy.username" },
      { text: "Updated By", value: "updatedBy.username" },
      { text: "Date", value: "createdAt" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    departments: ["Program Head", "Librarian", "Guidance Office", "Registrar"],
    statuses: [
      { text: "Incoming", value: "incoming" },
      { text: "Outgoing", value: "outgoing" },
      { text: "Received", value: "received" },
      { text: "Returned", value: "returned" },
      { text: "Cancelled", value: "cancelled" },
      { text: "Approved", value: "approved" },
      { text: "Rejected", value: "rejected" },
    ],
    statusDialog: {
      show: false,
      status: null,
      remarks: "",
      document: null,
    },
    deleteDialog: {
      show: false,
      document: null,
    },
  }),

  computed: {
    ...mapState("documents", ["documents", "loading"]),

    filteredDocuments() {
      if (!this.documents) return [];

      const filtered = this.documents.filter((doc) => {
        const departmentMatch =
          !this.filters.department ||
          doc.department === this.filters.department;

        if (this.activeTab === 0) return departmentMatch;

        const statusMap = {
          1: "incoming",
          2: "outgoing",
          3: "received",
          4: "returned",
          5: "cancelled",
          6: "approved",
          7: "rejected",
        };

        // Get the display status based on uploader
        let displayStatus = doc.status;
        if (doc.status === "incoming" || doc.status === "outgoing") {
          displayStatus = this.isCurrentUserUploader(doc)
            ? "outgoing"
            : "incoming";
        }

        return departmentMatch && displayStatus === statusMap[this.activeTab];
      });

      return filtered;
    },
  },

  methods: {
    ...mapActions("documents", [
      "fetchDocuments",
      "updateDocumentStatus",
      "deleteDocument",
      "downloadDocument",
    ]),

    isCurrentUserUploader(document) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      return document.uploadedBy?._id === currentUser._id;
    },

    getDisplayStatus(document) {
      if (document.status === "incoming" || document.status === "outgoing") {
        const isUploader = this.isCurrentUserUploader(document);
        return isUploader ? "outgoing" : "incoming";
      }
      return document.status;
    },

    getUserRole() {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.role;
      }
      return null;
    },

    getStatusColor(status) {
      const colorMapping = {
        approved: "success",
        rejected: "error",
        incoming: "primary",
        outgoing: "secondary",
        received: "success",
        returned: "warning",
        cancelled: "error",
      };

      return colorMapping[status] || "default";
    },

    getStatusCount(status) {
  if (!this.documents) return 0;
  
  if (status === 'incoming') {
    return this.documents.filter((doc) => {
      const isUploader = this.isCurrentUserUploader(doc);
      return !isUploader && (doc.status === 'incoming' || doc.status === 'outgoing');
    }).length;
  }
  
  return 0;
},

    formatDate(date) {
      return format(new Date(date), "MMM dd, yyyy");
    },

    openStatusDialog(document) {
      this.statusDialog = {
        show: true,
        status: document.status.toLowerCase().replace(" ", "-"),
        remarks: document.remarks || "",
        document,
      };
    },

    async updateStatus() {
      try {
        this.updating = true;
        await this.updateDocumentStatus({
          id: this.statusDialog.document._id,
          data: {
            status: this.statusDialog.status,
            remarks: this.statusDialog.remarks,
          },
        });
        this.statusDialog.show = false;
      } catch (error) {
        console.error("Failed to update status:", error);
      } finally {
        this.updating = false;
      }
    },

    confirmDelete(document) {
      this.deleteDialog = {
        show: true,
        document,
      };
    },

    async deleteDocument() {
      try {
        this.deleting = true;
        await this.deleteDocument(this.deleteDialog.document._id);
        this.deleteDialog.show = false;
      } catch (error) {
        console.error("Failed to delete document:", error);
      } finally {
        this.deleting = false;
      }
    },
    async download(item) {
      try {
        await this.downloadDocument(item);
      } catch (error) {
        console.error("Download failed:", error);
      }
    },
  },

  async created() {
    await this.fetchDocuments({ department: this.getUserRole() });
  },

  watch: {
    activeTab() {
      this.search = "";
      this.filters.department = null;
    },
  },
};
</script>
