const express = require("express");

const router = express.Router();

const {
  getPublicFakultas,
  getPublicKantin,
  getPublicKantinById,
  getPublicKategoriByKantin,
  getPublicProdukByKantin,
  getPublicProdukById,
} = require("../controllers/publicController");


// ==========================================
// PUBLIC API
// ==========================================

// Tidak menggunakan authMiddleware.


// Fakultas
router.get(
  "/fakultas",
  getPublicFakultas
);


// Semua kantin
router.get(
  "/kantin",
  getPublicKantin
);


// Detail kantin
router.get(
  "/kantin/:id",
  getPublicKantinById
);


// Kategori kantin
router.get(
  "/kantin/:kantinId/kategori",
  getPublicKategoriByKantin
);


// Produk kantin
router.get(
  "/kantin/:kantinId/produk",
  getPublicProdukByKantin
);


// Detail produk
router.get(
  "/produk/:id",
  getPublicProdukById
);


module.exports = router;