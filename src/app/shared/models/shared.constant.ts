import { EnrollmentDetail } from "./shared.model"

export const NO_ENROLL_INDEX = -99


export const NO_ENROLLMENT_OPTION: EnrollmentDetail = {
    id: NO_ENROLL_INDEX,
    enrollmentName: 'None',
    course: {
      id: 0, title: 'No Enrollment',
      code: '',
      creditUnit: ''
    },
    students: [],
    magisters: [],
    startDate: ''
  }