const db = require("../config/db");

// ==========================================
// GET SEMUA KANTIN
// ==========================================

const getAllKantin = async (req, res) => {
  try {
    let query = `
      SELECT
        k.id,
        k.nama,
        k.deskripsi,
        k.lokasi,
        k.foto,
        k.jam_buka,
        k.jam_tutup,
        k.status,
        k.fakultas_id,
        f.nama AS nama_fakultas,
        f.kode AS kode_fakultas,
        k.created_at
      FROM kantin k
      INNER JOIN fakultas f
        ON k.fakultas_id = f.id
    `;

    const params = [];

    // Admin Fakultas hanya melihat
    // kantin di fakultasnya
    if (req.user.role === "admin_fakultas") {
      query += " WHERE k.fakultas_id = ?";
      params.push(req.user.fakultas_id);
    }

    // Admin Kantin hanya melihat
    // kantinnya sendiri
    if (req.user.role === "admin_kantin") {
      query += " WHERE k.id = ?";
      params.push(req.user.kantin_id);
    }

    query += " ORDER BY k.id DESC";

    const [rows] = await db.query(
      query,
      params
    );

    res.json({
      success: true,
      message: "Data kantin berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Get Kantin Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kantin",
    });
  }
};

// ==========================================
// GET KANTIN BERDASARKAN ID
// ==========================================

const getKantinById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        k.id,
        k.nama,
        k.deskripsi,
        k.lokasi,
        k.foto,
        k.jam_buka,
        k.jam_tutup,
        k.status,
        k.fakultas_id,
        f.nama AS nama_fakultas,
        f.kode AS kode_fakultas,
        k.created_at
      FROM kantin k
      INNER JOIN fakultas f
        ON k.fakultas_id = f.id
      WHERE k.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kantin tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data kantin berhasil diambil",
      data: rows[0],
    });
  } catch (error) {
    console.error("Get Kantin By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kantin",
    });
  }
};


// ==========================================
// GET KANTIN BERDASARKAN FAKULTAS
// ==========================================

const getKantinByFakultas = async (req, res) => {
  try {
    const { fakultasId } = req.params;

    // Pastikan fakultas ada
    const [fakultas] = await db.query(
      "SELECT id FROM fakultas WHERE id = ?",
      [fakultasId]
    );

    if (fakultas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fakultas tidak ditemukan",
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        k.id,
        k.nama,
        k.deskripsi,
        k.lokasi,
        k.foto,
        k.jam_buka,
        k.jam_tutup,
        k.status,
        k.fakultas_id,
        k.created_at
      FROM kantin k
      WHERE k.fakultas_id = ?
      ORDER BY k.id DESC
      `,
      [fakultasId]
    );

    res.json({
      success: true,
      message: "Data kantin fakultas berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Get Kantin Fakultas Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kantin",
    });
  }
};


// ==========================================
// CREATE KANTIN
// ==========================================

const createKantin = async (req, res) => {
  try {
    const {
      fakultas_id,
      nama,
      deskripsi,
      lokasi,
      foto,
      jam_buka,
      jam_tutup,
      status,
    } = req.body;

    // ==========================================
    // VALIDASI INPUT
    // ==========================================

    if (!fakultas_id || !nama) {
      return res.status(400).json({
        success: false,
        message: "Fakultas dan nama kantin wajib diisi",
      });
    }

    // ==========================================
    // CEK AKSES ADMIN FAKULTAS
    // ==========================================

    // Admin Fakultas hanya boleh
    // membuat kantin di fakultasnya sendiri.
    //
    // Super Admin tetap boleh membuat
    // kantin di fakultas mana pun.

    if (
      req.user.role === "admin_fakultas" &&
      Number(fakultas_id) !== Number(req.user.fakultas_id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Anda hanya dapat membuat kantin di fakultas sendiri",
      });
    }

    // ==========================================
    // CEK FAKULTAS
    // ==========================================

    const [fakultas] = await db.query(
      "SELECT id, nama, kode FROM fakultas WHERE id = ?",
      [fakultas_id]
    );

    if (fakultas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fakultas tidak ditemukan",
      });
    }

    // ==========================================
    // INSERT KANTIN
    // ==========================================

    const [result] = await db.query(
      `
      INSERT INTO kantin
      (
        fakultas_id,
        nama,
        deskripsi,
        lokasi,
        foto,
        jam_buka,
        jam_tutup,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        fakultas_id,
        nama,
        deskripsi || null,
        lokasi || null,
        foto || null,
        jam_buka || null,
        jam_tutup || null,
        status || "tutup",
      ]
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Kantin berhasil ditambahkan",
      data: {
        id: result.insertId,
        fakultas_id: Number(fakultas_id),
        nama,
        deskripsi: deskripsi || null,
        lokasi: lokasi || null,
        foto: foto || null,
        jam_buka: jam_buka || null,
        jam_tutup: jam_tutup || null,
        status: status || "tutup",

        fakultas: {
          id: fakultas[0].id,
          nama: fakultas[0].nama,
          kode: fakultas[0].kode,
        },
      },
    });
  } catch (error) {
    console.error("Create Kantin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan kantin",
    });
  }
};

// ==========================================
// UPDATE KANTIN
// ==========================================

const updateKantin = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fakultas_id,
      nama,
      deskripsi,
      lokasi,
      foto,
      jam_buka,
      jam_tutup,
      status,
    } = req.body;

    if (!fakultas_id || !nama) {
      return res.status(400).json({
        success: false,
        message: "Fakultas dan nama kantin wajib diisi",
      });
    }

    // Cek kantin
    const [kantin] = await db.query(
      "SELECT id FROM kantin WHERE id = ?",
      [id]
    );

    if (kantin.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kantin tidak ditemukan",
      });
    }

    // Cek fakultas
    const [fakultas] = await db.query(
      "SELECT id FROM fakultas WHERE id = ?",
      [fakultas_id]
    );

    if (fakultas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fakultas tidak ditemukan",
      });
    }

    await db.query(
      `
      UPDATE kantin
      SET
        fakultas_id = ?,
        nama = ?,
        deskripsi = ?,
        lokasi = ?,
        foto = ?,
        jam_buka = ?,
        jam_tutup = ?,
        status = ?
      WHERE id = ?
      `,
      [
        fakultas_id,
        nama,
        deskripsi || null,
        lokasi || null,
        foto || null,
        jam_buka || null,
        jam_tutup || null,
        status || "tutup",
        id,
      ]
    );

    res.json({
      success: true,
      message: "Kantin berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update Kantin Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal memperbarui kantin",
    });
  }
};


// ==========================================
// DELETE KANTIN
// ==========================================

const deleteKantin = async (req, res) => {
  try {
    const { id } = req.params;

    const [kantin] = await db.query(
      "SELECT id FROM kantin WHERE id = ?",
      [id]
    );

    if (kantin.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kantin tidak ditemukan",
      });
    }

    await db.query(
      "DELETE FROM kantin WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Kantin berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete Kantin Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus kantin",
    });
  }
};


module.exports = {
  getAllKantin,
  getKantinById,
  getKantinByFakultas,
  createKantin,
  updateKantin,
  deleteKantin,
};