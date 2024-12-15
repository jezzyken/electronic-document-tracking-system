<template>
  <v-container class="form-container">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <v-form ref="form" v-model="valid">
          <v-card class="form-card">
            <v-card-title class="text-center text-h4 pb-4 pt-4 primary--text">
              Student Document Request Form
            </v-card-title>

            <v-divider></v-divider>
            
            <v-card-text class="pt-4">
              <!-- Student Information Section -->
              <v-sheet class="mb-6" rounded>
                <div class="section-title mb-4">
                  <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                  <span class="text-h6">Student Information</span>
                </div>
                
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.fullName"
                      label="Full Name"
                      :rules="[v => !!v || 'Name is required']"
                      filled
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.studentId"
                      label="Student ID"
                      :rules="[v => !!v || 'Student ID is required']"
                      filled
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="4">
                    <v-menu
                      v-model="dateMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="formData.dateOfBirth"
                          label="Date of Birth"
                          readonly
                          v-on="on"
                          filled
                          dense
                          :rules="[v => !!v || 'Date of Birth is required']"
                          prepend-inner-icon="mdi-calendar"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="formData.dateOfBirth"
                        @input="dateMenu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="formData.phone"
                      label="Contact Phone"
                      filled
                      dense
                      :rules="[v => !!v || 'Phone is required']"
                      prepend-inner-icon="mdi-phone"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="formData.email"
                      label="Email Address"
                      filled
                      dense
                      :rules="emailRules"
                      prepend-inner-icon="mdi-email"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-sheet>

              <!-- Documents Section -->
              <v-sheet class="mb-6" rounded>
                <div class="section-title mb-4">
                  <v-icon color="primary" class="mr-2">mdi-file-document-multiple</v-icon>
                  <span class="text-h6">Documents Requested</span>
                </div>
                
                <v-row>
                  <v-col cols="12" md="6">
                    <v-checkbox
                      v-for="doc in documentOptions"
                      :key="doc.value"
                      v-model="formData.documents"
                      :label="doc.text"
                      :value="doc.value"
                      class="mb-1"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-sheet>

              <!-- Purpose Section -->
              <v-sheet class="mb-6" rounded>
                <div class="section-title mb-4">
                  <v-icon color="primary" class="mr-2">mdi-clipboard-text</v-icon>
                  <span class="text-h6">Purpose of Request</span>
                </div>
                
                <v-radio-group v-model="formData.purpose" row required>
                  <v-radio
                    v-for="purpose in purposeOptions"
                    :key="purpose.value"
                    :label="purpose.text"
                    :value="purpose.value"
                  ></v-radio>
                </v-radio-group>
              </v-sheet>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-6">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                x-large
                @click="submitForm"
                :disabled="!valid"
                :loading="loading"
              >
                Submit Request
                <v-icon right>mdi-send</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DocumentRequestForm',
  data: () => ({
    valid: false,
    dateMenu: false,
    loading: false,
    formData: {
      fullName: '',
      studentId: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      gradeLevel: '',
      documents: [],
      purpose: '',
      processing: '',
      delivery: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      }
    },
    emailRules: [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ],
    documentOptions: [
      { text: 'Official Transcript', value: 'transcript' },
      { text: 'Report Card', value: 'reportCard' },
      { text: 'Attendance Record', value: 'attendance' },
      { text: 'Enrollment Verification', value: 'enrollment' },
      { text: 'Immunization Record', value: 'immunization' }
    ],
    purposeOptions: [
      { text: 'College Application', value: 'college' },
      { text: 'Employment', value: 'employment' },
      { text: 'Transfer to Another School', value: 'transfer' },
      { text: 'Personal Records', value: 'personal' },
      { text: 'Other', value: 'other' }
    ],
    processingOptions: [
      { text: 'Standard Processing (5-7 business days) - Free', value: 'standard' },
      { text: 'Rush Processing (2-3 business days) - $25', value: 'rush' },
      { text: 'Same Day Processing - $50', value: 'same_day' }
    ],
    deliveryMethods: [
      { text: 'Pick up in person', value: 'pickup' },
      { text: 'Mail to address', value: 'mail' },
      { text: 'Email (if available)', value: 'email' }
    ]
  }),

  methods: {
    async submitForm() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500))
          console.log('Form Data:', this.formData)
          this.$refs.form.reset()
          // Add success notification here
        } catch (error) {
          // Add error handling here
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.form-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
}

.section-title {
  display: flex;
  align-items: center;
  color: var(--v-primary-base);
}
</style>