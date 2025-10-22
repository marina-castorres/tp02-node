// Importa o framework Express
const express = require("express");
// Importa o body-parser para tratar dados de formulários POST
const bodyParser = require("body-parser");

const path = require('path')

const app = express();
const port = 3000;

// Configura o body-parser para ler dados do corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (como o HTML dos formulários)
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para tratar o formulário POST
app.post("/processar-post", (req, res) => {
  // 0. Cabeçalho da requisição com metadados
  console.log("======= CABEÇALHOS DA REQUISIÇÃO RECEBIDA =======");
  console.log(req.headers);

  // 1. Extração dos dados do corpo da requisição (entradas do tipo string)
  const { aluno, nota1, nota2 } = req.body;

  // 2 Converte as notas (strings) para valores numéricos
  const nota1Num = parseFloat(nota1);
  const nota2Num = parseFloat(nota2);

  // 3. Validação da conversão
  if (isNaN(nota1Num) || isNaN(nota2Num)) {
    // Se não for um número, envia uma resposta de erro e para a execução
    return res.status(400) // HTTP 400 = Bad Request (Requisição Inválida)
      .send("Erro: As notas devem ser números válidos.");
  }

  // 4. Cálculo da nota média (como um número)
  const media = (nota1Num + nota2Num) / 2;

  // 5. Variáveis formatada para a exibição: onverte de valores numéricos para uma string restringindo a duas casas decimais
  const nota1Formatada = nota1Num.toFixed(2);
  const nota2Formatada = nota2Num.toFixed(2);
  const mediaFormatada = media.toFixed(2);

  // 6. Definindo a situação acadêmica do aluno
  const situacao = (media >= 6) ? "Aprovado"
    : (media < 2) ? "Reprovado"
      : "Exame Final";

  // 7. Resposta enviada de volta ao navegador para ser exibida
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Situação Acadêmica</title>
      <link rel="stylesheet" href="/estilo.css">
    </head>
    <body>
      <div id="dvCorpo">
        <div class="dvLista dvResultado">
          <h2>Situação Acadêmica:</h2>
          <p><b>Aluno:</b> ${aluno}</p>
          <p><b>Nota 1:</b> ${nota1Formatada}</p>
          <p><b>Nota 2:</b> ${nota2Formatada}</p>
          <p><b>Média:</b> ${mediaFormatada}</p>
          <p><b>Situação Acadêmica:</b> ${situacao}</p>

          <!-- 4. Adiciona um link 'Voltar' estilizado como botão -->
          <a href="/" class="btExc btVoltar">Calcular Novamente</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
