const express = require("express");

const router = express.Router();

const {
  getAllAdmin,
  createAdminFakultas,
  createAdminKantin,
  updateAdminStatus,
} = require("../Controllers/AdminController");

const authMiddleware = require("../Middlewares/AuthMiddleware");
const roleMiddleware = require("../Middlewares/RoleMiddleware");

// Semua endpoint admin hanya untuk Super Admin
router.use(
  authMiddleware,
  roleMiddleware("super_admin")
);

// Semua admin
router.get("/", getAllAdmin);

// Buat Admin Fakultas
router.post(
  "/fakultas",
  createAdminFakultas
);

// Buat Admin Kantin
router.post(
  "/kantin",
  createAdminKantin
);

// Aktif/nonaktif admin
router.patch(
  "/:id/status",
  updateAdminStatus
);

module.exports = router;