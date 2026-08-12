const bcrypt = require("bcryptjs");
const db = require("../config/db");

// ==========================================
// GET SEMUA ADMIN
// ==========================================

const getAllAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.id,
        u.nama,
        u.email,
        u.role,
        u.fakultas_id,
        u.kantin_id,
        u.status,
        f.nama AS nama_fakultas,
        k.nama AS nama_kantin,
        u.created_at
      FROM users u
      LEFT JOIN fakultas f
        ON u.fakultas_id = f.id
      LEFT JOIN kantin k
        ON u.kantin_id = k.id
      WHERE u.role IN ('admin_fakultas', 'admin_kantin')
      ORDER BY u.id DESC
    `);

    res.json({
      success: true,
      message: "Data admin berhasil diambil",
      data: rows,
    });
  } catch (error) {
    console.error("Get Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data admin",
    });
  }
};


// ==========================================
// CREATE ADMIN FAKULTAS
// ==========================================

const createAdminFakultas = async (req, res) => {
  try {
    const {
      nama,
      email,
      password,
      fakultas_id,
    } = req.body;

    if (!nama || !email || !password || !fakultas_id) {
      return res.status(400).json({
        success: false,
        message:
          "Nama, email, password, dan fakultas wajib diisi",
      });
    }

    // Cek email
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah digunakan",
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin fakultas
    const [result] = await db.query(
      `
      INSERT INTO users
      (
        nama,
        email,
        password,
        role,
        fakultas_id,
        kantin_id,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nama,
        email,
        hashedPassword,
        "admin_fakultas",
        fakultas_id,
        null,
        "aktif",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Admin Fakultas berhasil dibuat",
      data: {
        id: result.insertId,
        nama,
        email,
        role: "admin_fakultas",
        fakultas_id,
        status: "aktif",
      },
    });
  } catch (error) {
    console.error("Create Admin Fakultas Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal membuat Admin Fakultas",
    });
  }
};


// ==========================================
// CREATE ADMIN KANTIN
// ==========================================

const createAdminKantin = async (req, res) => {
  try {
    const {
      nama,
      email,
      password,
      kantin_id,
    } = req.body;

    if (!nama || !email || !password || !kantin_id) {
      return res.status(400).json({
        success: false,
        message:
          "Nama, email, password, dan kantin wajib diisi",
      });
    }

    // Cek email
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    // Cek kantin
    const [kantin] = await db.query(
      "SELECT id FROM kantin WHERE id = ?",
      [kantin_id]
    );

    if (kantin.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kantin tidak ditemukan",
      });
    }

    // Cek apakah kantin sudah memiliki admin
    const [existingAdmin] = await db.query(
      `
      SELECT id
      FROM users
      WHERE role = 'admin_kantin'
      AND kantin_id = ?
      `,
      [kantin_id]
    );

    if (existingAdmin.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Kantin sudah memiliki Admin Kantin",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert
    const [result] = await db.query(
      `
      INSERT INTO users
      (
        nama,
        email,
        password,
        role,
        fakultas_id,
        kantin_id,
        status
      )
      SELECT
        ?,
        ?,
        ?,
        'admin_kantin',
        fakultas_id,
        ?,
        'aktif'
      FROM kantin
      WHERE id = ?
      `,
      [
        nama,
        email,
        hashedPassword,
        kantin_id,
        kantin_id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Admin Kantin berhasil dibuat",
      data: {
        id: result.insertId,
        nama,
        email,
        role: "admin_kantin",
        kantin_id,
        status: "aktif",
      },
    });
  } catch (error) {
    console.error("Create Admin Kantin Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal membuat Admin Kantin",
    });
  }
};


// ==========================================
// UPDATE STATUS ADMIN
// ==========================================

const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["aktif", "nonaktif"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status harus aktif atau nonaktif",
      });
    }

    const [result] = await db.query(
      `
      UPDATE users
      SET status = ?
      WHERE id = ?
      AND role IN ('admin_fakultas', 'admin_kantin')
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: `Admin berhasil ${status}`,
    });
  } catch (error) {
    console.error("Update Admin Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Gagal mengubah status admin",
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, password } = req.body;

    if (!nama || !email) {
      return res.status(400).json({
        success: false,
        message: "Nama dan email wajib diisi",
      });
    }

    // Cek apakah email sudah digunakan oleh user lain
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah digunakan oleh user lain",
      });
    }

    // Jika password diisi, update password baru (hashed). Jika tidak, pakai password lama.
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        "UPDATE users SET nama = ?, email = ?, password = ? WHERE id = ? AND role IN ('admin_fakultas', 'admin_kantin')",
        [nama, email, hashedPassword, id]
      );
    } else {
      await db.query(
        "UPDATE users SET nama = ?, email = ? WHERE id = ? AND role IN ('admin_fakultas', 'admin_kantin')",
        [nama, email, id]
      );
    }

    res.json({
      success: true,
      message: "Data admin berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui data admin",
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM users 
      WHERE id = ? 
      AND role IN ('admin_fakultas', 'admin_kantin')
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Admin berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus admin (mungkin terikat data lain)",
    });
  }
};

module.exports = {
  getAllAdmin,
  createAdminFakultas,
  createAdminKantin,
  updateAdminStatus,
  updateAdmin,
  deleteAdmin,
};