import { Request, Response } from 'express';
import ministracoesService from '../services/ministracoesService';

const ministracoesController = {
    async addMinistracao(req: Request, res: Response) {
        try {
            const resp = await ministracoesService.addMinistracao(req.body);
            res.status(200).json({ resp, message: 'Ministracao adicionada com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar ministracao!' });
        }
    },
};

export default ministracoesController;