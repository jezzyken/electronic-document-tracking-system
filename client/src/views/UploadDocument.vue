<template>
  <div class="ma-4">
    <v-card class="pa-4">
      <!-- Header -->
      <v-row align="center" class="mb-4">
        <v-col cols="12" sm="6">
          <div>
            <span class="text-h5 font-weight-bold primary--text">
              Upload Documents
            </span>
            <p class="text-subtitle-1 grey--text">
              Allowed file types: PDF, JPG, PNG | Max size: 10MB
            </p>
          </div>
        </v-col>
      </v-row>

      <!-- Upload Type Selection -->
      <v-radio-group v-model="uploadType" row class="mb-4">
        <v-radio label="Single Upload" value="single"></v-radio>
        <v-radio label="Bulk Upload" value="bulk"></v-radio>
      </v-radio-group>

      <v-select
        v-model="selectedDepartment"
        :items="departments"
        label="Select Recipient"
        outlined
        required
        :rules="[(v) => !!v || 'Recipient is required']"
        class="mb-4"
      ></v-select>

      <v-text-field
        v-if="uploadType === 'single'"
        v-model="documentName"
        label="Document Name"
        outlined
        required
        :rules="[(v) => !!v || 'Document name is required']"
        class="mb-4"
      ></v-text-field>

      <v-text-field
        v-if="uploadType === 'bulk' && queuedFiles.length > 0"
        v-model="bulkDocumentName"
        label="Archive Name"
        outlined
        required
        :rules="[(v) => !!v || 'Archive name is required']"
        class="mb-4"
        hint="Files will be zipped with this name"
      ></v-text-field>

      <v-card outlined class="mb-4">
        <v-card-text>
          <div
            class="d-flex flex-column align-center upload-zone"
            @dragover.prevent
            @drop.prevent="handleDrop"
            :class="{ dragging: isDragging }"
            @dragenter="isDragging = true"
            @dragleave="isDragging = false"
          >
            <v-icon size="64" color="primary">mdi-cloud-upload</v-icon>
            <div class="text-h6 mt-2">Drag files here or</div>
            <v-btn
              color="primary"
              class="mt-2"
              @click="$refs.fileInput.click()"
            >
              Browse Files
            </v-btn>
            <input
              ref="fileInput"
              type="file"
              :multiple="uploadType === 'bulk'"
              accept=".pdf,.doc,.docx,.txt"
              style="display: none"
              @change="handleFileSelect"
            />
          </div>

          <v-card-text v-if="queuedFiles.length > 0" class="text-subtitle-1">
            Documents queued: {{ queuedFiles.length }}
          </v-card-text>

          <v-list v-if="queuedFiles.length" two-line class="mt-4">
            <v-subheader>Queued Files</v-subheader>
            <v-list-item v-for="(file, i) in queuedFiles" :key="i">
              <v-list-item-avatar>
                <v-icon>mdi-file-document</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ file.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatFileSize(file.size) }} | {{ selectedDepartment }}
                </v-list-item-subtitle>

                <!-- Upload progress -->
                <v-progress-linear
                  v-if="uploading"
                  :value="file.uploadProgress || 0"
                  height="20"
                  color="success"
                  class="mt-2"
                  
                >
                  <template v-slot:default="{ value }">
                    <small>{{ Math.ceil(value) }}%</small>
                  </template>
                </v-progress-linear>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="removeQueuedFile(i)" :disabled="uploading">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <!-- <v-progress-linear
              v-if="uploading"
              :value="documentProgress.upload"
              height="6"
              color="primary"
              class="mt-4"
            >
              <template v-slot:default="{ value }">
                <small>Overall Progress: {{ Math.ceil(value) }}%</small>
              </template>
            </v-progress-linear> -->
          </v-list>

          <v-btn
            v-if="queuedFiles.length"
            color="success"
            block
            class="mt-4"
            @click="uploadAllFiles"
            :disabled="!isValidForUpload"
          >
            {{ getUploadButtonText }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import JSZip from "jszip";
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    isDragging: false,
    uploading: false,
    zipping: false,
    zipProgress: 0,
    queuedFiles: [],
    documents: [],
    editDialog: false,
    deleteDialog: false,
    selectedItem: null,
    uploadType: "single",
    selectedDepartment: null,
    documentName: "",
    bulkDocumentName: "",
    departments: ["Program Head", "Librarian", "Guidance Office", "Registrar"],
    documentStates: {
      zipping: false,
      uploading: false,
      loading: false,
    },

    documentProgress: {
      zip: 0,
      upload: 0,
      total: 0,
    },
    loadingDocuments: [],
  }),

  computed: {
    ...mapState("documents", ["loading"]),
    isValidForUpload() {
      if (!this.selectedDepartment) return false;
      if (this.uploadType === "single" && !this.documentName) return false;
      if (this.uploadType === "bulk" && !this.bulkDocumentName) return false;
      return true;
    },

    getUploadButtonText() {
      if (this.zipping)
        return `Zipping Files... ${Math.ceil(this.zipProgress)}%`;
      if (this.uploading)
        return `Uploading Files... ${Math.ceil(this.documentProgress.upload)}%`;
      if (this.uploadType === "bulk" && this.queuedFiles.length > 1) {
        return "Zip & Upload Files";
      }
      return "Upload Files";
    },
  },

  methods: {
    ...mapActions("documents", ["uploadDocument"]),

    getStatusColor(status) {
      const colors = {
        Pending: "warning",
        "In Review": "info",
        Approved: "success",
        Rejected: "error",
        Draft: "grey",
      };
      return colors[status] || "grey";
    },

    async zipFiles() {
      this.zipping = true;
      this.documentProgress.zip = 0;
      const zip = new JSZip();

      for (const file of this.queuedFiles) {
        const content = await this.readFileContent(file);
        await zip.file(file.name, content, { binary: true });
        await new Promise((resolve) => setTimeout(resolve, 500)); // Add delay
        this.zipProgress += Math.ceil(100 / this.queuedFiles.length);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 },
      });

      const zipFile = new File([zipBlob], `${this.bulkDocumentName}.zip`, {
        type: "application/zip",
      });
      this.queuedFiles = [zipFile];
      this.zipping = false;
    },
    handleDrop(e) {
      this.isDragging = false;
      const files = [...e.dataTransfer.files];
      if (this.uploadType === "single" && files.length > 1) {
        alert("Please select only one file for single upload");
        return;
      }
      this.queueFiles(files);
    },

    handleFileSelect(e) {
      const files = [...e.target.files];
      if (this.uploadType === "single" && files.length > 1) {
        alert("Please select only one file for single upload");
        return;
      }
      this.queueFiles(files);
      this.$refs.fileInput.value = "";
    },

    queueFiles(files) {
      if (this.uploadType === "single") {
        this.queuedFiles = [files[0]];
      } else {
        this.queuedFiles.push(...files);
      }
    },

    removeQueuedFile(index) {
      this.queuedFiles.splice(index, 1);
    },

    async readFileContent(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsArrayBuffer(file);
      });
    },

    async uploadAllFiles() {
      this.uploading = true;
      this.documentProgress.upload = 0;

      if (!this.isValidForUpload) return;

      try {
        if (this.uploadType === "bulk" && this.queuedFiles.length > 1) {
          this.zipping = true;
          await this.zipFiles();
          this.zipping = false;
        }

        this.uploading = true;

        for (const file of this.queuedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "name",
            this.uploadType === "single" ? this.documentName : file.name
          );
          formData.append("department", this.selectedDepartment);

          const config = {
            onUploadProgress: (e) => {
              file.uploadProgress = Math.round((e.loaded * 100) / e.total);
              this.documentProgress.upload =
                this.queuedFiles.reduce(
                  (sum, f) => sum + (f.uploadProgress || 0),
                  0
                ) / this.queuedFiles.length;
            },
          };

          await this.uploadDocument({ formData, config });
        }

        this.$emit("upload-complete");
        this.resetForm();
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        this.uploading = false;
        this.queuedFiles = [];
      }
    },

    // async uploadAllFiles() {
    //   this.uploading = true;
    //   this.documentProgress.upload = 0;

    //   if (!this.isValidForUpload) return;

    //   // First step: Zipping (if bulk)
    //   if (this.uploadType === "bulk" && this.queuedFiles.length > 1) {
    //     this.zipping = true;
    //     await this.zipFiles();
    //     this.zipping = false;
    //   }

    //   // Second step: Uploading
    //   this.uploading = true;

    //   for (const [index, file] of this.queuedFiles.entries()) {
    //     const content = await this.readFileContent(file);
    //     file.uploadProgress = 0;

    //     const doc = {
    //       id: Date.now() + index,
    //       name: this.uploadType === "single" ? this.documentName : file.name,
    //       department: this.selectedDepartment,
    //       status: "Pending",
    //       progress: 0,
    //       uploading: true,
    //       content: content,
    //     };

    //     this.loadingDocuments.push(doc.id);

    //     const interval = setInterval(() => {
    //       if (file.uploadProgress < 100) {
    //         file.uploadProgress += 2;
    //         this.documentProgress.upload =
    //           this.queuedFiles.reduce(
    //             (sum, f) => sum + (f.uploadProgress || 0),
    //             0
    //           ) / this.queuedFiles.length;
    //       }
    //     }, 500);

    //     await this.simulateUpload(doc);
    //     clearInterval(interval);

    //     this.loadingDocuments = this.loadingDocuments.filter(
    //       (id) => id !== doc.id
    //     );
    //     this.documents.push(doc);
    //   }

    //   this.queuedFiles = [];
    //   this.uploading = false;
    //   this.resetForm();
    // },

    async downloadDocument(doc) {
      if (doc.name.endsWith(".zip")) {
        const zip = new JSZip();
        try {
          await zip.loadAsync(doc.content);
          const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
          });
          this.triggerDownload(zipBlob, doc.name);
        } catch (err) {
          console.error("Error downloading ZIP:", err);
        }
        return;
      }

      const blob = new Blob([doc.content], {
        type: this.getFileType(doc.name),
      });
      this.triggerDownload(blob, doc.name);
    },

    triggerDownload(blob, filename) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },

    getFileType(filename) {
      const ext = filename.split(".").pop().toLowerCase();
      const types = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        txt: "text/plain",
        zip: "application/zip",
      };
      return types[ext] || "application/octet-stream";
    },

    resetForm() {
      this.documentName = "";
      this.bulkDocumentName = "";
      this.selectedDepartment = null;
    },

    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    simulateUpload(doc) {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          doc.progress += 5;
          if (doc.progress >= 100) {
            clearInterval(interval);
            doc.uploading = false;
            resolve();
          }
        }, 1000);
      });
    },
  },
};
</script>

<style scoped>
.upload-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-zone.dragging {
  border-color: var(--v-primary-base);
  background-color: rgba(var(--v-primary-base), 0.05);
}
</style>
