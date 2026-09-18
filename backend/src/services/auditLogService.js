import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async ({
    actorId = null,
    action,
    targetUserId = null,
    targetType,
    referenceId = null,
    metadata = {},
    ipAddress = null,
    userAgent = null,
    session = null
}) => {
    const auditData = {
        actorId,
        action,
        targetUserId,
        targetType,
        referenceId,
        metadata,
        ipAddress,
        userAgent
    };

    if (session) {
        await AuditLog.create(
            [auditData],
            { session }
        );
    } else {
        await AuditLog.create(auditData);
    }
};