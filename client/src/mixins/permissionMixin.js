export const permissionMixin = {
  computed: {
    currentUser() {
      return JSON.parse(localStorage.getItem("user")) || {};
    },

    userRole() {
      return this.currentUser?.role || null;
    },

    userPermissions() {
      return this.currentUser?.role?.permissions || [];
    },

    userDepartment() {
      return this.currentUser?.department || null;
    },

    userFullName() {
      return this.currentUser?.fullName || "";
    },
  },

  methods: {
    hasPermission(permissions, requireAll = false) {
      if (!this.userPermissions.length) return false;

      if (Array.isArray(permissions)) {
        return requireAll
          ? permissions.every((p) => this.userPermissions.includes(p))
          : permissions.some((p) => this.userPermissions.includes(p));
      }

      return this.userPermissions.includes(permissions);
    },

    isInDepartment(departmentId) {
      return this.userDepartment?._id === departmentId;
    },

    canPerformDocumentAction(action, document, trackingIndex) {
      if (!this.hasPermission(action)) return false;

      if (!document) return true;

      switch (action) {
        case "update":
        case "delete":
          return this.isDocumentEditor(document);

        case "change_document_status":
          return (
            document.status !== "Completed" &&
            this.isInDocumentWorkflow(document)
          );

        case "recieved_document":
          return this.isDocumentRecipient(document, trackingIndex);

        case "view_attachments":
          return this.isInDocumentWorkflow(document);

        default:
          return true;
      }
    },

    isDocumentEditor(document) {
      if (!document) return false;

      return (
        document.user?._id === this.currentUser._id ||
        document.department?._id === this.userDepartment?._id
      );
    },

    isInDocumentWorkflow(document) {
      if (!document?.tracking) return false;

      const userDeptId = this.userDepartment?._id;
      return document.tracking.some(
        (track) =>
          track.fromDepartment._id === userDeptId ||
          track.toDepartment._id === userDeptId
      );
    },

    isDocumentRecipient(document, trackingIndex) {
      if (!document?.tracking?.length) return false;

      if (trackingIndex !== undefined) {
        const tracking = document.tracking[trackingIndex];
        return (
          tracking &&
          tracking.toDepartment._id === this.userDepartment?._id &&
          !tracking.receivedAt
        );
      }

      return document.tracking.some(
        (track) =>
          track.toDepartment._id === this.userDepartment?._id &&
          !track.receivedAt
      );
    },
  },
};
