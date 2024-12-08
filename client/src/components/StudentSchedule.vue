<template>
  <v-card class="mt-6 rounded-lg" elevation="2">
    <v-card-title class="py-4 px-6">
      <v-icon left color="primary" class="mr-2">mdi-calendar-clock</v-icon>
      Class Schedule
      <v-spacer></v-spacer>
      <v-chip small color="primary" outlined>
        {{ schedule?.length || 0 }} Classes
      </v-chip>
    </v-card-title>

    <v-data-table
      :headers="scheduleHeaders"
      :items="schedule"
      class="elevation-0"
      :loading="loading"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:no-data>
        No schedule available for this semester
      </template>

      <template v-slot:item.subject="{ item }">
        <div class="d-flex flex-column">
          <div class="font-weight-medium">{{ item.subjectCode }}</div>
          <div class="caption grey--text">{{ item.subjectName }}</div>
        </div>
      </template>

      <template v-slot:item.schedule="{ item }">
        <div class="d-flex align-center">
          <v-chip
            x-small
            label
            class="mr-2"
            color="secondary"
            text-color="white"
          >
            {{ item.schedule.day }}
          </v-chip>
          {{ item.schedule.timeStart }} - {{ item.schedule.timeEnd }}
        </div>
      </template>

      <template v-slot:item.room="{ item }">
        <v-chip x-small outlined>
          {{ item.schedule.room }}
        </v-chip>
      </template>

      <template v-slot:item.professor="{ item }">
        <div class="caption">{{ item.professor }}</div>
      </template>

      <template v-slot:item.units="{ item }">
        <v-chip x-small color="primary" outlined>
          {{ item.units }} units
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "StudentSchedule",

  props: {
    studentId: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    schedule: [],
    loading: false,
    scheduleHeaders: [
      { text: "Subject", value: "subject", width: "25%" },
      { text: "Schedule", value: "schedule", width: "25%" },
      { text: "Room", value: "room", width: "15%" },
      { text: "Professor", value: "professor", width: "20%" },
      { text: "Units", value: "units", width: "15%" },
    ],
  }),

  methods: {
    ...mapActions({
      fetchStudentSchedule: "teacherLoad/fetchStudentSchedule",
    }),

    async loadSchedule() {
      try {
        this.loading = true;
        const response = await this.fetchStudentSchedule({
          studentId: this.studentId,
          academicYear: this.academicYear,
          semester: this.semester,
        });

        console.log(response)

        if (response?.data?.data.schedule) {
          this.schedule = response.data.data.schedule;
        }else{
          this.schedule = []
        }
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        this.loading = false;
      }
    },
  },

  computed: {
    totalUnits() {
      return this.schedule.reduce(
        (total, item) => total + (item.units || 0),
        0
      );
    },
  },

  watch: {
    academicYear() {
      this.loadSchedule();
    },
    semester() {
      this.loadSchedule();
    },
  },

  created() {
    this.loadSchedule();
  },
};
</script>

<style scoped>
.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}

.v-data-table ::v-deep tbody tr:hover {
  background-color: #f5f5f5 !important;
}

.schedule-time {
  white-space: nowrap;
}
</style>
