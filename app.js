const http = require("http");

/* Váriaveis para criação do servidor */
const host = 'localhost';
const port = 3000;

const requestListener = function (req, res) {
    /*res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(`{"message": "This is a JSON response"}`);*/
};

/* Inicialização do servidor */
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

