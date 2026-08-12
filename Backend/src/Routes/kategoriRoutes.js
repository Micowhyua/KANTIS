const express = require("express");

const router = express.Router();

const {
  getAllKategori,
  getKategoriByKantin,
  createKategori,
  updateKategori,
  deleteKategori,
} = require("../controllers/kategoriController");

const authMiddleware = require("../Middlewares/AuthMiddleware");

const roleMiddleware = require("../Middlewares/RoleMiddleware");


// Semua endpoint kategori membutuhkan login
router.use(
  authMiddleware,
  roleMiddleware(
    "super_admin",
    "admin_fakultas",
    "admin_kantin"
  )
);


// Semua kategori
router.get(
  "/",
  getAllKategori
);


// Kategori berdasarkan kantin
router.get(
  "/kantin/:kantinId",
  getKategoriByKantin
);


// Tambah kategori
router.post(
  "/",
  createKategori
);


// Update kategori
router.put(
  "/:id",
  updateKategori
);


// Delete kategori
router.delete(
  "/:id",
  deleteKategori
);


module.exports = router;