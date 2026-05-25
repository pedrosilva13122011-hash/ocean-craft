const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// PORTA DO RENDER
const PORT = process.env.PORT || 3000;

// 🔑 SEU TOKEN MERCADO PAGO
const TOKEN = "APP_USR-2165041209402219-052412-62e5fb40f904abc5037516b34bfc8ea7-3423924764";

// 🏠 ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.send("Ocean Craft rodando 🚀");
});

// 💳 CRIAR PAGAMENTO
app.get("/pay", async (req, res) => {
  const nome = req.query.nome;
  const preco = req.query.preco;

  if (!nome || !preco) {
    return res.send("Faltando nome ou preço");
  }

  try {
    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      {
        items: [
          {
            title: nome,
            quantity: 1,
            currency_id: "BRL",
            unit_price: Number(preco),
          },
        ],

        // 🔥 LIBERA TODOS OS MÉTODOS (inclui PIX se sua conta tiver ativo)
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: []
        },

        back_urls: {
          success: "https://ocean-craft.onrender.com/sucesso",
          failure: "https://ocean-craft.onrender.com/erro",
          pending: "https://ocean-craft.onrender.com/pendente",
        },

        auto_return: "approved",
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    // redireciona para checkout Mercado Pago
    res.redirect(response.data.init_point);

  } catch (err) {
    console.log("ERRO:", err.response?.data || err.message);
    res.send("Erro ao criar pagamento");
  }
});

// ✅ STATUS
app.get("/sucesso", (req, res) => res.send("Pagamento aprovado ✅"));
app.get("/erro", (req, res) => res.send("Pagamento falhou ❌"));
app.get("/pendente", (req, res) => res.send("Pagamento pendente ⏳"));

// ▶️ INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
