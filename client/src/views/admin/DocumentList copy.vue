<!-- DocumentTrackingPage.vue -->
<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-row align="center" justify="space-between">
          <!-- <v-col cols="12" sm="4">
            <h2>Document Tracking System</h2>
          </v-col> -->
          <v-col cols="12" sm="4">
            <!-- Add New Document Button -->
            <v-btn color="primary" @click="showNewDocumentDialog = true">
              <v-icon left>mdi-plus</v-icon>
              New Document
            </v-btn>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search Documents" single-line hide-details
              dense outlined></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>

      <v-tabs v-model="activeTab">
        <v-tab>All Documents</v-tab>
        <v-tab>Tracking History</v-tab>
        <v-tab>Document Details</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <!-- All Documents Tab -->
        <v-tab-item>
          <v-data-table :headers="headers" :items="documents" :search="search" :items-per-page="10" class="elevation-1">
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" small>
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:item.priority="{ item }">
              <v-chip :color="getPriorityColor(item.priority)" small>
                {{ item.priority }}
              </v-chip>
            </template>
            <!-- Modify the data table actions column -->
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon small class="mr-2" v-bind="attrs" v-on="on" @click="addTracking(item)"
                    :disabled="item.status === 'Completed'">
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
                  <v-btn icon small class="mr-2" v-bind="attrs" v-on="on" @click="viewHistory(item)">
                    <v-icon small>mdi-history</v-icon>
                  </v-btn>
                </template>
                <span>View History</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon small v-bind="attrs" v-on="on" @click="viewDetails(item)">
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
                  <v-btn color="primary" @click="showUpdateForm = true" class="ml-2"
                    :disabled="selectedDocument.status === 'Completed'">
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
                        <v-chip :color="getStatusColor(selectedDocument.status)" x-small>
                          {{ selectedDocument.status }}
                        </v-chip>
                      </p>
                      <p>
                        <strong>Creator:</strong>
                        {{ selectedDocument.creator.fullName }}
                      </p>
                      <p>
                        <strong>Current Department:</strong>
                        {{ selectedDocument.currentDepartment.name }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="9">
                  <v-timeline dense>
                    <v-timeline-item v-for="(track, index) in selectedDocument.tracking" :key="index"
                      :color="getStatusColor(track.status)" small>
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
                              <v-btn color="primary" small @click="markAsReceived(index)">
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
                                Sent By
                              </div>
                              <div class="body-2">
                                {{ track.sentBy.fullName }}
                              </div>
                              <div class="caption grey--text">
                                Department: {{ track.sentBy.department }}
                              </div>
                            </v-col>
                          </v-row>

                          <div class="mb-2">
                            <v-chip :color="getStatusColor(track.status)" x-small>
                              {{ track.status }}
                            </v-chip>
                          </div>
                          <p class="mb-0">{{ track.comments }}</p>

                          <!-- Attachments Section -->
                          <v-expansion-panels v-if="track.documents?.attachments?.length" flat>
                            <v-expansion-panel>
                              <v-expansion-panel-header>
                                Attachments ({{
                                  track.documents.attachments.length
                                }})
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-list dense>
                                  <v-list-item v-for="att in track.documents.attachments" :key="att._id">
                                    <v-list-item-icon>
                                      <v-icon small>mdi-file-document</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                      <v-list-item-title>{{ att.title }}</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                      <v-btn text x-small color="primary" :href="att.fileUrl">
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
                      <v-list-item v-for="(value, key) in documentDetails" :key="key">
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
                <v-col cols="12" md="6">
                  <!-- <v-card outlined>
                    <v-card-title>Document Statistics</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col
                          v-for="(stat, index) in documentStats"
                          :key="index"
                          cols="6"
                        >
                          <v-card outlined class="text-center">
                            <v-card-text>
                              <div
                                class="text-h4 font-weight-bold"
                                :class="`${stat.color}--text`"
                              >
                                {{ stat.value }}
                              </div>
                              <div class="text-subtitle-1 grey--text">
                                {{ stat.title }}
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card> -->
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- Add this template section right before the closing </v-container> tag -->
    <v-dialog v-model="showUpdateForm" max-width="800px">
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
          class="mb-2"
          :disabled="!selectedDocument"
        >
          Add Tracking Update
        </v-btn>
      </template> -->

      <v-card>
        <v-card-title>
          Add Tracking Update for "{{ selectedDocument?.title }}"
        </v-card-title>
        <v-card-text>
          <v-form ref="updateForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="trackingUpdate.fromDepartment" :items="departmentList" item-text="name"
                  item-value="_id" label="From Department" required
                  :rules="[(v) => !!v || 'From Department is required']"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="trackingUpdate.toDepartment" :items="departmentList" item-text="name"
                  item-value="_id" label="To Department" required
                  :rules="[(v) => !!v || 'To Department is required']"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="trackingUpdate.status" :items="statusOptions" label="Status" required
                  :rules="[(v) => !!v || 'Status is required']"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-file-input v-model="trackingUpdate.attachments" label="Attachments" multiple chips counter
                  show-size></v-file-input>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="trackingUpdate.comments" label="Comments" required
                  :rules="[(v) => !!v || 'Comments are required']" rows="3"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="showUpdateForm = false">
            Cancel
          </v-btn>
          <v-btn color="success" :disabled="!formValid" @click="submitTrackingUpdate">
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
                <v-text-field v-model="newDocument.title" label="Document Title" required
                  :rules="[(v) => !!v || 'Title is required']"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="newDocument.description" label="Description" required
                  :rules="[(v) => !!v || 'Description is required']"></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="newDocument.toDepartment" :items="departmentList" item-text="name" item-value="_id"
                  label="Forward To Department" required :rules="[
                    (v) => !!v || 'Please select destination department',
                  ]"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="newDocument.priority" :items="['High', 'Medium', 'Low']" label="Priority" required
                  :rules="[(v) => !!v || 'Priority is required']"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-menu v-model="dueDateMenu" :close-on-content-click="false" transition="scale-transition" offset-y
                  min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="newDocument.dueDate" label="Due Date" readonly v-bind="attrs" v-on="on"
                      required :rules="[(v) => !!v || 'Due Date is required']"></v-text-field>
                  </template>
                  <v-date-picker v-model="newDocument.dueDate" @input="dueDateMenu = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="newDocument.comments" label="Initial Comments" rows="3" required
                  :rules="[(v) => !!v || 'Initial comments are required']"></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-file-input v-model="newDocument.attachments" label="Documents" multiple chips counter
                  show-size></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="showNewDocumentDialog = false">
            Cancel
          </v-btn>
          <v-btn color="success" :disabled="!newDocumentFormValid" @click="createNewDocument">
            Create Document
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showReceiveDialog" max-width="500px">
      <v-card>
        <v-card-title>Mark Document as Received</v-card-title>
        <v-card-text>
          <v-form ref="receiveForm" v-model="receiveFormValid">
            <v-text-field v-model="receiveInfo.fullName" label="Receiver's Full Name" required
              :rules="[(v) => !!v || 'Full Name is required']"></v-text-field>
            <v-text-field v-model="receiveInfo.department" label="Receiver's Department" required
              :rules="[(v) => !!v || 'Department is required']"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="showReceiveDialog = false">
            Cancel
          </v-btn>
          <v-btn color="success" :disabled="!receiveFormValid" @click="confirmReceived">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "DocumentTrackingPage",
  data: () => ({
    search: "",
    activeTab: 0,
    selectedDocument: null,
    headers: [
      { text: "Title", value: "title" },
      { text: "Status", value: "status" },
      { text: "Priority", value: "priority" },
      { text: "Creator", value: "creator.fullName" },
      { text: "Department", value: "currentDepartment.name" },
      { text: "Due Date", value: "dueDate" },
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
    statusOptions: [
      "Under Review",
      "Approved",
      "Revision Requested",
      "Budget Review",
      "Final Review",
      "Completed",
    ],
    departmentList: [
      { _id: "d1", name: "Dean's Office" },
      { _id: "d2", name: "Computer Science Department" },
      { _id: "d3", name: "Department of Graduate Studies" },
      { _id: "d4", name: "Research Office" },
      { _id: "d6", name: "Academic Affairs" },
      { _id: "d8", name: "Physics Department" },
      { _id: "d9", name: "Department Committee" },
    ],
    showReceiveDialog: false,
    receiveFormValid: false,
    receiveInfo: {
      fullName: "",
      department: "",
    },
    selectedTrackingIndex: null,
    trackingUpdate: {
      fromDepartment: "",
      toDepartment: "",
      status: "",
      comments: "",
      attachments: [],
      sentBy: {
        _id: "",
        fullName: "",
        department: "",
      },
    },

    documents: [
      {
        _id: "doc1",
        title: "Faculty Promotion Application - Dr. Smith",
        description:
          "Associate Professor promotion application with teaching portfolio",
        creator: {
          _id: "1a1",
          fullName: "Dr. James Smith",
          department: "Physics Department",
        },
        createdAt: "2024-02-15T08:00:00Z",
        status: "Approved",
        priority: "High",
        dueDate: "2024-04-15T00:00:00Z",
        currentDepartment: {
          _id: "d1",
          name: "Dean's Office",
        },
        tracking: [
          {
            fromDepartment: {
              _id: "d8",
              name: "Physics Department",
            },
            toDepartment: {
              _id: "d9",
              name: "Department Committee",
            },
            trackingOfficer: {
              fullName: "Dr. James Smith",
              position: "Associate Professor",
              employeeId: "EMP001",
              email: "james.smith@university.edu",
            },
            documents: {
              attachments: [
                {
                  _id: "att1_1",
                  title: "Teaching Portfolio",
                  fileUrl: "storage/promotions/teaching_portfolio.pdf",
                  fileType: "application/pdf",
                  fileSize: 5242880,
                  uploadedBy: {
                    _id: "1a1",
                    fullName: "Dr. James Smith",
                  },
                  uploadedAt: "2024-02-15T08:05:00Z",
                  status: "Submitted",
                },
              ],
            },
            sentBy: {
              _id: "1a1",
              fullName: "Dr. James Smith",
            },
            receivedBy: {
              _id: "1a2",
              fullName: "Dr. Sarah Johnson",
            },
            sentAt: "2024-02-15T08:10:00Z",
            receivedAt: "2024-02-15T09:00:00Z",
            status: "Under Review",
            comments: "Initial submission for department review",
          },
          {
            fromDepartment: {
              _id: "d9",
              name: "Department Committee",
            },
            toDepartment: {
              _id: "d1",
              name: "Dean's Office",
            },
            trackingOfficer: {
              fullName: "Dr. James Smith",
              position: "Associate Professor",
              employeeId: "EMP001",
              email: "james.smith@university.edu",
            },
            documents: {
              attachments: [
                {
                  _id: "att1_2",
                  title: "Committee Recommendation",
                  fileUrl: "storage/promotions/committee_recommendation.pdf",
                  fileType: "application/pdf",
                  fileSize: 1048576,
                  uploadedBy: {
                    _id: "1a2",
                    fullName: "Dr. Sarah Johnson",
                  },
                  uploadedAt: "2024-03-01T14:00:00Z",
                  status: "Added",
                },
              ],
            },
            sentBy: {
              _id: "1a2",
              fullName: "Dr. Sarah Johnson",
            },
            receivedBy: {
              _id: "1a3",
              fullName: "Dr. Michael Dean",
            },
            sentAt: "2024-03-01T14:30:00Z",
            receivedAt: "2024-03-01T15:00:00Z",
            status: "Approved",
            comments: "Recommended for promotion with strong endorsement",
          },
        ],
      },
      {
        _id: "doc2",
        title: "Student Research Grant Application",
        description: "Research funding request for Advanced AI Project",
        creator: {
          _id: "1a4",
          fullName: "Sarah Chen",
          department: "Computer Science Department",
        },
        createdAt: "2024-03-01T09:00:00Z",
        status: "Under Review",
        priority: "High",
        dueDate: "2024-03-20T00:00:00Z",
        currentDepartment: {
          _id: "d4",
          name: "Research Office",
        },
        tracking: [
          {
            fromDepartment: {
              _id: "d2",
              name: "Computer Science Department",
            },
            toDepartment: {
              _id: "d3",
              name: "Department of Graduate Studies",
            },
            trackingOfficer: {
              fullName: "Dr. James Smith",
              position: "Associate Professor",
              employeeId: "EMP001",
              email: "james.smith@university.edu",
            },
            documents: {
              attachments: [
                {
                  _id: "att2_1",
                  title: "Research Proposal",
                  fileUrl: "storage/grants/research_proposal.pdf",
                  fileType: "application/pdf",
                  fileSize: 1048576,
                  uploadedBy: {
                    _id: "1a4",
                    fullName: "Sarah Chen",
                  },
                  uploadedAt: "2024-03-01T09:10:00Z",
                  status: "Submitted",
                },
              ],
            },
            sentBy: {
              _id: "1a4",
              fullName: "Sarah Chen",
            },
            receivedBy: {
              _id: "1a5",
              fullName: "Robert Brown",
            },
            sentAt: "2024-03-01T09:15:00Z",
            receivedAt: "2024-03-01T10:00:00Z",
            status: "Under Review",
            comments: "Initial submission for department review",
          },
        ],
      },
      {
        _id: "doc3",
        title: "Curriculum Update Request",
        description: "Computer Science Program Curriculum Revision 2024",
        creator: {
          _id: "1a6",
          fullName: "Prof. David Wilson",
          department: "Computer Science Department",
        },
        createdAt: "2024-02-20T10:00:00Z",
        status: "Revision Requested",
        priority: "Medium",
        dueDate: "2024-04-01T00:00:00Z",
        currentDepartment: {
          _id: "d6",
          name: "Academic Affairs",
        },
        tracking: [
          {
            fromDepartment: {
              _id: "d2",
              name: "Computer Science Department",
            },
            toDepartment: {
              _id: "d6",
              name: "Academic Affairs",
            },
            trackingOfficer: {
              fullName: "Dr. James Smith",
              position: "Associate Professor",
              employeeId: "EMP001",
              email: "james.smith@university.edu",
            },
            documents: {
              attachments: [
                {
                  _id: "att3_1",
                  title: "Course Descriptions",
                  fileUrl: "storage/curriculum/course_descriptions.pdf",
                  fileType: "application/pdf",
                  fileSize: 2097152,
                  uploadedBy: {
                    _id: "1a6",
                    fullName: "Prof. David Wilson",
                  },
                  uploadedAt: "2024-02-20T10:05:00Z",
                  status: "Submitted",
                },
              ],
            },
            sentBy: {
              _id: "1a6",
              fullName: "Prof. David Wilson",
            },
            receivedBy: {
              _id: "1a7",
              fullName: "Dr. Emily Martinez",
            },
            sentAt: "2024-02-20T10:15:00Z",
            receivedAt: "2024-02-20T11:00:00Z",
            status: "Under Review",
            comments: "Initial submission of curriculum updates",
          },
          {
            fromDepartment: {
              _id: "d6",
              name: "Academic Affairs",
            },
            toDepartment: {
              _id: "d2",
              name: "Computer Science Department",
            },
            documents: {
              trackingOfficer: {
                fullName: "Dr. James Smith",
                position: "Associate Professor",
                employeeId: "EMP001",
                email: "james.smith@university.edu",
              },
              attachments: [
                {
                  _id: "att3_2",
                  title: "Review Comments",
                  fileUrl: "storage/curriculum/review_comments.pdf",
                  fileType: "application/pdf",
                  fileSize: 1048576,
                  uploadedBy: {
                    _id: "1a7",
                    fullName: "Dr. Emily Martinez",
                  },
                  uploadedAt: "2024-03-05T14:00:00Z",
                  status: "Added",
                },
              ],
            },
            sentBy: {
              _id: "1a7",
              fullName: "Dr. Emily Martinez",
            },
            receivedBy: {
              _id: "1a6",
              fullName: "Prof. David Wilson",
            },
            sentAt: "2024-03-05T14:30:00Z",
            receivedAt: "2024-03-05T15:00:00Z",
            status: "Revision Requested",
            comments:
              "Please revise course prerequisites and learning outcomes",
          },
        ],
      },
    ],
  }),

  computed: {
    documentDetails() {
      if (!this.selectedDocument) return {};
      return {
        "Document Title": this.selectedDocument.title,
        Description: this.selectedDocument.description,
        "Created By": this.selectedDocument.creator.fullName,
        "Created Date": this.formatDate(this.selectedDocument.createdAt),
        "Current Status": this.selectedDocument.status,
        "Due Date": this.formatDate(this.selectedDocument.dueDate),
      };
    },
    documentStats() {
      if (!this.selectedDocument) return [];
      return [
        {
          title: "Days in Process",
          value: this.calculateDaysInProcess(),
          color: "primary",
        },
        {
          title: "Attachments",
          value: this.calculateTotalAttachments(),
          color: "secondary",
        },
        {
          title: "Departments",
          value: this.calculateDepartmentsInvolved(),
          color: "info",
        },
        // {
        //   title: "Version",
        //   value: this.selectedDocument.mainDocument?.version || 1,
        //   color: "success",
        // },
      ];
    },
  },

  methods: {
    submitTrackingUpdate() {
      if (!this.$refs.updateForm.validate()) return;
      if (this.selectedDocument.status === "Completed") {
        return;
      }

      const newUpdate = {
        fromDepartment: this.departmentList.find(
          (d) => d._id === this.trackingUpdate.fromDepartment
        ),
        toDepartment: this.departmentList.find(
          (d) => d._id === this.trackingUpdate.toDepartment
        ),
        documents: {
          attachments: this.trackingUpdate.attachments.map((file, index) => ({
            _id: `att_${Date.now()}_${index}`,
            title: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedBy: this.trackingUpdate.sentBy,
            uploadedAt: new Date().toISOString(),
          })),
        },
        sentBy: this.trackingUpdate.sentBy,
        receivedBy: null,
        sentAt: new Date().toISOString(),
        receivedAt: null,
        status: this.trackingUpdate.status,
        comments: this.trackingUpdate.comments,
      };

      this.selectedDocument.tracking.push(newUpdate);
      this.selectedDocument.status = this.trackingUpdate.status;
      this.showUpdateForm = false;
      this.$refs.updateForm.reset();
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    getStatusColor(status) {
      const colors = {
        "Under Review": "orange",
        Approved: "success",
        Received: "info",
        "Budget Review": "blue",
        "Revision Requested": "warning",
        "Final Review": "purple",
        Completed: "success",
      };
      return colors[status] || "grey";
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
    calculateDaysInProcess() {
      if (!this.selectedDocument) return 0;
      const start = new Date(this.selectedDocument.createdAt);
      const end = new Date();
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    },
    calculateTotalAttachments() {
      if (!this.selectedDocument?.tracking) return 0;
      return this.selectedDocument.tracking.reduce((total, track) => {
        return total + (track.documents?.attachments?.length || 0);
      }, 0);
    },
    calculateDepartmentsInvolved() {
      if (!this.selectedDocument?.tracking) return 0;
      const departments = new Set();
      this.selectedDocument.tracking.forEach((track) => {
        departments.add(track.fromDepartment.name);
        departments.add(track.toDepartment.name);
      });
      return departments.size;
    },

    addTracking(document) {
      if (document.status === "Completed") {
        return;
      }
      this.selectedDocument = document;
      this.showUpdateForm = true;
    },

    createNewDocument() {
      if (!this.$refs.newDocumentForm.validate()) return;

      const toDepartment = this.departmentList.find(
        (dept) => dept._id === this.newDocument.toDepartment
      );

      const currentUser = {
        _id: "1a1",
        fullName: "Current User",
        department: {
          _id: "d2",
          name: "Computer Science Department",
        },
      };

      const attachments = this.newDocument.attachments
        ? this.newDocument.attachments.map((file, index) => ({
          _id: `att_init_${Date.now()}_${index}`,
          title: file.name,
          fileUrl: URL.createObjectURL(file),
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: {
            _id: currentUser._id,
            fullName: currentUser.fullName,
          },
          uploadedAt: new Date().toISOString(),
        }))
        : [];

      const newDoc = {
        _id: `doc${this.documents.length + 1}`,
        title: this.newDocument.title,
        description: this.newDocument.description,
        creator: {
          _id: currentUser._id,
          fullName: currentUser.fullName,
          department: currentUser.department.name,
        },
        createdAt: new Date().toISOString(),
        status: "Under Review",
        priority: this.newDocument.priority,
        dueDate: new Date(this.newDocument.dueDate).toISOString(),
        currentDepartment: currentUser.department,
        tracking: [
          {
            fromDepartment: currentUser.department,
            toDepartment: toDepartment,
            documents: {
              attachments: attachments,
            },
            sentBy: {
              _id: currentUser._id,
              fullName: currentUser.fullName,
              department: currentUser.department.name,
            },
            receivedBy: null,
            sentAt: new Date().toISOString(),
            receivedAt: null,
            status: "Under Review",
            comments: this.newDocument.comments,
          },
        ],
      };

      this.documents.unshift(newDoc);
      this.showNewDocumentDialog = false;
      this.$refs.newDocumentForm.reset();
    },

    markAsReceived(trackingIndex) {
      this.selectedTrackingIndex = trackingIndex;
      this.showReceiveDialog = true;
    },

    async confirmReceived() {
      try {
        const tracking = this.selectedDocument.tracking[this.selectedTrackingIndex];
        await this.updateTracking({
          documentId: this.selectedDocument._id,
          trackingId: tracking._id,
          trackingData: {
            ...tracking,
            receivedBy: this.user,
            receivedAt: new Date().toISOString(),
          },
        });

        this.showReceiveConfirmDialog = false;
        this.selectedTrackingIndex = null;
        this.$toast.success("Document marked as received");
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
  },

  created() {
    // Initialize with first document
    if (this.documents.length) {
      this.selectedDocument = this.documents[0];
    }
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}
</style>
