const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  addProduct(product) {
    // Validação das propriedades obrigatórias
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error("Todas as propriedades são obrigatórias para um produto.");
      return;
    }

    // Carrega os produtos existentes
    this.loadProducts();

    // Validação de código duplicado
    if (this.products.some(existingProduct => existingProduct.code === product.code)) {
      console.error("Produto com o mesmo código já existe.");
      return;
    }

    // Geração de ID incremental
    product.id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;

    // Adiciona o produto ao array
    this.products.push(product);

    // Salva os produtos no arquivo
    this.saveProducts();

    console.log("Produto adicionado com sucesso:", product);
  }

  getProducts() {
    // Carrega os produtos existentes
    this.loadProducts();
    return this.products;
  }

  getProductById(id) {
    // Carrega os produtos existentes
    this.loadProducts();
    
    const product = this.products.find(product => product.id === id);

    if (!product) {
      console.error("Produto não encontrado.");
    } else {
      console.log("Produto encontrado:", product);
    }

    return product;
  }

  updateProduct(id, updatedProduct) {
    // Carrega os produtos existentes
    this.loadProducts();
    
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
      console.error("Produto não encontrado.");
      return;
    }

    // Atualiza o produto
    this.products[index] = { ...this.products[index], ...updatedProduct };

    // Salva os produtos atualizados no arquivo
    this.saveProducts();

    console.log("Produto atualizado com sucesso:", this.products[index]);
  }

  deleteProduct(id) {
    // Carrega os produtos existentes
    this.loadProducts();
    
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
      console.error("Produto não encontrado.");
      return;
    }

    // Remove o produto
    this.products.splice(index, 1);

    // Salva os produtos atualizados no arquivo
    this.saveProducts();

    console.log("Produto deletado com sucesso.");
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (err) {
      // Se o arquivo não existe ou não pode ser lido, assumimos que não há produtos ainda.
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }
}

// Exemplo de uso
const productManager = new ProductManager('products.json');

// Adicionando produtos
productManager.addProduct({ title: "Produto 1", description: "Descrição 1", price: 19.99, thumbnail: "thumb1.jpg", code: "P001", stock: 50 });
productManager.addProduct({ title: "Produto 2", description: "Descrição 2", price: 29.99, thumbnail: "thumb2.jpg", code: "P002", stock: 30 });

// Recuperando todos os produtos
console.log("Todos os produtos:", productManager.getProducts());

// Recuperando produto pelo ID
productManager.getProductById(1);

// Atualizando um produto
productManager.updateProduct(1, { price: 25.99 });

// Deletando um produto
productManager.deleteProduct(2);