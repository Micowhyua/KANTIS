const express = require("express");

const router = express.Router();

const {
  createPesanan,
  getPesanan,
  getPesananById,
  updateStatusPesanan,
} = require("../Controllers/PesananController");


// =====================================================
// PUBLIC
// Pelanggan tidak perlu login
// =====================================================

router.post(
  "/",
  createPesanan
);


// =====================================================
// ADMIN
// =====================================================

router.get(
  "/",
  getPesanan
);


router.get(
  "/:id",
  getPesananById
);


router.patch(
  "/:id/status",
  updateStatusPesanan
);


module.exports = router;