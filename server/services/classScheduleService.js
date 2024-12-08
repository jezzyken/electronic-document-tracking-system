const ClassSchedule = require("../models/ClassSchedule");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const AppError = require("../utils/appError");

const createClassSchedule = async (data) => {
  try {
    const teacher = await Teacher.findById(data.teacher).populate("subjects");
    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }

    const teachesSubject = teacher.subjects.some(
      (subject) => subject._id.toString() === data.subject
    );
    if (!teachesSubject) {
      throw new AppError("Teacher does not teach this subject", 400);
    }

    const conflicts = await checkTimeConflicts(data);
    if (conflicts.length > 0) {
      throw new AppError("Time conflict with existing schedule(s)", 400);
    }

    const schedule = await ClassSchedule.create(data);

    return await ClassSchedule.findById(schedule._id)
      .populate({
        path: "teacher",
        populate: {
          path: "user",
          select: "firstName middleName lastName",
        },
      })
      .populate("course")
      .populate("subject")
      .populate("students");
  } catch (error) {
    throw error;
  }
};

const getAllClassSchedules = async () => {
  const schedules = await ClassSchedule.find()
    .populate({
      path: "teacher",
      populate: {
        path: "user",
        select: "firstName middleName lastName",
      },
    })
    .populate("course")
    .populate("subject")
    .populate("students")
    .sort("-createdAt");
  return schedules;
};

const getClassScheduleById = async (id) => {
  const schedule = await ClassSchedule.findById(id)
    .populate({
      path: "teacher",
      populate: {
        path: "user",
        select: "firstName middleName lastName",
      },
    })
    .populate("course")
    .populate("subject")
    .populate({
      path: "students",
      populate: {
        path: "user",
        select: "firstName middleName lastName",
      },
    })

  if (!schedule) {
    throw new AppError("Schedule not found", 404);
  }
  return schedule;
};

const getClassSchedulesByTeacher = async (teacherId) => {
  try {
    const schedules = await ClassSchedule.find({ teacher: teacherId })
      .populate({
        path: "teacher",
        populate: [
          {
            path: "user",
            select: "firstName middleName lastName",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      })
      .populate("course")
      .populate("subject")
      .populate({
        path: "students",
        populate: {
          path: "user",
          select: "firstName middleName lastName",
        },
      })
      .sort({ weekDays: 1, startTime: 1 });

    if (!schedules) {
      throw new AppError("No schedules found for this teacher", 404);
    }

    const groupedSchedules = schedules.reduce((acc, schedule) => {
      schedule.weekDays.forEach((day) => {
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push({
          _id: schedule._id,
          course: schedule.course,
          subject: schedule.subject,
          section: schedule.section,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          students: schedule.students,
        });
      });
      return acc;
    }, {});

    return {
      rawSchedules: schedules,
      groupedSchedules: groupedSchedules,
    };
  } catch (error) {
    throw error;
  }
};

const getStudentByClassId = async (teacherId) => {
  try {
    const schedules = await ClassSchedule.find({ teacher: teacherId })
      .populate({
        path: "teacher",
        populate: [
          {
            path: "user",
            select: "firstName middleName lastName",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      })
      .populate("course")
      .populate("subject")
      .populate({
        path: "students",
        populate: {
          path: "user",
          select: "firstName middleName lastName",
        },
      })
      .sort({ weekDays: 1, startTime: 1 });

    if (!schedules) {
      throw new AppError("No schedules found for this teacher", 404);
    }

    const groupedSchedules = schedules.reduce((acc, schedule) => {
      schedule.weekDays.forEach((day) => {
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push({
          _id: schedule._id,
          course: schedule.course,
          subject: schedule.subject,
          section: schedule.section,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          students: schedule.students,
        });
      });
      return acc;
    }, {});

    return {
      rawSchedules: schedules,
      groupedSchedules: groupedSchedules,
    };
  } catch (error) {
    throw error;
  }
};

const updateClassSchedule = async (id, data) => {
  try {
    const conflicts = await checkTimeConflicts(data, id);
    if (conflicts.length > 0) {
      throw new AppError("Time conflict with existing schedule(s)", 400);
    }

    const schedule = await ClassSchedule.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: "teacher",
        populate: {
          path: "user",
          select: "firstName middleName lastName",
        },
      })
      .populate("course")
      .populate("subject")
      .populate("students");

    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    return schedule;
  } catch (error) {
    throw error;
  }
};

const deleteClassSchedule = async (id) => {
  const schedule = await ClassSchedule.findByIdAndDelete(id);

  if (!schedule) {
    throw new AppError("Schedule not found", 404);
  }

  return schedule;
};

const checkTimeConflicts = async (data, excludeId = null) => {
  const query = {
    teacher: data.teacher,
    weekDays: { $in: data.weekDays },
    _id: { $ne: excludeId },
  };

  const existingSchedules = await ClassSchedule.find(query);

  return existingSchedules.filter((schedule) => {
    const newStart = convertTimeToMinutes(data.startTime);
    const newEnd = convertTimeToMinutes(data.endTime);
    const existingStart = convertTimeToMinutes(schedule.startTime);
    const existingEnd = convertTimeToMinutes(schedule.endTime);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
};

const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

module.exports = {
  createClassSchedule,
  getAllClassSchedules,
  getClassScheduleById,
  getClassSchedulesByTeacher,
  getStudentByClassId,
  updateClassSchedule,
  deleteClassSchedule,
};
