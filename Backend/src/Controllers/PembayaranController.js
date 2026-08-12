const db = require("../config/db");

// ==========================================
// BUAT PEMBAYARAN
// ==========================================

const createPembayaran = async (req, res) => {
  try {
    const { pesanan_id } = req.body;

    if (!pesanan_id) {
      return res.status(400).json({
        success: false,
        message: "pesanan_id wajib diisi",
      });
    }

    // Cek pesanan
    const [pesanan] = await db.query(
      `
      SELECT
        id,
        kode_pesanan,
        total,
        status
      FROM pesanan
      WHERE id = ?
      LIMIT 1
      `,
      [pesanan_id]
    );

    if (pesanan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan",
      });
    }

    const dataPesanan = pesanan[0];

    // Pesanan dibatalkan tidak bisa dibayar
    if (dataPesanan.status === "dibatalkan") {
      return res.status(400).json({
        success: false,
        message: "Pesanan sudah dibatalkan",
      });
    }

    // Cek apakah pembayaran sudah ada
    const [existingPayment] = await db.query(
      `
      SELECT
        id,
        pesanan_id,
        jumlah,
        status,
        reference_id,
        paid_at
      FROM pembayaran
      WHERE pesanan_id = ?
      LIMIT 1
      `,
      [pesanan_id]
    );

    if (existingPayment.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Pembayaran untuk pesanan ini sudah dibuat",
        data: existingPayment[0],
      });
    }

    // Buat reference ID sementara
    // Nanti akan diganti reference dari payment gateway
    const referenceId =
      `QRIS-${Date.now()}-${pesanan_id}`;

    // Insert pembayaran
    const [result] = await db.query(
      `
      INSERT INTO pembayaran
      (
        pesanan_id,
        jumlah,
        status,
        reference_id
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        pesanan_id,
        dataPesanan.total,
        "menunggu",
        referenceId,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Pembayaran berhasil dibuat",
      data: {
        id: result.insertId,
        pesanan_id: dataPesanan.id,
        kode_pesanan: dataPesanan.kode_pesanan,
        jumlah: dataPesanan.total,
        status: "menunggu",
        reference_id: referenceId,
      },
    });

  } catch (error) {
    console.error(
      "Create Pembayaran Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal membuat pembayaran",
    });
  }
};


// ==========================================
// GET PEMBAYARAN BERDASARKAN PESANAN
// ==========================================

const getPembayaranByPesanan = async (
  req,
  res
) => {
  try {
    const { pesanan_id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.pesanan_id,
        ps.kode_pesanan,
        p.jumlah,
        p.status,
        p.reference_id,
        p.paid_at,
        p.created_at
      FROM pembayaran p

      INNER JOIN pesanan ps
        ON p.pesanan_id = ps.id

      WHERE p.pesanan_id = ?

      LIMIT 1
      `,
      [pesanan_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pembayaran belum dibuat",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error(
      "Get Pembayaran Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data pembayaran",
    });
  }
};


// ==========================================
// UPDATE STATUS PEMBAYARAN
// SEMENTARA UNTUK TESTING
// ==========================================

const updateStatusPembayaran = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValid = [
      "menunggu",
      "berhasil",
      "gagal",
      "dibatalkan",
      "dikembalikan",
    ];

    if (!statusValid.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status pembayaran tidak valid",
      });
    }

    const [pembayaran] = await db.query(
      `
      SELECT
        id,
        pesanan_id,
        status
      FROM pembayaran
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (pembayaran.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pembayaran tidak ditemukan",
      });
    }

    const dataPembayaran = pembayaran[0];

    let paidAt = null;

    if (status === "berhasil") {
      paidAt = new Date();
    }

    await db.query(
      `
      UPDATE pembayaran
      SET
        status = ?,
        paid_at = ?
      WHERE id = ?
      `,
      [
        status,
        paidAt,
        id,
      ]
    );

    // Jika pembayaran berhasil,
    // pesanan dikonfirmasi
    if (status === "berhasil") {
      await db.query(
        `
        UPDATE pesanan
        SET status = 'dikonfirmasi'
        WHERE id = ?
        `,
        [dataPembayaran.pesanan_id]
      );
    }

    // Jika pembayaran dibatalkan/gagal,
    // pesanan dibatalkan
    if (
      status === "gagal" ||
      status === "dibatalkan"
    ) {
      await db.query(
        `
        UPDATE pesanan
        SET status = 'dibatalkan'
        WHERE id = ?
        AND status NOT IN ('selesai', 'dibatalkan')
        `,
        [dataPembayaran.pesanan_id]
      );
    }

    return res.json({
      success: true,
      message: "Status pembayaran berhasil diperbarui",
      data: {
        id: Number(id),
        pesanan_id: dataPembayaran.pesanan_id,
        status,
        paid_at: paidAt,
      },
    });

  } catch (error) {
    console.error(
      "Update Pembayaran Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengubah status pembayaran",
    });
  }
};


module.exports = {
  createPembayaran,
  getPembayaranByPesanan,
  updateStatusPembayaran,
};