require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("../config/db");

const createSuperAdmin = async () => {
  try {
    const nama = "Super Admin";
    const email = "superadmin@kantin.com";
    const password = "admin123";

    // Cek apakah email sudah digunakan
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      console.log("⚠️ Super Admin sudah tersedia.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert Super Admin
    await db.query(
      `INSERT INTO users
        (nama, email, password, role, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nama,
        email,
        hashedPassword,
        "super_admin",
        "aktif",
      ]
    );

    console.log("=================================");
    console.log("✅ Super Admin berhasil dibuat");
    console.log("=================================");
    console.log(`Nama     : ${nama}`);
    console.log(`Email    : ${email}`);
    console.log(`Password : ${password}`);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal membuat Super Admin:");
    console.error(error);

    process.exit(1);
  }
};

createSuperAdmin();