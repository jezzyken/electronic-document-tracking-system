<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="request-card">
          <v-card-title class="text-h4 text-center d-block py-6">
            Document Request Form
          </v-card-title>

          <v-card-text>
            <v-stepper v-model="currentStep">
              <v-stepper-header>
                <v-stepper-step :complete="currentStep > 1" step="1">
                  Personal Information
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="currentStep > 2" step="2">
                  Document Details
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Review & Submit</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-form
                    ref="personalForm"
                    v-model="forms.personal.valid"
                    class="mt-2"
                  >
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.fullName"
                          label="Full Name"
                          :rules="rules.required"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.studentId"
                          label="Student ID"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.email"
                          label="Email"
                          :rules="rules.email"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.phone"
                          label="Contact Phone"
                          :rules="rules.required"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-btn
                      color="primary"
                      @click="nextStep(1)"
                      :disabled="!forms.personal.valid"
                    >
                      Continue
                    </v-btn>
                  </v-form>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-form ref="documentForm" v-model="forms.document.valid">
                    <v-row>
                      <v-col cols="12">
                        <v-card outlined class="pa-4">
                          <v-subheader class="pl-0 text-h6"
                            >Document Type (Select all that apply)</v-subheader
                          >
                          <v-row>
                            <v-col
                              cols="12"
                              md="6"
                              v-for="type in documentTypes"
                              :key="type"
                            >
                              <v-checkbox
                                v-model="formData.requestedDocuments"
                                :label="type"
                                :value="type"
                                dense
                                hide-details
                                class="mb-2"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-alert
                            v-if="formData.requestedDocuments.length === 0"
                            type="warning"
                            dense
                            text
                            class="mt-2"
                          >
                            Please select at least one document type
                          </v-alert>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-select
                          v-model="formData.purpose"
                          :items="purposes"
                          label="Purpose"
                          :rules="rules.required"
                          outlined
                          dense
                        ></v-select>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.notes"
                          label="Additional Notes"
                          outlined
                          dense
                          placeholder="Enter any additional information or special requirements"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-btn text @click="currentStep = 1">Back</v-btn>
                    <v-btn
                      color="primary"
                      @click="nextStep(2)"
                      :disabled="!forms.document.valid"
                      class="ml-4"
                    >
                      Continue
                    </v-btn>
                  </v-form>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-card flat>
                    <v-card-text>
                      <h3 class="text-h6 mb-4">Review Your Request</h3>

                      <v-list dense>
                        <v-subheader class="pl-0"
                          >Personal Information</v-subheader
                        >
                        <v-list-item
                          v-for="(value, key) in personalInfoReview"
                          :key="key"
                        >
                          <v-list-item-content>
                            <v-list-item-subtitle class="text-capitalize">
                              {{ key.replace("_", " ") }}
                            </v-list-item-subtitle>
                            <v-list-item-title>{{ value }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider class="my-4"></v-divider>

                        <v-subheader class="pl-0">Document Details</v-subheader>
                        <v-list-item
                          v-for="(value, key) in documentDetailsReview"
                          :key="key"
                        >
                          <v-list-item-content>
                            <v-list-item-subtitle class="text-capitalize">
                              {{ key.replace("_", " ") }}
                            </v-list-item-subtitle>
                            <v-list-item-title>{{ value }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>

                  <v-btn text @click="currentStep = 2" class="mt-4">
                    Back
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="submitRequest"
                    :loading="loading"
                    class="mt-4 ml-4"
                  >
                    Submit Request
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>

            <v-dialog v-model="showSuccessDialog" max-width="400" persistent>
              <v-card>
                <v-card-title class="text-h5 text-center">
                  Request Submitted Successfully
                </v-card-title>
                <v-card-text class="text-center">
                  <v-icon color="success" x-large class="mb-4">
                    mdi-check-circle
                  </v-icon>
                  <p class="mb-4">Your tracking number is:</p>
                  <p class="text-h6">{{ trackingNumber }}</p>
                  <p class="caption mt-4">
                    Please save this number to track your request status
                  </p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="goToTracking">
                    Track Request
                  </v-btn>
                  <v-btn color="primary" @click="resetForm"> Done </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DocumentRequestPage",

  data: () => ({
    currentStep: 1,
    loading: false,
    showSuccessDialog: false,
    trackingNumber: "",
    forms: {
      personal: { valid: false },
      document: { valid: false },
    },
    formData: {
      fullName: "",
      studentId: "",
      email: "",
      phone: "",
      purpose: "",
      notes: "",
      requestedDocuments: [],
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          notes: "Initial request submitted",
          timestamp: new Date(),
        },
      ],
      trackingNumber: "",
    },
    rules: {
      required: [(v) => !!v || "This field is required"],
      email: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
    },
    documentTypes: [
      "Transcript of Records",
      "Diploma",
      "Certification of Graduation",
      "Certificate of Good Moral Character",
      "Year Book",
      "Form 137",
      "Certificate of Enrollment",
      "Course Description",
      "True Copy of Grades",
    ],
    purposes: [
      "Employment",
      "Further Education",
      "Scholarship Application",
      "Personal Records",
      "Other",
    ],
  }),

  computed: {
    personalInfoReview() {
      return {
        full_name: this.formData.fullName,
        student_id: this.formData.studentId,
        email: this.formData.email,
        phone: this.formData.phone,
      };
    },
    documentDetailsReview() {
      return {
        document_types: this.formData.requestedDocuments.join(", "),
        purpose: this.formData.purpose,
        additional_notes: this.formData.notes || "None",
      };
    },
  },

  methods: {
    ...mapActions("documentRequest", ["createRequest"]),

    nextStep(step) {
      if (step === 1 && this.$refs.personalForm.validate()) {
        this.currentStep = 2;
      } else if (
        step === 2 &&
        this.$refs.documentForm.validate() &&
        this.formData.requestedDocuments.length > 0
      ) {
        this.currentStep = 3;
      }
    },

    async submitRequest() {
      this.loading = true;
      try {
        const response = await this.createRequest(this.formData);
        this.trackingNumber = response.trackingNumber;
        this.showSuccessDialog = true;
        this.$store.commit("SET_SNACKBAR", {
          show: true,
          text: "Document request submitted successfully!",
          color: "success",
        });
      } catch (error) {
        this.$store.commit("SET_SNACKBAR", {
          show: true,
          text: error.response?.data?.message || "Failed to submit request",
          color: "error",
        });
      } finally {
        this.loading = false;
      }
    },

    goToTracking() {
      this.$router.push({
        name: "TrackRequest",
        query: { tracking: this.trackingNumber },
      });
    },

    resetForm() {
      this.showSuccessDialog = false;
      this.currentStep = 1;
      this.$refs.personalForm.reset();
      this.$refs.documentForm.reset();
      this.formData = {
        fullName: "",
        studentId: "",
        email: "",
        phone: "",
        documentType: "",
        purpose: "",
        notes: "",
      };
    },
  },

  mounted() {
    const prefilledData = this.$route.params.prefilledData;
    if (prefilledData) {
      this.formData = { ...this.formData, ...prefilledData };
    }
  },
};
</script>

<style scoped>
.request-card {
  border-radius: 8px;
}

.v-stepper {
  box-shadow: none !important;
}
</style>
