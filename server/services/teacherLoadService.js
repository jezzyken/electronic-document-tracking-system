const TeacherLoad = require("../models/TeacherLoad");
const AppError = require("../utils/appError");
const ObjectId = require("mongoose").Types.ObjectId;

exports.createTeacherLoad = async (data) => {
  const newTeacherLoad = await TeacherLoad.create(data);
  return await newTeacherLoad.populate([
    "professor",
    "subjects.subject",
    "subjects.students",
  ]);
};

exports.getAllTeacherLoads = async (queryParams) => {
  const { academicYear, semester, subjectId } = queryParams;

  const teacherLoads = await TeacherLoad.aggregate([
    {
      $match: {
        academicYear,
        semester,
        "subjects.subject": { $in: [new ObjectId(subjectId)] },
      },
    },
    { $unwind: "$subjects" },
    {
      $match: {
        "subjects.subject": new ObjectId(subjectId),
      },
    },
    {
      $lookup: {
        from: "professors",
        localField: "professor",
        foreignField: "_id",
        as: "professor",
      },
    },
    {
      $unwind: "$professor",
    },
    {
      $lookup: {
        from: "subjects",
        localField: "subjects.subject",
        foreignField: "_id",
        as: "subjects.subjectInfo",
      },
    },
    {
      $unwind: "$subjects.subjectInfo",
    },
    {
      $project: {
        _id: 1,
        professor: {
          _id: "$professor._id",
          name: "$professor.name",
        },
        section: "$subjects.section",
        schedule: "$subjects.schedule",
        students: { $size: "$subjects.students" },
        maxStudents: 40,
        isFull: {
          $gte: [{ $size: "$subjects.students" }, 40],
        },
        subject: {
          _id: "$subjects.subjectInfo._id",
          catNo: "$subjects.subjectInfo.catNo",
          DescriptiveTitle: "$subjects.subjectInfo.DescriptiveTitle",
          units: "$subjects.subjectInfo.units",
        },
      },
    },
  ]);

  return teacherLoads;
};

exports.getTeacherLoads = async (id) => {
  const teacherLoad = await TeacherLoad.find({
    professor: new ObjectId(id),
  }).populate([
    "professor",
    "subjects.subject",
    {
      path: "subjects.students.student",
      model: "StudentProfile",
      populate: {
        path: "course",
        model: "Course",
      },
    },
  ]);

  if (!teacherLoad) {
    throw new AppError("No teacher load found with that ID", 404);
  }
  return teacherLoad;
};

exports.getStudentSubjectGrade = async (req, res) => {
  try {
    const { student, academicYear, semester } = req.query;

    let queryParams = {
      "subjects.students.student": student,
      status: "active",
    };

    if (semester === "Second") {
      queryParams.academicYear = academicYear;
      queryParams.semester = "First";
    } else {
      const [year1, year2] = academicYear.split("-");
      const prevAcademicYear = `${parseInt(year1) - 1}-${parseInt(year2) - 1}`;
      queryParams.academicYear = prevAcademicYear;
      queryParams.semester = "Second";
    }

    const teacherLoads = await TeacherLoad.find(queryParams).populate({
      path: "subjects.subject",
      select: "catNo DescriptiveTitle units",
    });

    const grades = teacherLoads.flatMap((load) =>
      load.subjects
        .filter((subject) =>
          subject.students.some(
            (s) => s.student.toString() === student && s.grades?.final
          )
        )
        .map((subject) => ({
          catNo: subject.subject.catNo,
          DescriptiveTitle: subject.subject.DescriptiveTitle,
          units: subject.subject.units,
          grade: subject.students.find((s) => s.student.toString() === student)
            .grades.final,
          remarks: subject.students.find(
            (s) => s.student.toString() === student
          ).grades.remarks,
        }))
    );

    console.log(grades);

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getStudentSchedule = async (req, res) => {
  try {
    const { studentId, academicYear, semester } = req.query;

    if (!studentId || !academicYear || !semester) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required parameters: studentId, academicYear, or semester",
      });
    }

    const studentSchedule = await TeacherLoad.aggregate([
      {
        $match: {
          academicYear,
          semester,
          status: "active",
          "subjects.students.student": new ObjectId(studentId),
        },
      },
      {
        $lookup: {
          from: "professors",
          localField: "professor",
          foreignField: "_id",
          as: "professorInfo",
        },
      },
      {
        $unwind: "$professorInfo",
      },
      {
        $unwind: "$subjects",
      },
      {
        $match: {
          "subjects.students.student": new ObjectId(studentId),
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subjects.subject",
          foreignField: "_id",
          as: "subjectInfo",
        },
      },
      {
        $unwind: "$subjectInfo",
      },
      {
        $unwind: "$subjects.schedule",
      },
      {
        $project: {
          section: "$subjects.section",
          subjectCode: "$subjectInfo.catNo",
          subjectName: "$subjectInfo.DescriptiveTitle",
          units: "$subjectInfo.units",
          professor: {
            $concat: [
              "$professorInfo.name.firstName",
              " ",
              "$professorInfo.name.surname",
            ],
          },
          schedule: {
            day: "$subjects.schedule.day",
            timeStart: "$subjects.schedule.timeStart",
            timeEnd: "$subjects.schedule.timeEnd",
            room: "$subjects.schedule.room",
          },
          grades: {
            $filter: {
              input: "$subjects.students",
              as: "student",
              cond: { $eq: ["$$student.student", new ObjectId(studentId)] },
            },
          },
        },
      },
      {
        $unwind: "$grades",
      },
      {
        $sort: {
          "schedule.day": 1,
          "schedule.timeStart": 1,
        },
      },
    ]);

    if (!studentSchedule.length) {
      return res.status(200).json({
        success: false,
        message: "No schedule found for this student",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        academicYear,
        semester,
        schedule: studentSchedule,
      },
    });
  } catch (error) {
    console.error("Error fetching student schedule:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.getTeacherLoad = async (id) => {
  const teacherLoad = await TeacherLoad.findById(id).populate([
    "professor",
    "subjects.subject",
    "subjects.students",
  ]);

  if (!teacherLoad) {
    throw new AppError("No teacher load found with that ID", 404);
  }
  return teacherLoad;
};

exports.updateTeacherLoad = async (id, data) => {
  const teacherLoad = await TeacherLoad.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(["professor", "subjects.subject", "subjects.students"]);

  if (!teacherLoad) {
    throw new AppError("No teacher load found with that ID", 404);
  }
  return teacherLoad;
};

exports.updateStudentGrade = async (req, res) => {
  try {
    const { teacherLoadId, subjectId, students } = req.body;

    const teacherLoad = await TeacherLoad.findById(teacherLoadId);
    if (!teacherLoad) {
      return res.status(404).json({
        success: false,
        message: "Teacher load not found",
      });
    }

    const subject = teacherLoad.subjects.find(
      (s) => s._id.toString() === subjectId.toString()
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    students.forEach(({ student: studentId, grades }) => {
      const studentDoc = subject.students.find(
        (s) => s._id.toString() === studentId
      );
      if (studentDoc) {
        studentDoc.grades = grades;
      }
    });

    await teacherLoad.save();

    return res.json({
      success: true,
      message: "Grades updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteTeacherLoad = async (id) => {
  const teacherLoad = await TeacherLoad.findByIdAndDelete(id);
  if (!teacherLoad) {
    throw new AppError("No teacher load found with that ID", 404);
  }
  return teacherLoad;
};
