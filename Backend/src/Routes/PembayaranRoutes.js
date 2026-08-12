const express = require("express");

const router = express.Router();

const {
  createPembayaran,
  getPembayaranByPesanan,
  updateStatusPembayaran,
} = require("../Controllers/PembayaranController");


// Buat pembayaran QRIS
router.post(
  "/",
  createPembayaran
);


// Cek pembayaran berdasarkan pesanan
router.get(
  "/pesanan/:pesanan_id",
  getPembayaranByPesanan
);


// Sementara untuk testing
router.patch(
  "/:id/status",
  updateStatusPembayaran
);


module.exports = router;