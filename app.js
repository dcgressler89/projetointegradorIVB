// Módulos do node e inicialização de váriaveis
const express = require('express');
const server = express();
//server.set('view engine', 'ejs');
const router = express.Router();
const fs = require('fs');
server.use(express.json({extended: true}));

// Váriaveis para inicialização do servidor
const host = 'localhost';
const port = 3000;

// Leitura do arquivo
const readFile = () => {
    const content = fs.readFileSync('./data/contatos.json', 'utf-8');
    return(JSON.parse(content));
}

// Escrita do arquivo
const writeFile = (content) => {
    const updateFile =  JSON.stringify(content);
    fs.writeFileSync('./data/contatos.json', updateFile, 'utf-8');
}

// Rotas de acesso

// Rota de busca
router.get('/', function(req, res){
    const content = readFile();
    //console.log(content);
    res.send(content);
    // Começo de testes com o modulo ejs
    //res.render('./index',{ lista : content });
});

// Rota de inserção
router.post('/', function(req, res){
    const currentContent = readFile();
    const {nome, endereco, cep, data_nascimento, telefone} = req.body;
    // Gera o id aleatório para a pessoa
    const cliente_id = Math.random().toString(32).substr(2.9);
    // Adiciona no array para ser adicionado no arquivo json
    currentContent.push({cliente_id, nome, endereco, cep, data_nascimento, telefone});
    writeFile(currentContent);
    res.send(currentContent);
});

// Rota de exclusão
router.delete('/:cliente_id', function(req, res){
    const {cliente_id} = req.params;
    const currentContent = readFile();
    // Busca elemento com a id especifica
    const selectedItem = currentContent.findIndex((item) => item.cliente_id === cliente_id);
    // Remove do array o item com a id
    currentContent.splice(selectedItem, 1);
    writeFile(currentContent);
    res.send(true);
});

// Rota de update
router.put('/:cliente_id', function(req, res){
    const {cliente_id} = req.params;
    const {nome, endereco, cep, data_nascimento, telefone} = req.body;
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.cliente_id === cliente_id);
    const {cliente_id: cId, nome: cNome, endereco: cEndereco, cep: cCep, data_nascimento: cData, telefone: cTelefone} = currentContent[selectedItem];

    // Cria objeto para ser atualizado no arquivo
    const newContato = {
        cliente_id: cId,
        nome: nome ? nome : cNome,
        endereco: endereco ? endereco : cEndereco,
        cep: cep ? cep : cCep,
        data_nascimento: data_nascimento ? data_nascimento : cData,
        telefone: telefone ? telefone : cTelefone
    }

    currentContent[selectedItem] = newContato;
    writeFile(currentContent);
    res.send(newContato);
});

// Inicializa o servidor
server.use(router);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

