export const WITHDRAWAL_TRANSITIONS = Object.freeze({
  PENDING: Object.freeze([
    "PROCESSING",
    "APPROVED",
    "REJECTED",
    "CANCELLED"
  ]),

  PROCESSING: Object.freeze([
    "APPROVED",
    "REJECTED"
  ]),

  APPROVED: Object.freeze([]),

  REJECTED: Object.freeze([]),

  CANCELLED: Object.freeze([])
});