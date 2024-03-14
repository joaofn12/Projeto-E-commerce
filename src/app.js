const express = require('express');
const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts(limit) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      const products = JSON.parse(data);
      
      if (limit) {
        return products.slice(0, limit);
      } else {
        return products;
      }
    } catch (err) {
      console.error("Erro ao ler produtos:", err);
      throw err;
    }
  }

  async getProductById(id) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      const products = JSON.parse(data);
      const product = products.find(product => product.id === parseInt(id));
      
      if (!product) {
        throw new Error("Produto não encontrado.");
      }
      
      return product;
    } catch (err) {
      console.error("Erro ao ler produto por ID:", err);
      throw err;
    }
  }
}

const app = express();
const productManager = new ProductManager('products.json');

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});