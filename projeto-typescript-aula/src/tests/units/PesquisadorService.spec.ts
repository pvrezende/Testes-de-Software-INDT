import { describe, it, expect, vi, beforeEach } from 'vitest';
import PesquisadorService from '../../services/PesquisadorService.js';
import { appDataSource } from '../../database/appDataSource.js';
import { AppError } from '../../errors/AppError.js';

// Eu uso o vi.mock para interceptar a conexão com o banco.
// Sem isso, o service tentaria conectar no Postgres real e falharia no ambiente de teste.
vi.mock('../../database/appDataSource.js', () => ({
    appDataSource: {
        getRepository: vi.fn()
    }
}));

describe('PesquisadorService - Testes Unitários', () => {
    let service: PesquisadorService;
    let repoMock: any;

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Criamos as funções fake que o Service usa
        repoMock = {
            findOneBy: vi.fn(),
            create: vi.fn().mockImplementation(data => data), // Simula criação do objeto
            save: vi.fn()
        };

        // Forçamos o getRepository a devolver o nosso repoMock
        (appDataSource.getRepository as any).mockReturnValue(repoMock);
        
        service = new PesquisadorService();
    });

    it('Deve barrar o cadastro se o e-mail já estiver no sistema', async () => {
        // Explicação: Aqui eu 'minto' para o sistema.
        // Digo que o banco encontrou um e-mail idêntico.
        repoMock.findOneBy.mockResolvedValue({ email: 'paulo@exemplo.com' });

        const payload = {
            nome: 'Paulo Victor',
            email: 'paulo@exemplo.com',
            senha: 'senha_segura_123',
            matricula: 'PV-2025',
            especialidade: 'IoT',
            titulacao: 'Mestrado',
            dataNascimento: '1997-01-01'
        } as any;

        // Agora o teste DEVE pegar o erro 'E-mail ou Matrícula já cadastrados'
        await expect(service.create(payload)).rejects.toThrow('E-mail ou Matrícula já cadastrados');
    });
});