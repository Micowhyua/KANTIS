const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    // Cari user
    const [users] = await db.query(
      `SELECT
        id,
        nama,
        email,
        password,
        role,
        fakultas_id,
        kantin_id,
        status
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const user = users[0];

    // Cek status
    if (user.status !== "aktif") {
      return res.status(403).json({
        success: false,
        message: "Akun tidak aktif",
      });
    }

    // Cek password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        nama: user.nama,
        role: user.role,
        fakultas_id: user.fakultas_id,
        kantin_id: user.kantin_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    // Jangan kirim password
    delete user.password;

    return res.json({
      success: true,
      message: "Login berhasil",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  login,
};