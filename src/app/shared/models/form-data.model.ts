export interface AppFormData {
    personal: {
        nome: string;
        nascimento: string;
        cpf: string;
        telefone: string;
    };
    address: {
        cep: string;
        rua: string;
        bairro: string;
        cidade: string;
        estado: string;
    };
    professional: { 
        profissao: string; 
        empresa: string; 
        salario: string 
    };
}