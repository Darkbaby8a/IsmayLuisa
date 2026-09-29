import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
});

const headers = { "Content-Type": "application/json" };

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: "Método no permitido" }),
    };
  }

  const { familia } = event.queryStringParameters || {};

  if (!familia) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: "familia requerido" }),
    };
  }

  try {
    // ⚠️ Tabla y columnas con mayúsculas SIEMPRE entre comillas dobles,
    // si no Postgres las convierte a minúsculas y la consulta falla.
    const { rows } = await pool.query(
      `
      SELECT
        id,
        "familiaNombre"        AS familia,
        "FamiliaDesc"          AS displayname,
        "Mesa"                 AS mesa,
        "Pases"                AS pases,
        COALESCE(pasesuti, 0)  AS pasesuti,
        acepto,
        rechazo
      FROM "IsmaLuisa"
      WHERE LOWER(TRIM("familiaNombre")) = LOWER(TRIM($1))
      ORDER BY "FamiliaDesc"
      `,
      [familia],
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, invitados: rows }),
    };
  } catch (err) {
    console.error("obtener-invitado-qr:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
