const db = require("../Config/db");

// =====================================================
// BUAT PESANAN
// POST /api/pesanan
// PUBLIC
// =====================================================

const createPesanan = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      nama_pemesan,
      kantin_id,
      catatan,
      items,
    } = req.body;

    // ===============================
    // VALIDASI
    // ===============================

    if (!nama_pemesan || !kantin_id || !items) {
      return res.status(400).json({
        success: false,
        message:
          "Nama pemesan, kantin, dan produk wajib diisi",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal harus ada 1 produk",
      });
    }

    // ===============================
    // CEK KANTIN
    // ===============================

    const [kantin] = await connection.query(
      `
      SELECT
        id,
        nama,
        status
      FROM kantin
      WHERE id = ?
      LIMIT 1
      `,
      [kantin_id]
    );

    if (kantin.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kantin tidak ditemukan",
      });
    }

    if (kantin[0].status !== "buka") {
      return res.status(400).json({
        success: false,
        message: "Kantin sedang tutup",
      });
    }

    // ===============================
    // MULAI TRANSACTION
    // ===============================

    await connection.beginTransaction();

    let total = 0;
    const detailPesanan = [];

    // ===============================
    // CEK PRODUK
    // ===============================

    for (const item of items) {
      const {
        produk_id,
        jumlah,
      } = item;

      if (!produk_id || !jumlah || jumlah <= 0) {
        throw new Error(
          "Produk dan jumlah harus valid"
        );
      }

      const [produk] = await connection.query(
        `
        SELECT
          id,
          kantin_id,
          nama,
          harga,
          stok,
          status
        FROM produk
        WHERE id = ?
        LIMIT 1
        `,
        [produk_id]
      );

      if (produk.length === 0) {
        throw new Error(
          `Produk dengan ID ${produk_id} tidak ditemukan`
        );
      }

      const dataProduk = produk[0];

      // ===============================
      // PASTIKAN PRODUK MILIK KANTIN
      // ===============================

      if (
        Number(dataProduk.kantin_id) !==
        Number(kantin_id)
      ) {
        throw new Error(
          `Produk ${dataProduk.nama} bukan milik kantin ini`
        );
      }

      // ===============================
      // CEK STATUS PRODUK
      // ===============================

      if (dataProduk.status !== "tersedia") {
        throw new Error(
          `Produk ${dataProduk.nama} sedang tidak tersedia`
        );
      }

      // ===============================
      // CEK STOK
      // ===============================

      if (
        Number(dataProduk.stok) <
        Number(jumlah)
      ) {
        throw new Error(
          `Stok ${dataProduk.nama} tidak mencukupi`
        );
      }

      const harga = Number(dataProduk.harga);
      const qty = Number(jumlah);

      const subtotal = harga * qty;

      total += subtotal;

      detailPesanan.push({
        produk_id: dataProduk.id,
        nama_produk: dataProduk.nama,
        harga,
        jumlah: qty,
        subtotal,
      });
    }

    // ===============================
    // GENERATE KODE PESANAN
    // ===============================

    const timestamp = Date.now();

    const kodePesanan =
      `PSN-${timestamp}`;

    // ===============================
    // INSERT PESANAN
    // ===============================

    const [resultPesanan] =
      await connection.query(
        `
        INSERT INTO pesanan (
          kode_pesanan,
          nama_pemesan,
          kantin_id,
          total,
          status,
          catatan
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          kodePesanan,
          nama_pemesan.trim(),
          kantin_id,
          total,
          "menunggu",
          catatan || null,
        ]
      );

    const pesananId =
      resultPesanan.insertId;

    // ===============================
    // INSERT DETAIL PESANAN
    // ===============================

    for (const item of detailPesanan) {
      await connection.query(
        `
        INSERT INTO detail_pesanan (
          pesanan_id,
          produk_id,
          jumlah,
          harga,
          subtotal
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          pesananId,
          item.produk_id,
          item.jumlah,
          item.harga,
          item.subtotal,
        ]
      );

      // ===============================
      // KURANGI STOK
      // ===============================

      await connection.query(
        `
        UPDATE produk
        SET stok = stok - ?
        WHERE id = ?
        `,
        [
          item.jumlah,
          item.produk_id,
        ]
      );
    }

    // ===============================
    // COMMIT
    // ===============================

    await connection.commit();

    // ===============================
    // RESPONSE
    // ===============================

    return res.status(201).json({
      success: true,

      message:
        "Pesanan berhasil dibuat",

      data: {
        id: pesananId,

        kode_pesanan:
          kodePesanan,

        nama_pemesan:
          nama_pemesan.trim(),

        kantin: kantin[0].nama,

        total,

        status:
          "menunggu",

        catatan:
          catatan || null,

        items:
          detailPesanan,
      },
    });

  } catch (error) {

    // ===============================
    // ROLLBACK
    // ===============================

    await connection.rollback();

    console.error(
      "Create Pesanan Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Gagal membuat pesanan",
    });

  } finally {
    connection.release();
  }
};


