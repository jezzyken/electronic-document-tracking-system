<template>
  <v-container fluid v-if="documentPermissions.canView">
    <v-card>
      <v-card-title>
        <v-row align="center" justify="space-between">
          <v-col cols="12" sm="4">
            <v-btn
              v-if="documentPermissions.canCreate"
              color="primary"
              @click="showNewDocumentDialog = true"
            >
              <v-icon left>mdi-plus</v-icon>
              New Document
            </v-btn>
          </v-col>


          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search Documents"
              single-line
              hide-details
              dense
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>

      <v-tabs v-model="activeTab">
        <v-tab>All Documents</v-tab>
        <v-tab>Tracking History</v-tab>
        <v-tab>Document Details</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item>
          <v-data-table
            :headers="headers"
            :items="documents"
            :search="search"
            :items-per-page="10"
            class="elevation-1"
            :loading="loading"
          >
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" small dark>
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:item.priority="{ item }">
              <v-chip :color="getPriorityColor(item.priority)" small dark>
                {{ item.priority }}
              </v-chip>
            </template>
            <template v-slot:item.user.firstName="{ item }">
              {{ getFullName(item.user) }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="
                      canPerformDocumentAction('change_document_status', item)
                    "
                    icon
                    small
                    class="mr-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="addTrackingDialog(item)"
                    :disabled="item.status === 'Completed'"
                  >
                    <v-icon small>mdi-plus-circle</v-icon>
                  </v-btn>
                </template>
                <span>
                  {{
                    item.status === "Completed"
                      ? "Document completed - no further updates allowed"
                      : "Add Tracking Update"
                  }}
                </span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    small
                    class="mr-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="viewHistory(item)"
                  >
                    <v-icon small>mdi-history</v-icon>
                  </v-btn>
                </template>
                <span>View History</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                    @click="viewDetails(item)"
                  >
                    <v-icon small>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <span>View Details</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-tab-item>

        <v-tab-item>
          <v-card flat>
            <v-card-text v-if="selectedDocument">
              <v-row class="mb-4">
                <v-col>
                  <v-btn
                    color="primary"
                    @click="showUpdateForm = true"
                    class="ml-2"
                    :disabled="selectedDocument.status === 'Completed'"
                    v-if="
                      canPerformDocumentAction(
                        'change_document_status',
                        selectedDocument
                      )
                    "
                  >
                    <v-icon left>mdi-plus</v-icon>
                    {{
                      selectedDocument.status === "Completed"
                        ? "Document Completed"
                        : `Add Tracking Update for
                    "${selectedDocument.title}"`
                    }}
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="3">
                  <v-card outlined>
                    <v-card-title>Document Info</v-card-title>
                    <v-card-text>
                      <p>
                        <strong>Title:</strong> {{ selectedDocument.title }}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <v-chip
                          :color="getStatusColor(selectedDocument.status)"
                          x-small
                          dark
                          class="ml-2"
                        >
                          {{ selectedDocument.status }}
                        </v-chip>
                      </p>
                      <p>
                        <strong>Creator:</strong>
                        {{ getFullName(this.selectedDocument.user) }}
                      </p>
                      <p>
                        <strong>Current Department:</strong>
                        {{ selectedDocument.department.name }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="9">
                  <v-timeline dense>
                    <v-timeline-item
                      v-for="(track, index) in selectedDocument.tracking"
                      :key="index"
                      :color="getStatusColor(track.status)"
                      small
                    >
                      <template v-slot:opposite>
                        <span class="caption">{{
                          formatDate(track.sentAt)
                        }}</span>
                      </template>
                      <v-card>
                        <v-card-title class="subtitle-2">
                          {{ track.fromDepartment.name }} →
                          {{ track.toDepartment.name }}
                        </v-card-title>
                        <v-card-text>
                          <v-row v-if="!track.receivedAt" class="mt-2">
                            <v-col>
                              <v-btn
                                v-if="
                                  canPerformDocumentAction(
                                    'recieved_document',
                                    selectedDocument,
                                    index
                                  )
                                "
                                color="primary"
                                small
                                @click="markAsReceived(index)"
                              >
                                <v-icon left small>mdi-check-circle</v-icon>
                                Mark as Received
                              </v-btn>
                            </v-col>
                          </v-row>

                          <v-row v-else class="mt-2">
                            <v-col>
                              <div class="subtitle-2 font-weight-medium">
                                Received By
                              </div>
                              <div class="body-2">
                                {{ track.receivedBy.fullName }}
                              </div>
                              <div class="caption grey--text">
                                Received on: {{ formatDate(track.receivedAt) }}
                              </div>
                            </v-col>
                          </v-row>

                          <v-row class="mb-2">
                            <v-col cols="12">
                              <div class="subtitle-2 font-weight-medium">
                                Submitted By
                              </div>
                              <div class="body-2">
                                {{ getFullName(track.sentBy) }}
                              </div>
                              <div class="caption grey--text">
                                Department: {{ track.fromDepartment.name }}
                              </div>
                            </v-col>
                          </v-row>

                          <div class="mb-2">
                            <v-chip
                              :color="getStatusColor(track.status)"
                              x-small
                              dark
                            >
                              {{ track.status }}
                            </v-chip>
                          </div>
                          <p class="mb-0">{{ track.comments }}</p>

                          <v-expansion-panels
                            v-if="
                              documentPermissions.canViewAttachments &&
                              track.documents?.attachments?.length
                            "
                            flat
                          >
                            <v-expansion-panel>
                              <v-expansion-panel-header>
                                Attachments ({{
                                  track.documents.attachments.length
                                }})
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-list dense>
                                  <v-list-item
                                    v-for="att in track.documents.attachments"
                                    :key="att._id"
                                  >
                                    <v-list-item-icon>
                                      <v-icon small>mdi-file-document</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                      <v-list-item-title>{{
                                        att.title
                                      }}</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                      <v-btn
                                        text
                                        x-small
                                        color="primary"
                                        :href="att.fileUrl"
                                        download
                                      >
                                        View
                                      </v-btn>
                                    </v-list-item-action>
                                  </v-list-item>
                                </v-list>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-card-text>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text v-else>
              <v-alert type="info">
                Please select a document from the All Documents tab to view its
                tracking history
              </v-alert>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- Document Details Tab -->
        <v-tab-item>
          <v-card flat v-if="selectedDocument">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-card outlined>
                    <v-card-title>General Information</v-card-title>
                    <v-list dense>
                      <v-list-item
                        v-for="(value, key) in documentDetails"
                        :key="key"
                      >
                        <v-list-item-content>
                          <v-list-item-title>{{ key }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            value
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-dialog v-model="showUpdateForm" max-width="800px">
      <v-card>
        <v-card-title>
          Add Tracking Update for "{{ selectedDocument?.title }}"
        </v-card-title>
        <v-card-text>
          <v-form ref="updateForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="trackingUpdate.fromDepartment"
                  :items="departmentList"
                  item-text="name"
                  item-value="_id"
                  label="From Department"
                  required
                  :rules="[(v) => !!v || 'From Department is required']"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="trackingUpdate.toDepartment"
                  :items="departmentList"
                  item-text="name"
                  item-value="_id"
                  label="To Department"
                  required
                  :rules="[(v) => !!v || 'To Department is required']"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="trackingUpdate.status"
                  :items="statuses"
                  item-text="name"
                  label="Status"
                  required
                  :rules="[(v) => !!v || 'Status is required']"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-file-input
                  v-if="documentPermissions.canUpload"
                  v-model="trackingUpdate.attachments"
                  label="Attachments"
                  multiple
                  chips
                  counter
                  show-size
                ></v-file-input>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="trackingUpdate.comments"
                  label="Comments"
                  required
                  :rules="[(v) => !!v || 'Comments are required']"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="showUpdateForm = false">
            Cancel
          </v-btn>
          <v-btn
            color="success"
            :disabled="!formValid || isSavingDocument"
            :loading="isSavingDocument"
            @click="submitTrackingUpdate"
          >
            Submit Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showNewDocumentDialog" max-width="800px">
      <v-card>
        <v-card-title>Create New Document</v-card-title>
        <v-card-text>
          <v-form ref="newDocumentForm" v-model="newDocumentFormValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newDocument.title"
                  label="Document Title"
                  required
                  :rules="[(v) => !!v || 'Title is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="newDocument.description"
                  label="Description"
                  required
                  :rules="[(v) => !!v || 'Description is required']"
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="newDocument.toDepartment"
                  :items="departmentList"
                  item-text="name"
                  item-value="_id"
                  label="Forward To Department"
                  required
                  :rules="[
                    (v) => !!v || 'Please select destination department',
                  ]"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="newDocument.priority"
                  :items="['High', 'Medium', 'Low']"
                  label="Priority"
                  required
                  :rules="[(v) => !!v || 'Priority is required']"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-menu
                  v-model="dueDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="newDocument.dueDate"
                      label="Due Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      required
                      :rules="[(v) => !!v || 'Due Date is required']"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="newDocument.dueDate"
                    :min="new Date().toISOString().substr(0,10)"
                    @input="dueDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="newDocument.comments"
                  label="Initial Comments"
                  rows="3"
                  required
                  :rules="[(v) => !!v || 'Initial comments are required']"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="newDocument.attachments"
                  label="Documents"
                  multiple
                  chips
                  counter
                  show-size
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="showNewDocumentDialog = false"
            :disabled="isSavingDocument"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            :disabled="!newDocumentFormValid || isSavingDocument"
            :loading="isSavingDocument"
            @click="createNewDocument"
          >
            Create Document
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showReceiveDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirming</v-card-title>
        <v-card-text>
          Are you sure you want to mark this document as received?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="showReceiveDialog = false">
            Cancel
          </v-btn>
          <v-btn color="success" @click="confirmReceived">
            Yes, Mark as Received
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { permissionMixin } from "@/mixins/permissionMixin";

export default {
  name: "DocumentTrackingPage",
  mixins: [permissionMixin],
  data: () => ({
    search: "",
    activeTab: 0,
    selectedDocument: null,
    headers: [
      { text: "Tracking No.", value: "trackingNumber" },
      { text: "Title", value: "title" },
      { text: "Status", value: "status" },
      { text: "Priority", value: "priority" },
      { text: "Creator", value: "user.firstName" },
      { text: "Department", value: "department.name" },
      {
        text: "Due Date",
        value: "dueDate",
        format: (value) => this.formatDate(value),
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    showNewDocumentDialog: false,
    newDocumentFormValid: false,
    dueDateMenu: false,
    newDocument: {
      title: "",
      description: "",
      priority: "",
      dueDate: "",
      attachments: [],
      toDepartment: "",
      comments: "",
    },
    showUpdateForm: false,
    formValid: false,
    showReceiveDialog: false,
    receiveFormValid: false,
    receiveInfo: {
      fullName: "",
      department: "",
    },
    selectedTrackingIndex: null,
    trackingUpdate: {
      fromDepartment: JSON.parse(localStorage.getItem("user"))?.department?._id || null,
      toDepartment: "",
      status: "",
      comments: "",
      attachments: [],
    },
    userx: JSON.parse(localStorage.getItem("user")),
    isSavingDocument: false,
  }),

  computed: {
    ...mapState({
      loading: (state) => state.documents.loading,
      error: (state) => state.documents.error,
      departments: (state) => state.departments.departments,
      statuses: (state) => state.statuses.statuses,
      user: (state) => state.documents.user,
    }),

    ...mapGetters("documents", [
      "documents",
      "documentsByStatus",
      "documentsByDepartment",
    ]),

    departmentList() {
      return this.departments
        .filter((dept) => dept.isActive)
        .map((dept) => ({
          _id: dept._id,
          name: dept.name,
        }));
    },

    documentDetails() {
      if (!this.selectedDocument) return {};
      return {
        "Document Title": this.selectedDocument.title,
        Description: this.selectedDocument.description,
        "Created By": this.getFullName(this.selectedDocument.user),
        "Created Date": this.formatDate(this.selectedDocument.createdAt),
        "Current Status": this.selectedDocument.status,
        "Due Date": this.formatDate(this.selectedDocument.dueDate),
      };
    },

    filteredDocuments() {
      if (!this.documentPermissions.canView) return [];

      return this.documents.filter((doc) => {
        if (this.isDocumentEditor(doc)) return true;

        return this.isInDocumentWorkflow(doc);
      });
    },

    documentPermissions() {
      return {
        canView: this.hasPermission("view"),
        canCreate: this.hasPermission("create"),
        canUpdate: this.hasPermission("update"),
        canDelete: this.hasPermission("delete"),
        canUpload: this.hasPermission("upload_attachments"),
        canViewAttachments: this.hasPermission("view_attachments"),
        canReceive: this.hasPermission("recieved_document"),
      };
    },

    selectedDocumentPermissions() {
      if (!this.selectedDocument) return {};

      return {
        canEdit: this.canPerformDocumentAction("update", this.selectedDocument),
        canDelete: this.canPerformDocumentAction(
          "delete",
          this.selectedDocument
        ),
        canChangeStatus: this.canPerformDocumentAction(
          "change_document_status",
          this.selectedDocument
        ),
        canReceive: this.canPerformDocumentAction(
          "recieved_document",
          this.selectedDocument
        ),
      };
    },
  },

  methods: {
    ...mapActions({
      fetchDocuments: "documents/fetchDocuments",
      createDocument: "documents/createDocument",
      addTracking: "documents/addTracking",
      updateTracking: "documents/updateTracking",
      updateDocumentStatus: "documents/updateDocumentStatus",
      fetchDepartments: "departments/fetchDepartments",
      fetchStatuses: "statuses/fetchStatuses",
      updateTracking: "documents/updateTracking",
    }),

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    async createNewDocument() {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!this.documentPermissions.canCreate) {
        this.$toast.error("Insufficient permissions");
        return;
      }

      if (!this.$refs.newDocumentForm.validate()) return;

      this.isSavingDocument = true;

      const currentUser = {
        _id: user._id,
        department: user.department?._id,
      };

      const attachments = this.newDocument.attachments
        ? this.newDocument.attachments.map((file, index) => ({
            _id: `att_init_${Date.now()}_${index}`,
            title: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedBy: currentUser._id,
            uploadedAt: new Date().toISOString(),
          }))
        : [];

      const newDoc = {
        documents: {
          title: this.newDocument.title,
          description: this.newDocument.description,
          user: currentUser._id,
          createdAt: new Date().toISOString(),
          status: "Under Review",
          priority: this.newDocument.priority,
          dueDate: new Date(this.newDocument.dueDate).toISOString(),
          department: currentUser.department,
        },
        tracking: [
          {
            fromDepartment: currentUser.department,
            toDepartment: this.newDocument.toDepartment,
            documents: {
              attachments: attachments,
            },
            sentBy: currentUser._id,
            receivedBy: null,
            sentAt: new Date().toISOString(),
            receivedAt: null,
            status: "Under Review",
            comments: this.newDocument.comments,
          },
        ],
        newDocument: this.newDocument,
      };

      try {
        await this.createDocument(newDoc);
        this.showNewDocumentDialog = false;
        this.$refs.newDocumentForm.reset();
      } catch (error) {
        console.error("Failed to create document:", error);
      } finally {
        this.isSavingDocument = false;
      }
    },

    async submitTrackingUpdate() {
      if (!this.selectedDocumentPermissions.canChangeStatus) {
        console.error("Insufficient permissions");
        return;
      }

      if (!this.$refs.updateForm.validate()) return;

      const user = JSON.parse(localStorage.getItem("user"));

      this.isSavingDocument = true;

      try {
        const data = {
          documentId: this.selectedDocument._id,
          trackingData: { ...this.trackingUpdate, sentBy: user._id },
        };
        await this.addTracking(data);
        this.showUpdateForm = false;
      } catch (error) {
        console.log(error);
      } finally {
        this.isSavingDocument = false;
      }
    },

    markAsReceived(trackingIndex) {
      if (
        !this.canPerformDocumentAction(
          "recieved_document",
          this.selectedDocument
        )
      ) {
        console.error("You do not have permission to receive this document");
        return;
      }

      this.selectedTrackingIndex = trackingIndex;
      this.showReceiveDialog = true;
    },

    async confirmReceived() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const tracking =
          this.selectedDocument.tracking[this.selectedTrackingIndex];

        const response = await this.updateTracking({
          documentId: this.selectedDocument._id,
          trackingId: tracking._id,
          trackingData: {
            receivedBy: user._id,
            receivedAt: new Date().toISOString(),
          },
        });

        this.showReceiveDialog = false;
        this.selectedTrackingIndex = null;
      } catch (error) {
        console.log(error);
      }
    },

    getFullName(user) {
      if (!user) return "Admin";
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      if (user.firstName) {
        return user.firstName;
      }
      if (user.lastName) {
        return user.lastName;
      }
      return "Admin";
    },

    getStatusColor(statusName) {
      const status = this.statuses.find((s) => s.name === statusName);
      return status ? status.color : "grey";
    },

    getPriorityColor(priority) {
      const colors = {
        High: "red",
        Medium: "orange",
        Low: "green",
      };
      return colors[priority] || "grey";
    },
    viewHistory(item) {
      this.selectedDocument = item;
      this.activeTab = 1;
    },
    viewDetails(item) {
      this.selectedDocument = item;
      this.activeTab = 2;
    },

    addTrackingDialog(document) {
      this.selectedDocument = document;
      this.showUpdateForm = true;
    },
  },

  async created() {
    try {
      await Promise.all([
        this.fetchDocuments(),
        this.fetchDepartments(),
        this.fetchStatuses(),
      ]);

      if (this.documents.length) {
        this.selectedDocument = this.documents[0];
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}
</style>
