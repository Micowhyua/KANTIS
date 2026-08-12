const db = require("../config/db");

// ==========================================
// GET SEMUA PRODUK
// ==========================================

const getAllProduk = async (req, res) => {
  try {
    let query = `
      SELECT
        p.id,
        p.kantin_id,
        p.kategori_id,
        p.nama,
        p.deskripsi,
        p.harga,
        p.foto,
        p.stok,
        p.status,
        p.created_at,
        p.updated_at,

        k.nama AS nama_kategori,
        kt.nama AS nama_kantin,
        f.nama AS nama_fakultas

      FROM produk p

      INNER JOIN kantin kt
        ON p.kantin_id = kt.id

      INNER JOIN fakultas f
        ON kt.fakultas_id = f.id

      LEFT JOIN kategori k
        ON p.kategori_id = k.id
    `;

    const params = [];

    // ==========================================
    // ADMIN FAKULTAS
    // ==========================================

    if (req.user.role === "admin_fakultas") {
      query += `
        WHERE kt.fakultas_id = ?
      `;

      params.push(req.user.fakultas_id);
    }

    // ==========================================
    // ADMIN KANTIN
    // ==========================================

    if (req.user.role === "admin_kantin") {
      query += `
        WHERE p.kantin_id = ?
      `;

      params.push(req.user.kantin_id);
    }

    query += `
      ORDER BY p.id DESC
    `;

    const [rows] = await db.query(
      query,
      params
    );

    return res.json({
      success: true,
      message: "Data produk berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Get Produk Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data produk",
    });
  }
};


// ==========================================
// GET PRODUK BERDASARKAN ID
// ==========================================

const getProdukById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.kantin_id,
        p.kategori_id,
        p.nama,
        p.deskripsi,
        p.harga,
        p.foto,
        p.stok,
        p.status,
        p.created_at,
        p.updated_at,

        k.nama AS nama_kategori,
        kt.nama AS nama_kantin,
        f.nama AS nama_fakultas

      FROM produk p

      INNER JOIN kantin kt
        ON p.kantin_id = kt.id

      INNER JOIN fakultas f
        ON kt.fakultas_id = f.id

      LEFT JOIN kategori k
        ON p.kategori_id = k.id

      WHERE p.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    const produk = rows[0];

    // ==========================================
    // CEK ADMIN KANTIN
    // ==========================================

    if (
      req.user.role === "admin_kantin" &&
      Number(produk.kantin_id) !==
        Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    // ==========================================
    // CEK ADMIN FAKULTAS
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
          produk.kantin_id,
          req.user.fakultas_id,
        ]
      );

      if (kantin.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses",
        });
      }
    }

    return res.json({
      success: true,
      message: "Produk berhasil diambil",
      data: produk,
    });
  } catch (error) {
    console.error(
      "Get Produk By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
    });
  }
};


// ==========================================
// GET PRODUK BERDASARKAN KANTIN
// ==========================================

const getProdukByKantin = async (req, res) => {
  try {
    const { kantinId } = req.params;

    // ==========================================
    // ADMIN KANTIN
    // ==========================================

    if (
      req.user.role === "admin_kantin" &&
      Number(kantinId) !==
        Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Anda hanya dapat melihat produk kantin sendiri",
      });
    }

    // ==========================================
    // ADMIN FAKULTAS
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
          kantinId,
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

    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.kantin_id,
        p.kategori_id,
        p.nama,
        p.deskripsi,
        p.harga,
        p.foto,
        p.stok,
        p.status,
        p.created_at,
        p.updated_at,

        k.nama AS nama_kategori

      FROM produk p

      LEFT JOIN kategori k
        ON p.kategori_id = k.id

      WHERE p.kantin_id = ?

      ORDER BY p.id DESC
      `,
      [kantinId]
    );

    return res.json({
      success: true,
      message: "Produk kantin berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error(
      "Get Produk By Kantin Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
    });
  }
};


// ==========================================
// CREATE PRODUK
// ==========================================

const createProduk = async (req, res) => {
  try {
    const {
      kantin_id,
      kategori_id,
      nama,
      deskripsi,
      harga,
      foto,
      stok,
      status,
    } = req.body;

    // ==========================================
    // VALIDASI
    // ==========================================

    if (
      !kantin_id ||
      !nama ||
      harga === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Kantin, nama produk, dan harga wajib diisi",
      });
    }

    if (Number(harga) < 0) {
      return res.status(400).json({
        success: false,
        message: "Harga tidak boleh negatif",
      });
    }

    if (stok !== undefined && Number(stok) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stok tidak boleh negatif",
      });
    }

    // ==========================================
    // CEK AKSES ADMIN KANTIN
    // ==========================================

    if (
      req.user.role === "admin_kantin" &&
      Number(kantin_id) !==
        Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Anda hanya dapat membuat produk di kantin sendiri",
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
    // CEK KATEGORI
    // ==========================================

    if (kategori_id) {
      const [kategori] = await db.query(
        `
        SELECT id
        FROM kategori
        WHERE id = ?
        AND kantin_id = ?
        `,
        [
          kategori_id,
          kantin_id,
        ]
      );

      if (kategori.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Kategori tidak ditemukan atau bukan milik kantin tersebut",
        });
      }
    }

    // ==========================================
    // INSERT PRODUK
    // ==========================================

    const [result] = await db.query(
      `
      INSERT INTO produk
      (
        kantin_id,
        kategori_id,
        nama,
        deskripsi,
        harga,
        foto,
        stok,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        kantin_id,
        kategori_id || null,
        nama,
        deskripsi || null,
        harga,
        foto || null,
        stok !== undefined ? stok : 0,
        status || "tersedia",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Produk berhasil dibuat",
      data: {
        id: result.insertId,
        kantin_id: Number(kantin_id),
        kategori_id: kategori_id
          ? Number(kategori_id)
          : null,
        nama,
        deskripsi: deskripsi || null,
        harga: Number(harga),
        foto: foto || null,
        stok:
          stok !== undefined
            ? Number(stok)
            : 0,
        status: status || "tersedia",
      },
    });
  } catch (error) {
    console.error("Create Produk Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal membuat produk",
    });
  }
};


