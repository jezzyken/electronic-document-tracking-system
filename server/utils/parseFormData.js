const parseJsonField = (field) => {
  try {
    return field ? JSON.parse(field) : undefined;
  } catch (error) {
    return field;
  }
};

exports.parseStudentData = (body, file) => {
  const studentData = {
    studentId: parseJsonField(body.studentId),
    name: parseJsonField(body.name),
    course: body.course,
    homeAddress: body.homeAddress,
    dateOfBirth: body.dateOfBirth,
    placeOfBirth: body.placeOfBirth,
    religion: body.religion,
    personalInfo: parseJsonField(body.personalInfo),
    familyInfo: parseJsonField(body.familyInfo),
    contactInfo: parseJsonField(body.contactInfo),
    pwd: parseJsonField(body.pwd),
    emergencyContact: parseJsonField(body.emergencyContact),
    educationHistory: parseJsonField(body.educationHistory),
    lastSchoolAttended: parseJsonField(body.lastSchoolAttended),
  };

  if (file) {
    studentData.image = file.filename;
  }

  Object.keys(studentData).forEach(
    (key) => studentData[key] === undefined && delete studentData[key]
  );

  return studentData;
};
