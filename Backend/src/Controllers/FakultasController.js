const db = require("../config/db");

// ==========================================
// GET ALL FAKULTAS
// ==========================================

const getAllFakultas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        nama,
        kode,
        deskripsi,
        created_at
      FROM fakultas
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      message: "Data fakultas berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Get Fakultas Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data fakultas",
    });
  }
};


// ==========================================
// GET FAKULTAS BY ID
// ==========================================

const getFakultasById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        nama,
        kode,
        deskripsi,
        created_at
      FROM fakultas
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fakultas tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data fakultas berhasil diambil",
      data: rows[0],
    });
  } catch (error) {
    console.error("Get Fakultas By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data fakultas",
    });
  }
};


// ==========================================
// CREATE FAKULTAS
// ==========================================

const createFakultas = async (req, res) => {
  try {
    const { nama, kode, deskripsi } = req.body;

    if (!nama || !kode) {
      return res.status(400).json({
        success: false,
        message: "Nama dan kode fakultas wajib diisi",
      });
    }

    // Cek kode fakultas
    const [existing] = await db.query(
      "SELECT id FROM fakultas WHERE kode = ?",
      [kode]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Kode fakultas sudah digunakan",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO fakultas
      (nama, kode, deskripsi)
      VALUES (?, ?, ?)
      `,
      [nama, kode, deskripsi || null]
    );

    res.status(201).json({
      success: true,
      message: "Fakultas berhasil ditambahkan",
      data: {
        id: result.insertId,
        nama,
        kode,
        deskripsi: deskripsi || null,
      },
    });
  } catch (error) {
    console.error("Create Fakultas Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan fakultas",
    });
  }
};


// ==========================================
// UPDATE FAKULTAS
// ==========================================

const updateFakultas = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kode, deskripsi } = req.body;

    if (!nama || !kode) {
      return res.status(400).json({
        success: false,
        message: "Nama dan kode fakultas wajib diisi",
      });
    }

    // Cek fakultas
    const [existing] = await db.query(
      "SELECT id FROM fakultas WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fakultas tidak ditemukan",
      });
    }

    // Cek kode digunakan fakultas lain
    const [duplicate] = await db.query(
      `
      SELECT id
      FROM fakultas
      WHERE kode = ?
      AND id != ?
      `,
      [kode, id]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Kode fakultas sudah digunakan",
      });
    }

    await db.query(
      `
      UPDATE fakultas
      SET nama = ?,
          kode = ?,
          deskripsi = ?
      WHERE id = ?
      `,
      [nama, kode, deskripsi || null, id]
    );

    res.json({
      success: true,
      message: "Fakultas berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update Fakultas Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal memperbarui fakultas",
    });
  }
};


// ==========================================
// DELETE FAKULTAS
// ==========================================

const deleteFakultas = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      "SELECT id FROM fakultas WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fakultas tidak ditemukan",
      });
    }

    await db.query(
      "DELETE FROM fakultas WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Fakultas berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete Fakultas Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus fakultas",
    });
  }
};


module.exports = {
  getAllFakultas,
  getFakultasById,
  createFakultas,
  updateFakultas,
  deleteFakultas,
};