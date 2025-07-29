import pool from '../db';

const ministracoesController = {
  async addGasto(params: any) {
    console.log(params)
    try {

    } catch (error) {
      console.error("Erro ao inserir gasto:", error);
      throw error;
    }
  },
};

export default ministracoesController;