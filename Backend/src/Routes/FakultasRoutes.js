const express = require("express");

const router = express.Router();

const {
  getAllFakultas,
  getFakultasById,
  createFakultas,
  updateFakultas,
  deleteFakultas,
} = require("../Controllers/FakultasController");

const authMiddleware = require("../Middlewares/AuthMiddleware");
const roleMiddleware = require("../Middlewares/RoleMiddleware");


// Semua endpoint fakultas hanya untuk Super Admin
router.use(
  authMiddleware,
  roleMiddleware("super_admin")
);


// GET semua fakultas
router.get("/", getAllFakultas);


// GET fakultas berdasarkan ID
router.get("/:id", getFakultasById);


// POST tambah fakultas
router.post("/", createFakultas);


// PUT update fakultas
router.put("/:id", updateFakultas);


// DELETE fakultas
router.delete("/:id", deleteFakultas);


module.exports = router;