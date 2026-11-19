HIGH FORM 3D STUDIO — WEBSITE

ARQUIVOS
- index.html: estrutura e conteúdo do site.
- assets/css/style.css: identidade visual, responsividade e animações.
- assets/js/main.js: menu mobile, efeitos no scroll e formulário de orçamento.
- assets/images/: logotipo rasterizado extraído do material de marca e imagem conceitual usada no layout.

COMO VISUALIZAR
- Preview publicado: https://wesley527.github.io/highform/
- Localmente: abra index.html em um navegador atualizado ou execute
  python3 -m http.server 8000 e acesse http://localhost:8000/.

PUBLICAÇÃO NO GITHUB PAGES
- Repositório: https://github.com/wesley527/highform
- A origem do Pages é o branch main, pasta raiz (/). O site é estático e não precisa de build.
- Um push para main publica os arquivos. O preview pode levar alguns minutos para atualizar.
- Mantenha index.html e a pasta assets juntos na raiz; os caminhos de CSS, JS e imagens são relativos ao site.

CONFIGURAR WHATSAPP ANTES DE PUBLICAR
Abra assets/js/main.js e localize:
  const WHATSAPP_NUMBER = '';

Substitua o conteúdo vazio pelo número oficial da HIGH FORM, com código do país e DDD, apenas números.
Exemplo de formato (fictício): 5511999999999
Não use espaços, parênteses, hífen ou sinal de +.

Enquanto o número não for configurado, o formulário abre o WhatsApp com a mensagem pronta e permite selecionar o contato da HIGH FORM manualmente.

OBSERVAÇÕES
- O conteúdo foi escrito com base no material de marca enviado. Não foram inventados endereço, telefone, preços, prazos, clientes, certificações ou capacidade técnica.
- A imagem de uma peça HF na página é identificada como estudo visual conceitual, não como produto entregue ou portfólio comprovado.
- O logotipo fornecido no pacote de referência é uma imagem raster. O site usa uma versão recortada para fundo escuro; não é um arquivo vetorial original.
- As fontes DM Sans e Space Grotesk são carregadas do Google Fonts. Se não houver conexão, o site usa fontes de sistema como fallback.
