import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
});

const headers = { "Content-Type": "application/json" };

export const handler = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        "familiaNombre",
        "familiaNombre"        AS familia,
        "FamiliaDesc",
        "FamiliaDesc"          AS displayname,
        "Mesa"                 AS mesa,
        "Pases"                AS pases,
        COALESCE(pasesuti, 0)  AS pasesuti,
        ("Pases" - COALESCE(pasesuti, 0)) AS disponibles,
        acepto,
        rechazo,
        fechaaceptado
      FROM "IsmaLuisa"
      ORDER BY "familiaNombre", "FamiliaDesc"
    `);

    const totales = {
      total_invitados: rows.length,
      total_aceptaron: 0,
      total_rechazaron: 0,
      total_pendientes: 0,
      total_disponibles: 0,
    };

    rows.forEach((i) => {
      if (i.rechazo === true) totales.total_rechazaron++;
      else if (i.acepto === true) totales.total_aceptaron++;
      else totales.total_pendientes++;
      totales.total_disponibles += Number(i.disponibles) || 0;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, invitados: rows, totales }),
    };
  } catch (error) {
    console.error("Error listar invitados:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: "Error interno del servidor" }),
    };
  }
};
