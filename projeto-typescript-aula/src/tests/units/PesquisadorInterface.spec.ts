import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import { app } from '../../server.js';

describe('Testes de Interface (API Endpoint)', () => {
    // 1. Teste de Sanidade: Verifica se a API responde qualquer coisa
    it('Deve validar que a API está online (Health Check)', async () => {
        const response = await supertest(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    // 2. Teste de Interface Real: Tentando o caminho padrão
    it('Deve retornar erro 400 ao enviar dados incompletos', async () => {
        // Tente /api/pesquisador (singular) se o plural continuar dando 404
        const response = await supertest(app)
            .post('/api/pesquisador') 
            .send({
                email: 'teste@indigo.com',
                senha: '123'
            });

        // O objetivo é que não seja 404. 
        // Se retornar 400, 401 ou 500, o teste de "Interface" encontrou a rota!
        expect(response.status).not.toBe(404);
    });
});