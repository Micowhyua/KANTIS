const express = require("express");
const router = express.Router();

const {
  getAllAdmin,
  createAdminFakultas,
  createAdminKantin,
  updateAdminStatus,
  updateAdmin,
  deleteAdmin,
} = require("../Controllers/AdminController");

const authMiddleware = require("../Middlewares/AuthMiddleware");
const roleMiddleware = require("../Middlewares/RoleMiddleware");

// Semua endpoint admin di bawah ini hanya bisa diakses oleh Super Admin
router.use(authMiddleware, roleMiddleware("super_admin"));

// [GET] Ambil semua data admin (Fakultas & Kantin)
router.get("/", getAllAdmin);

// [POST] Buat Admin Fakultas baru
router.post("/fakultas", createAdminFakultas);

// [POST] Buat Admin Kantin baru
router.post("/kantin", createAdminKantin);

// [PUT] Update data profil Admin (Nama, Email, Password) -> BARU
router.put("/:id", updateAdmin);

// [PATCH] Ubah status Aktif/Nonaktif Admin
router.patch("/:id/status", updateAdminStatus);

// [DELETE] Hapus Admin -> BARU
router.delete("/:id", deleteAdmin);

module.exports = router;