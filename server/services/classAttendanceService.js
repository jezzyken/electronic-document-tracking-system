const ClassAttendance = require("../models/ClassAttendance");
const AppError = require("../utils/appError");
const moment = require("moment");
require("moment-timezone");
const ObjectId = require("mongoose").Types.ObjectId;
const EmailService = require("../utils/emailService");
const NotificationLog = require("../models/NotificationLog");
const populateAttendance = async (attendanceId) => {
  return await ClassAttendance.findById(attendanceId)
    .populate({
      path: "classSchedule",
      populate: [
        { path: "subject" },
        { path: "course" },
        {
          path: "students",
          populate: {
            path: "user",
            select: "firstName lastName middleName",
          },
        },
      ],
    })
    .populate({
      path: "attendanceRecords.student",
      populate: {
        path: "user",
        select: "firstName lastName middleName",
      },
    });
};

const checkExistingAttendance = async (classScheduleId, date) => {
  const searchDate = moment(date).tz("Asia/Singapore").format("YYYY-MM-DD");

  try {
    const attendance = await ClassAttendance.findOne({
      classSchedule: classScheduleId,
      attendanceDate: searchDate,
    })
      .populate({
        path: "classSchedule",
        select: "_id",
      })
      .populate({
        path: "attendanceRecords.student",
        populate: {
          path: "user",
          select: "firstName lastName middleName",
        },
        select: "_id studentId level section user parentEmail",
      });

    return attendance;
  } catch (error) {
    throw new AppError("Error checking attendance: " + error.message, 500);
  }
};

const createAttendance = async (data) => {
  try {
    const existingAttendance = await checkExistingAttendance(
      data.classSchedule,
      data.attendanceDate
    );

    if (existingAttendance) {
      throw new AppError("Attendance record already exists for this date", 400);
    }

    const attendance = await ClassAttendance.create(data);
    const populatedAttendance = await populateAttendance(attendance._id);

    const absentRecords = populatedAttendance.attendanceRecords.filter(
      (record) => record.status === "absent"
    );

    for (const record of absentRecords) {
      try {
        const studentInfo = record.student;
        const classInfo = populatedAttendance.classSchedule;

        await EmailService.sendAbsenceNotification(
          studentInfo,
          classInfo,
          populatedAttendance.attendanceDate
        );

        await NotificationLog.create({
          student: record.student._id,
          classSchedule: classInfo._id,
          attendanceDate: populatedAttendance.attendanceDate,
          emailSent: true,
          emailSentAt: new Date(),
          message: `Absence notification sent for ${
            classInfo.subject.subjectName
          } on ${moment(populatedAttendance.attendanceDate)
            .tz("Asia/Singapore")
            .format("MMMM DD, YYYY")}`,
        });
      } catch (error) {
        console.error(
          `Failed to process absence notification for student ${record.student._id}:`,
          error
        );

        await NotificationLog.create({
          student: record.student._id,
          classSchedule: populatedAttendance.classSchedule._id,
          attendanceDate: populatedAttendance.attendanceDate,
          emailSent: false,
          message: `Failed to send absence notification: ${error.message}`,
        });
      }
    }

    return populatedAttendance;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Attendance record already exists for this date", 400);
    }
    throw error;
  }
};

const getAllAttendance = async (query = {}) => {
  const attendance = await ClassAttendance.find(query)
    .populate({
      path: "classSchedule",
      populate: [{ path: "subject" }, { path: "course" }],
    })
    .populate({
      path: "attendanceRecords.student",
      populate: {
        path: "user",
        select: "firstName lastName middleName",
      },
    })
    .sort("-attendanceDate");
  return attendance;
};

const getAttendanceById = async (id) => {
  const attendance = await populateAttendance(id);
  if (!attendance) {
    throw new AppError("Attendance record not found", 404);
  }
  return attendance;
};

const getAttendanceBySchedule = async (classScheduleId) => {
  const attendance = await ClassAttendance.find({
    classSchedule: classScheduleId,
  })
    .populate({
      path: "classSchedule",
      populate: [
        { path: "subject" },
        { path: "course" },
        {
          path: "students",
          populate: {
            path: "user",
            select: "firstName lastName middleName",
          },
        },
      ],
    })
    .populate({
      path: "attendanceRecords.student",
      populate: {
        path: "user",
        select: "firstName lastName middleName",
      },
    })
    .sort("-attendanceDate");
  return attendance;
};

