const db = require("../config/db");

// ==========================================
// GET SEMUA KATEGORI
// ==========================================

const getAllKategori = async (req, res) => {
  try {
    let query = `
      SELECT
        k.id,
        k.kantin_id,
        k.nama,
        k.created_at,
        kt.nama AS nama_kantin
      FROM kategori k
      INNER JOIN kantin kt
        ON k.kantin_id = kt.id
    `;

    const params = [];

    // Admin Kantin hanya melihat kategori
    // kantinnya sendiri
    if (req.user.role === "admin_kantin") {
      query += " WHERE k.kantin_id = ?";
      params.push(req.user.kantin_id);
    }

    // Admin Fakultas hanya melihat kategori
    // dari kantin fakultasnya
    if (req.user.role === "admin_fakultas") {
      query += `
        WHERE kt.fakultas_id = ?
      `;

      params.push(req.user.fakultas_id);
    }

    query += " ORDER BY k.id DESC";

    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      message: "Data kategori berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Get Kategori Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data kategori",
    });
  }
};


// ==========================================
// GET KATEGORI BERDASARKAN KANTIN
// ==========================================

const getKategoriByKantin = async (req, res) => {
  try {
    const { kantinId } = req.params;

    // Admin Kantin hanya boleh melihat
    // kantinnya sendiri
    if (
      req.user.role === "admin_kantin" &&
      Number(kantinId) !== Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke kantin ini",
      });
    }

    // Admin Fakultas harus memastikan
    // kantin berada di fakultasnya
    if (req.user.role === "admin_fakultas") {
      const [kantin] = await db.query(
        `
        SELECT id
        FROM kantin
        WHERE id = ?
        AND fakultas_id = ?
        `,
        [
          kantinId,
          req.user.fakultas_id,
        ]
      );

      if (kantin.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Kantin bukan bagian dari fakultas Anda",
        });
      }
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        kantin_id,
        nama,
        created_at
      FROM kategori
      WHERE kantin_id = ?
      ORDER BY id DESC
      `,
      [kantinId]
    );

    return res.json({
      success: true,
      message: "Data kategori berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Get Kategori By Kantin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori",
    });
  }
};


// ==========================================
// CREATE KATEGORI
// ==========================================

const createKategori = async (req, res) => {
  try {
    const {
      kantin_id,
      nama,
    } = req.body;

    if (!kantin_id || !nama) {
      return res.status(400).json({
        success: false,
        message: "Kantin dan nama kategori wajib diisi",
      });
    }

    // ==========================================
    // CEK AKSES ADMIN KANTIN
    // ==========================================

    if (
      req.user.role === "admin_kantin" &&
      Number(kantin_id) !== Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Anda hanya dapat membuat kategori di kantin sendiri",
      });
    }

    // ==========================================
    // CEK AKSES ADMIN FAKULTAS
    // ==========================================

    if (req.user.role === "admin_fakultas") {
      const [kantin] = await db.query(
        `
        SELECT id
        FROM kantin
        WHERE id = ?
        AND fakultas_id = ?
        `,
        [
          kantin_id,
          req.user.fakultas_id,
        ]
      );

      if (kantin.length === 0) {
        return res.status(403).json({
          success: false,
          message:
            "Kantin bukan bagian dari fakultas Anda",
        });
      }
    }

    // ==========================================
    // CEK KANTIN
    // ==========================================

    const [kantin] = await db.query(
      `
      SELECT id
      FROM kantin
      WHERE id = ?
      `,
      [kantin_id]
    );

    if (kantin.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kantin tidak ditemukan",
      });
    }

    // ==========================================
    // INSERT
    // ==========================================

    const [result] = await db.query(
      `
      INSERT INTO kategori
      (
        kantin_id,
        nama
      )
      VALUES (?, ?)
      `,
      [
        kantin_id,
        nama,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat",
      data: {
        id: result.insertId,
        kantin_id: Number(kantin_id),
        nama,
      },
    });
  } catch (error) {
    console.error("Create Kategori Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal membuat kategori",
    });
  }
};


// ==========================================
// UPDATE KATEGORI
// ==========================================

const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;

    if (!nama) {
      return res.status(400).json({
        success: false,
        message: "Nama kategori wajib diisi",
      });
    }

    const [kategori] = await db.query(
      `
      SELECT
        k.id,
        k.kantin_id,
        kt.fakultas_id
      FROM kategori k
      INNER JOIN kantin kt
        ON k.kantin_id = kt.id
      WHERE k.id = ?
      `,
      [id]
    );

    if (kategori.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const data = kategori[0];

    // Admin Kantin
    if (
      req.user.role === "admin_kantin" &&
      Number(data.kantin_id) !==
        Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    // Admin Fakultas
    if (
      req.user.role === "admin_fakultas" &&
      Number(data.fakultas_id) !==
        Number(req.user.fakultas_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    await db.query(
      `
      UPDATE kategori
      SET nama = ?
      WHERE id = ?
      `,
      [
        nama,
        id,
      ]
    );

    return res.json({
      success: true,
      message: "Kategori berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update Kategori Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui kategori",
    });
  }
};


// ==========================================
// DELETE KATEGORI
// ==========================================

const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    const [kategori] = await db.query(
      `
      SELECT
        k.id,
        k.kantin_id,
        kt.fakultas_id
      FROM kategori k
      INNER JOIN kantin kt
        ON k.kantin_id = kt.id
      WHERE k.id = ?
      `,
      [id]
    );

    if (kategori.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const data = kategori[0];

    // Admin Kantin
    if (
      req.user.role === "admin_kantin" &&
      Number(data.kantin_id) !==
        Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    // Admin Fakultas
    if (
      req.user.role === "admin_fakultas" &&
      Number(data.fakultas_id) !==
        Number(req.user.fakultas_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    await db.query(
      "DELETE FROM kategori WHERE id = ?",
      [id]
    );

    return res.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete Kategori Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghapus kategori",
    });
  }
};


module.exports = {
  getAllKategori,
  getKategoriByKantin,
  createKategori,
  updateKategori,
  deleteKategori,
};