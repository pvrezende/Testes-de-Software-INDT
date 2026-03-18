import { describe, it, expect } from 'vitest';
import request from 'supertest';

// Neste teste de integração, eu uso o 'Supertest' para simular uma requisição HTTP real.
// O foco é garantir que as peças (Rotas -> Middleware -> Controller) estão conversando bem.

describe('Rota de Leitura - Teste de Integração', () => {
    // Definindo a URL base da minha API rodando localmente
    const BASE_URL = 'http://localhost:6060'; 

    it('Deve validar se o sistema rejeita umidade fora do limite (0-100%)', async () => {
        // Aqui eu simulo um sensor enviando um dado impossível (150% de umidade).
        // Meu objetivo é confirmar que o esquema de validação do Zod (createLeituraSchema) 
        // está ativo e bloqueando essa entrada.
        const response = await request(BASE_URL)
            .post('/api/leitura')
            .send({
                umidade: 150, // Dado inválido para teste
                temperatura: 28.5,
                sensor_id: 'uuid-qualquer',
                dataHora: new Date().toISOString()
            });

        // Eu espero um erro 400 (Bad Request) e a mensagem de erro que eu tratei no middleware.
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('validation-error');
    });
});