const getAttendanceByDateRange = async (startDate, endDate) => {
  const start = moment(startDate)
    .tz("Asia/Singapore")
    .startOf("day")
    .format("YYYY-MM-DD");
  const end = moment(endDate)
    .tz("Asia/Singapore")
    .endOf("day")
    .format("YYYY-MM-DD");

  const attendance = await ClassAttendance.find({
    attendanceDate: { $gte: start, $lte: end },
  })
    .populate("classSchedule")
    .populate("attendanceRecords.student")
    .sort("-attendanceDate");
  return attendance;
};

const getStudentAttendance = async (
  studentId,
  startDate = null,
  endDate = null
) => {
  let query = {
    "attendanceRecords.student": studentId,
  };

  if (startDate && endDate) {
    query.attendanceDate = {
      $gte: moment(startDate).tz("Asia/Singapore").format("YYYY-MM-DD"),
      $lte: moment(endDate).tz("Asia/Singapore").format("YYYY-MM-DD"),
    };
  }

  const attendance = await ClassAttendance.find(query)
    .populate({
      path: "classSchedule",
      populate: [{ path: "subject" }, { path: "course" }],
    })
    .populate({
      path: "attendanceRecords.student",
      populate: {
        path: "user",
        select: "firstName lastName middleName",
      },
    })
    .sort("-attendanceDate");
  return attendance;
};

const updateAttendance = async (id, data) => {
  try {
    const attendance = await ClassAttendance.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!attendance) {
      throw new AppError("Attendance record not found", 404);
    }

    return await populateAttendance(attendance._id);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Attendance record already exists for this date", 400);
    }
    throw error;
  }
};

const updateStudentAttendance = async (id, studentId, status) => {
  const attendance = await ClassAttendance.findOneAndUpdate(
    {
      _id: id,
      "attendanceRecords.student": studentId,
    },
    {
      $set: { "attendanceRecords.$.status": status },
    },
    { new: true, runValidators: true }
  );

  if (!attendance) {
    throw new AppError("Attendance record or student not found", 404);
  }

  return await populateAttendance(attendance._id);
};

const deleteAttendance = async (id) => {
  const attendance = await ClassAttendance.findByIdAndDelete(id);
  if (!attendance) {
    throw new AppError("Attendance record not found", 404);
  }
  return attendance;
};

const getAttendanceStats = async (classScheduleId, startDate, endDate) => {
  const stats = await ClassAttendance.aggregate([
    {
      $match: {
        classSchedule: new ObjectId(classScheduleId),
        attendanceDate: {
          $gte: moment(startDate).tz("Asia/Singapore").format("YYYY-MM-DD"),
          $lte: moment(endDate).tz("Asia/Singapore").format("YYYY-MM-DD"),
        },
      },
    },
    {
      $unwind: "$attendanceRecords",
    },
    {
      $group: {
        _id: "$attendanceRecords.student",
        totalClasses: { $sum: 1 },
        present: {
          $sum: {
            $cond: [{ $eq: ["$attendanceRecords.status", "present"] }, 1, 0],
          },
        },
        absent: {
          $sum: {
            $cond: [{ $eq: ["$attendanceRecords.status", "absent"] }, 1, 0],
          },
        },
        late: {
          $sum: {
            $cond: [{ $eq: ["$attendanceRecords.status", "late"] }, 1, 0],
          },
        },
        excused: {
          $sum: {
            $cond: [{ $eq: ["$attendanceRecords.status", "excused"] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "studentInfo",
      },
    },
    {
      $unwind: "$studentInfo",
    },
    {
      $lookup: {
        from: "users",
        localField: "studentInfo.user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        totalClasses: 1,
        present: 1,
        absent: 1,
        late: 1,
        excused: 1,
        student: {
          _id: "$_id",
          studentId: "$studentInfo.studentId",
          firstName: "$userInfo.firstName",
          lastName: "$userInfo.lastName",
          middleName: "$userInfo.middleName",
        },
        attendanceRate: {
          $multiply: [{ $divide: ["$present", "$totalClasses"] }, 100],
        },
      },
    },
    {
      $sort: { "student.lastName": 1 },
    },
  ]);

  return stats;
};

const getNotificationLogs = async (query = {}) => {
  return await NotificationLog.find(query)
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "firstName lastName email",
      },
    })
    .populate({
      path: "classSchedule",
      populate: {
        path: "subject",
        select: "name",
      },
    })
    .sort("-createdAt");
};

module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  getAttendanceBySchedule,
  getAttendanceByDateRange,
  getStudentAttendance,
  updateAttendance,
  updateStudentAttendance,
  deleteAttendance,
  getAttendanceStats,
  checkExistingAttendance,
  getNotificationLogs,
};
