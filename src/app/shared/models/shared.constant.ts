import { EnrollmentDetail } from "./shared.model"

export const NO_ENROLL_INDEX = -99

export const SUMMA_CUM_LAUDE = 96;
export const MAGNA_CUM_LAUDE = 85;
export const CUM_LAUDE = 70;
export const PASS = 50;



export const NO_ENROLLMENT_OPTION: EnrollmentDetail = {
    id: NO_ENROLL_INDEX,
    enrollmentName: 'None',
    course: {
      id: 0, title: 'No Enrollment',
      code: '',
      creditUnit: 0
    },
    students: [],
    magisters: [],
    startDate: ''
  }

  export enum Grade {
    SUMMA = 'S',
    MAGNA = "M",
    CUM_LAUDE = "C",
    PASS = "P",
    NO_PASS = "NP"
  }