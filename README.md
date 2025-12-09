# AutoValorAI

AutoValorAI é uma plataforma de avaliação de veículos impulsionada por Inteligência Artificial (Groq LLaMA 3 / Mixtral). O sistema analisa dados do veículo e fotos para fornecer uma estimativa de preço de mercado, pontos fortes e fracos, e uma análise visual.

## Funcionalidades

- **Cadastro de Veículo**: Formulário completo com marca, modelo, ano, km, sinistro e observações.
- **Upload de Fotos**: Suporte para até 10 fotos do veículo.
- **Avaliação com IA**: Integração com Groq API para análise detalhada.
- **Resultados Detalhados**:
  - Preço sugerido e faixa de preço.
  - Motivos de valorização e desvalorização.
  - Análise visual das fotos.
  - Confiança da avaliação.
- **Histórico Local**: As avaliações são salvas no navegador.

## Tecnologias

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Zod** (Validação)
- **Groq SDK** (IA)

## Configuração

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave da API Groq:
   ```env
   GROQ_API_KEY=sua_chave_aqui
   ```

## Como Rodar

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Como Testar

1. Preencha o formulário com dados de um veículo real ou fictício.
2. Adicione algumas fotos (opcional, mas recomendado para análise visual).
3. Clique em "Avaliar Preço".
4. Aguarde a análise da IA e veja o resultado.

## Estrutura do Projeto

- `/app`: Páginas e rotas da API.
- `/components`: Componentes React (UI e funcionais).
- `/lib`: Utilitários, configurações da Groq e validadores.
- `/public/uploads`: Diretório onde as imagens são salvas temporariamente.

## Notas

- O upload de imagens é feito localmente para a pasta `public/uploads`. Em produção, recomenda-se usar um serviço de armazenamento como S3 ou UploadThing.
- O histórico é salvo no `localStorage` do navegador.
