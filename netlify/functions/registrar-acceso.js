import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
});

const headers = { "Content-Type": "application/json" };

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, message: "Método no permitido" }),
    };
  }

  try {
    const { id, pasesUsar } = JSON.parse(event.body || "{}");
    const n = parseInt(pasesUsar, 10);

    if (!id || !Number.isInteger(n) || n <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, message: "Datos inválidos" }),
      };
    }

    // Actualización atómica: solo suma si aceptó y no excede los pases.
    const { rows } = await pool.query(
      `
      UPDATE "IsmaLuisa"
      SET pasesuti = COALESCE(pasesuti, 0) + $1::int
      WHERE id = $2
        AND acepto = true
        AND COALESCE(rechazo, false) = false
        AND COALESCE(pasesuti, 0) + $1::int <= "Pases"
      RETURNING
        id,
        "familiaNombre" AS familia,
        "FamiliaDesc"   AS displayname,
        "Mesa"          AS mesa,
        "Pases"         AS pases,
        pasesuti
      `,
      [n, id],
    );

    if (!rows.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          ok: false,
          message:
            "No se pudo registrar: pases excedidos o invitación no aceptada.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, invitado: rows[0] }),
    };
  } catch (err) {
    console.error("registrar-acceso:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
