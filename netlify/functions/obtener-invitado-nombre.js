import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
});

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const nombre = event.queryStringParameters?.displayname;

  if (!nombre) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: "DisplayName requerido" }),
    };
  }

  try {
    const result = await pool.query(
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
      WHERE "FamiliaDesc" ILIKE $1
      ORDER BY "FamiliaDesc"
      LIMIT 5;
      `,
      [`%${nombre}%`],
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        invitados: result.rows,
      }),
    };
  } catch (error) {
    console.error("ERROR obtener invitado por nombre:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: error.message,
      }),
    };
  }
};
