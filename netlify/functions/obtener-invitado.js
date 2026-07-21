import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
});

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        ok: false,
        message: "Método no permitido.",
      }),
    };
  }

  const familia = event.queryStringParameters?.familia;

  if (!familia) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        message: "Familia requerida.",
      }),
    };
  }

  try {
    const result = await pool.query(
      `
            SELECT
                id,
                "familiaNombre",
                "FamiliaDesc",
                "Mesa",
                "Pases",
                acepto,
                rechazo,
                fechaaceptado
            FROM "IsmaLuisa"
            WHERE "familiaNombre" = $1
            LIMIT 1;
        `,
      [familia],
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          message: "Invitación no encontrada.",
        }),
      };
    }

    const invitado = result.rows[0];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: true,
        invitado: {
          id: invitado.id,
          familiaNombre: invitado.familiaNombre,
          FamiliaDesc: invitado.FamiliaDesc,
          Mesa: invitado.Mesa,
          Pases: invitado.Pases,
          acepto: invitado.acepto,
          rechazo: invitado.rechazo,
          fechaaceptado: invitado.fechaaceptado,
        },
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: false,
        error: error.message,
      }),
    };
  }
};
