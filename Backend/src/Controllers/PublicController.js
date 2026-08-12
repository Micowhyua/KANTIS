const db = require("../config/db");

// ==========================================
// GET SEMUA FAKULTAS
// ==========================================

const getPublicFakultas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        f.id,
        f.nama,
        f.kode,

        COUNT(k.id) AS jumlah_kantin

      FROM fakultas f

      LEFT JOIN kantin k
        ON f.id = k.fakultas_id
        AND k.status = 'buka'

      GROUP BY
        f.id,
        f.nama,
        f.kode

      ORDER BY f.nama ASC
    `);

    return res.json({
      success: true,
      message: "Data fakultas berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Public Fakultas Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data fakultas",
    });
  }
};


// ==========================================
// GET SEMUA KANTIN
// ==========================================

const getPublicKantin = async (req, res) => {
  try {
    const {
      fakultas_id,
      search,
    } = req.query;

    let query = `
      SELECT
        k.id,
        k.fakultas_id,
        k.nama,
        k.deskripsi,
        k.lokasi,
        k.foto,
        k.jam_buka,
        k.jam_tutup,
        k.status,

        f.nama AS nama_fakultas,
        f.kode AS kode_fakultas

      FROM kantin k

      INNER JOIN fakultas f
        ON k.fakultas_id = f.id

      WHERE 1 = 1
    `;

    const params = [];

    // Filter fakultas
    if (fakultas_id) {
      query += `
        AND k.fakultas_id = ?
      `;

      params.push(fakultas_id);
    }

    // Search kantin
    if (search) {
      query += `
        AND k.nama LIKE ?
      `;

      params.push(`%${search}%`);
    }

    query += `
      ORDER BY k.nama ASC
    `;

    const [rows] = await db.query(
      query,
      params
    );

    return res.json({
      success: true,
      message: "Data kantin berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Public Kantin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data kantin",
    });
  }
};


// ==========================================
// GET DETAIL KANTIN
// ==========================================

const getPublicKantinById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        k.id,
        k.fakultas_id,
        k.nama,
        k.deskripsi,
        k.lokasi,
        k.foto,
        k.jam_buka,
        k.jam_tutup,
        k.status,

        f.nama AS nama_fakultas,
        f.kode AS kode_fakultas

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

    return res.json({
      success: true,
      message: "Detail kantin berhasil diambil",
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "Public Detail Kantin Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail kantin",
    });
  }
};


// ==========================================
// GET KATEGORI KANTIN
// ==========================================

const getPublicKategoriByKantin = async (
  req,
  res
) => {
  try {
    const { kantinId } = req.params;

    // Cek kantin
    const [kantin] = await db.query(
      `
      SELECT id
      FROM kantin
      WHERE id = ?
      `,
      [kantinId]
    );

    if (kantin.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kantin tidak ditemukan",
      });
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

      ORDER BY nama ASC
      `,
      [kantinId]
    );

    return res.json({
      success: true,
      message: "Kategori berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error(
      "Public Kategori Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori",
    });
  }
};


// ==========================================
// GET PRODUK KANTIN
// ==========================================

const getPublicProdukByKantin = async (
  req,
  res
) => {
  try {
    const { kantinId } = req.params;

    const {
      kategori_id,
      search,
    } = req.query;

    // Cek kantin
    const [kantin] = await db.query(
      `
      SELECT
        id,
        nama,
        status

      FROM kantin

      WHERE id = ?
      `,
      [kantinId]
    );

    if (kantin.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kantin tidak ditemukan",
      });
    }

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

        k.nama AS nama_kategori

      FROM produk p

      LEFT JOIN kategori k
        ON p.kategori_id = k.id

      WHERE p.kantin_id = ?

      AND p.status = 'tersedia'

      AND p.stok > 0
    `;

    const params = [kantinId];

    // Filter kategori
    if (kategori_id) {
      query += `
        AND p.kategori_id = ?
      `;

      params.push(kategori_id);
    }

    // Search produk
    if (search) {
      query += `
        AND p.nama LIKE ?
      `;

      params.push(`%${search}%`);
    }

    query += `
      ORDER BY
        k.nama ASC,
        p.nama ASC
    `;

    const [rows] = await db.query(
      query,
      params
    );

    return res.json({
      success: true,
      message: "Produk berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error(
      "Public Produk Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
    });
  }
};


// ==========================================
// GET DETAIL PRODUK
// ==========================================

const getPublicProdukById = async (
  req,
  res
) => {
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

      AND p.status = 'tersedia'

      AND p.stok > 0
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Produk tidak ditemukan atau sedang tidak tersedia",
      });
    }

    return res.json({
      success: true,
      message: "Detail produk berhasil diambil",
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "Public Detail Produk Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail produk",
    });
  }
};


module.exports = {
  getPublicFakultas,
  getPublicKantin,
  getPublicKantinById,
  getPublicKategoriByKantin,
  getPublicProdukByKantin,
  getPublicProdukById,
};