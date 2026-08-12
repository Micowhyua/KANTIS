const express = require("express");

const router = express.Router();

const {
  getAllProduk,
  getProdukById,
  getProdukByKantin,
  createProduk,
  updateProduk,
  deleteProduk,
} = require("../controllers/produkController");

const authMiddleware = require("../middlewares/AuthMiddleware");

const roleMiddleware = require("../Middlewares/RoleMiddleware");

router.use(
  authMiddleware,
  roleMiddleware(
    "super_admin",
    "admin_fakultas",
    "admin_kantin"
  )
);


router.get(
  "/",
  getAllProduk
);

router.get(
  "/kantin/:kantinId",
  getProdukByKantin
);

router.get(
  "/:id",
  getProdukById
);

router.post(
  "/",
  createProduk
);

router.put(
  "/:id",
  updateProduk
);


router.delete(
  "/:id",
  deleteProduk
);


module.exports = router;