// ==========================================
// CEK AKSES FAKULTAS
// ==========================================

const fakultasAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User belum login",
    });
  }

  // Super Admin boleh mengakses semuanya
  if (req.user.role === "super_admin") {
    return next();
  }

  // Hanya Admin Fakultas
  if (req.user.role !== "admin_fakultas") {
    return res.status(403).json({
      success: false,
      message: "Akses hanya untuk Admin Fakultas",
    });
  }

  const fakultasId =
    req.params.fakultasId ||
    req.params.id ||
    req.body.fakultas_id;

  if (Number(fakultasId) !== Number(req.user.fakultas_id)) {
    return res.status(403).json({
      success: false,
      message:
        "Anda tidak memiliki akses ke fakultas ini",
    });
  }

  next();
};


// ==========================================
// CEK AKSES KANTIN
// ==========================================

const kantinAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User belum login",
    });
  }

  // Super Admin boleh mengakses semuanya
  if (req.user.role === "super_admin") {
    return next();
  }

  // Admin Fakultas dan Admin Kantin
  if (
    req.user.role !== "admin_fakultas" &&
    req.user.role !== "admin_kantin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Anda tidak memiliki akses",
    });
  }

  const kantinId =
    req.params.kantinId ||
    req.params.id ||
    req.body.kantin_id;

  // Admin Kantin hanya boleh kantinnya sendiri
  if (req.user.role === "admin_kantin") {
    if (
      Number(kantinId) !==
      Number(req.user.kantin_id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Anda tidak memiliki akses ke kantin ini",
      });
    }
  }

  next();
};


module.exports = {
  fakultasAccess,
  kantinAccess,
};