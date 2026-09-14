const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir recerber JSON
app.use(express.json());

//BANCO DE DADOS EM MEMÓRIAS
let imoveis = [
    {
        id: 1,
        "tipo": "Apartamento Duplex",
        "bairro": "Jardins",
        "areaM2": 95,
        "valorAluguel": 3500
    },
    {
        id: 2,
        "tipo": "Casa Duplex",
        "bairro":"Vila Mariana",
        "areaM2": 65,
        "valorAluguel": 2800
        
    },
    {
        id:3,
        "tipo": "Sala comercial",
        "bairro":"Centro",
        "areaM2": 120,
        "valorAluguel": 4550
        
    }
];

//ROTA 1:GET /imoveis(listar todos s imóveis) status 200 ok
app.get('/imoveis', (req, res) =>{
    return res.status (200).json(imoveis);
});

//ROTA 2: GEt / Rota para buscar um produtos específico pelo ID (Parâmetro de Rota)
app.get('/imoveis/:id', (req, res) => { 
    const  { id } = req.params; // Extrai o ID da URL

    // Procura o produto no array em memória
    const imovel = imoveis.find(p => p.id === parseInt(id));

    // Caso o prodtudo não exista, retorna 404 Not Found
    if (!imovel) {
        return res.status(404).json({ mensagem: 'Imovel não encontrado.'});
    }

    // Se exixtir, retorna 200 OK com os dados do produto encontrado
        return res.status(200).json(imovel);
});

// OBRIGATÓRIO: habilitar o parser de corpo Json no Express
app.use(express.json());

// Rota para Cadastrar um novo Imóvel
app.post('/imoveis', (req, res) =>{
    // Extrai as informações enviadas pelo cliente no corpo (body) da requisição
    const {tipo, bairro, areaM2, valorAluguel} = req.body;
    // Validção simples dos dados recebidos
    if (!tipo || bairro === undefined) {
        return res.status(400).json({ mensagem: 'Tipo e Bairro são obrigatórios.'});
    }

    // Criação do novo registro com identificado único incremental
    const novoImovel = {
        id: imoveis.length > 0 ? imoveis[imoveis.length - 1].id + 1 : 1,
        tipo,
        bairro: String(bairro)
    };
      
    imoveis.push(novoImovel);

    // RESful: Retorna HTTP Status 201 Created + Obejeto Criado
    return res.status(201).json({
        mensagem: 'Imovel cadastrado com sucesso!',
        bairro: novoImovel
    });
});

// Rota para Atualizar um Imovel Existente
app.put('/imovel/:id', (req, res) => {
    const { id } = req.params;        // ID na URL
    const { tipo, imovel } = req.body;     // Novos dados no Body

    // Localiza a posição do produto no array
    const index = imoveis.findIndex(p => p.id === parseInt(id));

    // Caso o imovel não exista no banco/memória
    if (index === -1) {
        return res.status(404).json({ mesagem: 'Imovel não encontrado para atualiazação.'});
    }

    //Atualiza os dados mantendo o ID original
    imovel[index] = {
       ...imoveis[index],
        tipo: tipo || imoveis[index].tipo,
        bairro: bairro !== undefined ? String(bairro) : imoveis[index].bairro
    };

    // Retorna HTTP Staus 200 OK com o regsitro atualizado
    return res.status(200).json({
        mensagem: 'Imovel atualizado com sucesso!',
        imovel: imoveis[index]
    });
});


// Rota pra Deletar um Imovel pelo ID
app.delete('/imoveis/:id', (req, res) => {
    const { id } = req.params;

    //Encontrar a posição do item
    const index = imoveis.findIndex(p => p.id === parseInt(id));

    // SE não existir, retorna 404 Not Found
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Imovel não encontrado para exclusão.'});
    }    

    // Remove o elemento do array em memória
    imovel.splice(index, 1);

    // Retorna HTTP Status 200 OK com mensagem de confirmação
    return res.status(200).json({
        mensagem: `Imoveis com ID ${id} removido com sucesso!`
    });
});

app.listen(PORT, () => {
    console.log(`❤️ [SERVIDOR ATIVO] Rodando em http://localhost:${PORT}`);
    console.log(`👍 Pronto para receber requisições do Thunder Client!`);
});