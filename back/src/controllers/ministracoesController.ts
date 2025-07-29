import { Request, Response } from 'express';
import ministracoesService from '../services/ministracoesService';

const ministracoesController = {
    async addGasto(req: Request, res: Response) {
        try {
            const resp = await ministracoesService.addGasto(req.body);
            res.status(200).json({ resp, message: 'Gasto adicionado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar gasto!' });
        }
    },
};

export default ministracoesController;