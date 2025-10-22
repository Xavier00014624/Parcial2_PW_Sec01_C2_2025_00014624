import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "accounts.json");

function readAccounts() {
  const raw = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(raw);
}

function parseBalance(balanceStr) {
  if (typeof balanceStr === "number") return balanceStr;
  const cleaned = String(balanceStr).replace(/[^0-9.-]+/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export function getCuentas(req, res) {
  const accounts = readAccounts();
  const { queryParam } = req.query;

  if (!queryParam) {
    return res.json({
      count: accounts.length,
      data: accounts
    });
  }

  const q = String(queryParam).trim().toLowerCase();

  const byId = accounts.find(a => a._id.toLowerCase() === q);
  if (byId) {
    return res.json({
      finded: true,
      account: byId
    });
  }

  const byGender = accounts.filter(a => String(a.gender || "").toLowerCase() === q);
  if (byGender.length === 1) {
    return res.json({ finded: true, account: byGender[0] });
  } else if (byGender.length > 1) {
    return res.json({ finded: true, data: byGender });
  }

  const byName = accounts.filter(a => String(a.client || "").toLowerCase().includes(q));
  if (byName.length === 1) {
    return res.json({ finded: true, account: byName[0] });
  } else if (byName.length > 1) {
    return res.json({ finded: true, data: byName });
  }

  return res.json({ finded: false });
}

export function getCuentaById(req, res) {
  const accounts = readAccounts();
  const { id } = req.params;
  const found = accounts.find(a => a._id === id);

  return res.json({
    finded: !!found,
    account: found || null
  });
}

export function getCuentasBalance(req, res) {
  const accounts = readAccounts();
  const activeAccounts = accounts.filter(a => a.isActive === true);

  if (activeAccounts.length === 0) {
    return res.json({ status: false, accountBalance: 0 });
  }

  const total = activeAccounts.reduce((sum, acc) => sum + parseBalance(acc.balance), 0);

  return res.json({
    status: true,
    accountBalance: total
  });
}