// ==========================================
// UPDATE PRODUK
// ==========================================

const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      kategori_id,
      nama,
      deskripsi,
      harga,
      foto,
      stok,
      status,
    } = req.body;

    // ==========================================
    // CEK PRODUK
    // ==========================================

    const [produkRows] = await db.query(
      `
      SELECT
        p.id,
        p.kantin_id,
        kt.fakultas_id

      FROM produk p

      INNER JOIN kantin kt
        ON p.kantin_id = kt.id

      WHERE p.id = ?
      `,
      [id]
    );

    if (produkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    const produk = produkRows[0];

    // ==========================================
    // CEK ADMIN KANTIN
    // ==========================================

    if (
      req.user.role === "admin_kantin" &&
      Number(produk.kantin_id) !==
        Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    // ==========================================
    // CEK ADMIN FAKULTAS
    // ==========================================

    if (
      req.user.role === "admin_fakultas" &&
      Number(produk.fakultas_id) !==
        Number(req.user.fakultas_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    // ==========================================
    // CEK KATEGORI
    // ==========================================

    if (kategori_id) {
      const [kategori] = await db.query(
        `
        SELECT id
        FROM kategori
        WHERE id = ?
        AND kantin_id = ?
        `,
        [
          kategori_id,
          produk.kantin_id,
        ]
      );

      if (kategori.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Kategori bukan milik kantin produk",
        });
      }
    }

    // ==========================================
    // VALIDASI HARGA
    // ==========================================

    if (
      harga !== undefined &&
      Number(harga) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Harga tidak boleh negatif",
      });
    }

    // ==========================================
    // VALIDASI STOK
    // ==========================================

    if (
      stok !== undefined &&
      Number(stok) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stok tidak boleh negatif",
      });
    }

    // ==========================================
    // UPDATE
    // ==========================================

    await db.query(
      `
      UPDATE produk
      SET
        kategori_id = ?,
        nama = ?,
        deskripsi = ?,
        harga = ?,
        foto = ?,
        stok = ?,
        status = ?
      WHERE id = ?
      `,
      [
        kategori_id || null,
        nama,
        deskripsi || null,
        harga,
        foto || null,
        stok,
        status || "tersedia",
        id,
      ]
    );

    return res.json({
      success: true,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update Produk Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui produk",
    });
  }
};


// ==========================================
// DELETE PRODUK
// ==========================================

const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // CEK PRODUK
    // ==========================================

    const [produkRows] = await db.query(
      `
      SELECT
        p.id,
        p.kantin_id,
        kt.fakultas_id

      FROM produk p

      INNER JOIN kantin kt
        ON p.kantin_id = kt.id

      WHERE p.id = ?
      `,
      [id]
    );

    if (produkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    const produk = produkRows[0];

    // ==========================================
    // CEK ADMIN KANTIN
    // ==========================================

    if (
      req.user.role === "admin_kantin" &&
      Number(produk.kantin_id) !==
        Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    // ==========================================
    // CEK ADMIN FAKULTAS
    // ==========================================

    if (
      req.user.role === "admin_fakultas" &&
      Number(produk.fakultas_id) !==
        Number(req.user.fakultas_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    // ==========================================
    // DELETE
    // ==========================================

    await db.query(
      "DELETE FROM produk WHERE id = ?",
      [id]
    );

    return res.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete Produk Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghapus produk",
    });
  }
};


module.exports = {
  getAllProduk,
  getProdukById,
  getProdukByKantin,
  createProduk,
  updateProduk,
  deleteProduk,
};