<template>
  <v-container fluid class="pa-6">
    <!-- Search and Filter Header -->
    <v-card class="mb-6 rounded-lg" elevation="3">
      <v-card-text>
        <v-row align="center" justify="center" class="mx-2">
          <v-col cols="12" md="6" lg="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search documents"
              outlined
              dense
              hide-details
              class="rounded-lg"
              clearable
              background-color="grey lighten-4"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="departmentFilter"
              :items="departments"
              label="Department"
              outlined
              dense
              hide-details
              class="rounded-lg"
              clearable
              background-color="grey lighten-4"
              prepend-inner-icon="mdi-domain"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="statusFilter"
              :items="statuses"
              label="Status"
              outlined
              dense
              hide-details
              class="rounded-lg"
              clearable
              background-color="grey lighten-4"
              prepend-inner-icon="mdi-filter-variant"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="d-flex justify-center align-center"
      style="height: 400px"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>

    <!-- Document Cards Grid -->
    <v-row v-else>
      <v-col
        v-for="doc in filteredDocuments"
        :key="doc._id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            class="mx-auto document-card transition-swing"
            :elevation="hover ? 8 : 2"
            :class="{ 'on-hover': hover }"
          >
            <v-card-title class="py-2 px-4 d-flex align-center primary">
              <v-icon large color="white" class="mr-2">
                {{ getDocumentIcon(doc.fileUrl) }}
              </v-icon>
              <span class="white--text text-truncate">{{ doc.name }}</span>
            </v-card-title>

            <v-card-text class="pa-4">
              <div class="document-info">
                <div class="d-flex align-center mb-2">
                  <v-icon small color="grey darken-1" class="mr-2"
                    >mdi-domain</v-icon
                  >
                  <span class="body-2">{{ doc.department }}</span>
                </div>

                <div class="d-flex align-center mb-2">
                  <v-icon small color="grey darken-1" class="mr-2"
                    >mdi-account</v-icon
                  >
                  <span class="body-2">{{ doc.uploadedBy?.username }}</span>
                </div>

                <!-- Date -->
                <div class="d-flex align-center">
                  <v-icon small color="grey darken-1" class="mr-2"
                    >mdi-calendar</v-icon
                  >
                  <span class="body-2">{{ formatDate(doc.createdAt) }}</span>
                </div>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <!-- Card Actions -->
            <v-card-actions class="pa-4">
              <v-btn
                text
                small
                color="primary"
                @click="downloadDocument(doc.fileUrl)"
                class="px-2"
              >
                <v-icon left size="18">mdi-download</v-icon>
                Download
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text small @click="showDetails(doc)" class="px-2">
                <v-icon left size="18">mdi-information</v-icon>
                Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card
      v-if="!loading && filteredDocuments.length === 0"
      class="text-center pa-8 mt-4"
      outlined
    >
      <v-icon size="64" color="grey lighten-1">mdi-file-search-outline</v-icon>
      <h3 class="text-h6 grey--text mt-4">No documents found</h3>
      <p class="text-body-2 grey--text text--darken-1">
        Try adjusting your search criteria or filters
      </p>
    </v-card>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="500" scrollable>
      <v-card v-if="selectedDocument">
        <v-toolbar flat dense color="primary" dark>
          <v-toolbar-title>Document Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-4">
          <v-list dense>
            <v-list-item>
              <v-list-item-avatar color="primary" class="mr-3">
                <v-icon dark>mdi-file</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle class="text-subtitle-2 mb-1"
                  >Name</v-list-item-subtitle
                >
                <v-list-item-title>{{
                  selectedDocument.name
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item>
              <v-list-item-avatar color="primary" class="mr-3">
                <v-icon dark>mdi-domain</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle class="text-subtitle-2 mb-1"
                  >Department</v-list-item-subtitle
                >
                <v-list-item-title>{{
                  selectedDocument.department
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item>
              <v-list-item-avatar color="primary" class="mr-3">
                <v-icon dark>mdi-account</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle class="text-subtitle-2 mb-1"
                  >Uploaded By</v-list-item-subtitle
                >
                <v-list-item-title>{{
                  selectedDocument.uploadedBy?.username
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <template v-if="selectedDocument.remarks">
              <v-divider class="my-2"></v-divider>
              <v-list-item>
                <v-list-item-avatar color="primary" class="mr-3">
                  <v-icon dark>mdi-comment-text</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-subtitle-2 mb-1"
                    >Remarks</v-list-item-subtitle
                  >
                  <v-list-item-title>{{
                    selectedDocument.remarks
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="downloadDocument(selectedDocument.fileUrl)"
          >
            <v-icon left>mdi-download</v-icon>
            Download
          </v-btn>
          <v-btn color="grey" text @click="detailsDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "DocumentLibrary",

  data() {
    return {
      search: "",
      departmentFilter: null,
      statusFilter: null,
      detailsDialog: false,
      selectedDocument: null,
      departments: ["HR", "Finance", "IT"],
      statuses: ["incoming", "processing", "completed"],
    };
  },

  computed: {
    ...mapState("documents", ["documents", "loading", "error"]),

    filteredDocuments() {
      return this.documents.filter((doc) => {
        const matchesSearch =
          !this.search ||
          doc.name.toLowerCase().includes(this.search.toLowerCase());
        const matchesDepartment =
          !this.departmentFilter || doc.department === this.departmentFilter;
        const matchesStatus =
          !this.statusFilter || doc.status === this.statusFilter;

        return matchesSearch && matchesDepartment && matchesStatus;
      });
    },
  },

  methods: {
    ...mapActions("documents", ["fetchDocuments"]),

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    getStatusColor(status) {
      return (
        {
          incoming: "#1976D2",
          processing: "#FB8C00",
          completed: "#43A047",
        }[status] || "grey"
      );
    },

    getDocumentIcon(fileUrl) {
      const ext = fileUrl.split(".").pop().toLowerCase();
      return (
        {
          pdf: "mdi-file-pdf-box",
          doc: "mdi-file-word-box",
          txt: "mdi-file-word-box",
          docx: "mdi-file-word-box",
          xls: "mdi-file-excel-box",
          xlsx: "mdi-file-excel-box",
          ppt: "mdi-file-powerpoint-box",
          pptx: "mdi-file-powerpoint-box",
          jpg: "mdi-file-image-box",
          jpeg: "mdi-file-image-box",
          png: "mdi-file-image-box",
          zip: "mdi-folder-zip",
          rar: "mdi-folder-zip",
          "7z": "mdi-folder-zip",
          tar: "mdi-folder-zip",
          gz: "mdi-folder-zip",
        }[ext] || "mdi-file-document-box"
      );
    },

    downloadDocument(fileUrl) {
      window.open(fileUrl, "_blank");
    },

    showDetails(document) {
      this.selectedDocument = document;
      this.detailsDialog = true;
    },
  },

  created() {
    this.fetchDocuments();
  },
};
</script>

<style scoped>
.document-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.document-info {
  min-height: 100px;
}

.on-hover {
  transform: translateY(-5px);
}

.transition-swing {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.v-card__title {
  word-break: break-word;
  white-space: normal;
  line-height: 1.2;
}
</style>
