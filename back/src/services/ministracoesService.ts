import pool from '../db';

const ministracoesController = {
  async addMinistracao(params: any) {
    try {

      const sql = `INSERT INTO "MINISTRACOES" ("TITULO_MINISTRACAO", "DATA_MINISTRACAO", "DESCRICAO_MINISTRACAO", "USER_MINISTRACAO", "COR_MINISTRACAO")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`

      const values = [
        params.name,
        params.date,
        params.description,
        params.people,
        params.color
      ]

      await pool.query(sql, values);

    } catch (error) {
      console.error("Erro ao inserir ministracao:", error);
      throw error;
    }
  },
};

export default ministracoesController;