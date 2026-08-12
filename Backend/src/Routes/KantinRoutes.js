const express = require("express");

const router = express.Router();

const {
  getAllKantin,
  getKantinById,
  getKantinByFakultas,
  createKantin,
  updateKantin,
  deleteKantin,
} = require("../controllers/kantinController");

const authMiddleware = require("../Middlewares/AuthMiddleware");
const roleMiddleware = require("../Middlewares/RoleMiddleware");

// Semua endpoint management kantin
// sementara hanya Super Admin
router.use(
  authMiddleware,
  roleMiddleware(
    "super_admin",
    "admin_fakultas",
    "admin_kantin"
  )
);


// GET semua kantin
router.get("/", getAllKantin);

// GET kantin berdasarkan fakultas
router.get(
  "/fakultas/:fakultasId",
  getKantinByFakultas
);

// GET kantin berdasarkan ID
router.get("/:id", getKantinById);

// POST tambah kantin
router.post("/", createKantin);

// PUT update kantin
router.put("/:id", updateKantin);

// DELETE kantin
router.delete("/:id", deleteKantin);

module.exports = router;