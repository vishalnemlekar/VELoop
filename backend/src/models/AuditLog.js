import mongoose from "mongoose";
import { AUDIT_ACTIONS } from "../constants/enums.js";

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true
    },

    action: {
      type: String,
      enum: AUDIT_ACTIONS,
      required: true,
      immutable: true,
      index: true
    },

    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      immutable: true,
      index: true
    },

    targetType: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
      maxlength: 50
    },

    referenceId: {
      type: String,
      default: null,
      immutable: true,
      index: true,
      trim: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      immutable: true
    },

    ipAddress: {
      type: String,
      default: null,
      immutable: true,
      trim: true,
      maxlength: 100
    },

    userAgent: {
      type: String,
      default: null,
      immutable: true,
      maxlength: 1000
    }
  },
  {
    timestamps: true
  }
);

auditLogSchema.index({
  targetUserId: 1,
  createdAt: -1
});

auditLogSchema.index({
  action: 1,
  createdAt: -1
});

auditLogSchema.index({
  referenceId: 1,
  createdAt: -1
});

const AuditLog = mongoose.model(
  "AuditLog",
  auditLogSchema
);

export default AuditLog;