// =====================================================
// GET SEMUA PESANAN
// GET /api/pesanan
// ADMIN
// =====================================================

const getPesanan = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        p.id,
        p.kode_pesanan,
        p.nama_pemesan,
        p.kantin_id,
        k.nama AS nama_kantin,
        p.total,
        p.status,
        p.catatan,
        p.created_at,
        p.updated_at
      FROM pesanan p

      INNER JOIN kantin k
        ON p.kantin_id = k.id

      ORDER BY p.id DESC
    `);

    return res.json({
      success: true,
      data: rows,
    });

  } catch (error) {

    console.error(
      "Get Pesanan Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil data pesanan",
    });
  }
};


// =====================================================
// GET PESANAN BERDASARKAN ID
// GET /api/pesanan/:id
// =====================================================

const getPesananById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const [pesanan] =
      await db.query(
        `
        SELECT
          p.id,
          p.kode_pesanan,
          p.nama_pemesan,
          p.kantin_id,
          k.nama AS nama_kantin,
          p.total,
          p.status,
          p.catatan,
          p.created_at,
          p.updated_at
        FROM pesanan p

        INNER JOIN kantin k
          ON p.kantin_id = k.id

        WHERE p.id = ?

        LIMIT 1
        `,
        [id]
      );

    if (pesanan.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Pesanan tidak ditemukan",
      });
    }

    const [detail] =
      await db.query(
        `
        SELECT
          dp.id,
          dp.pesanan_id,
          dp.produk_id,
          pr.nama AS nama_produk,
          dp.jumlah,
          dp.harga,
          dp.subtotal
        FROM detail_pesanan dp

        INNER JOIN produk pr
          ON dp.produk_id = pr.id

        WHERE dp.pesanan_id = ?

        ORDER BY dp.id ASC
        `,
        [id]
      );

    return res.json({
      success: true,

      data: {
        ...pesanan[0],

        items: detail,
      },
    });

  } catch (error) {

    console.error(
      "Get Pesanan By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil detail pesanan",
    });
  }
};


// =====================================================
// UPDATE STATUS PESANAN
// PATCH /api/pesanan/:id/status
// ADMIN KANTIN
// =====================================================

const updateStatusPesanan = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    const statusValid = [
      "menunggu",
      "dikonfirmasi",
      "diproses",
      "siap_diambil",
      "selesai",
      "dibatalkan",
    ];

    if (!statusValid.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status pesanan tidak valid",
      });
    }

    const [pesanan] =
      await db.query(
        `
        SELECT
          id,
          status
        FROM pesanan
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

    if (pesanan.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Pesanan tidak ditemukan",
      });
    }

    await db.query(
      `
      UPDATE pesanan

      SET status = ?

      WHERE id = ?
      `,
      [
        status,
        id,
      ]
    );

    return res.json({
      success: true,

      message:
        "Status pesanan berhasil diperbarui",

      data: {
        id: Number(id),

        status,
      },
    });

  } catch (error) {

    console.error(
      "Update Status Pesanan Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengubah status pesanan",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createPesanan,
  getPesanan,
  getPesananById,
  updateStatusPesanan,
};