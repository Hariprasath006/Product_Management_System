package com.example.Product.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Product.model.Product;
import com.example.Product.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    // ✅ CREATE
    public Product createProduct(Product product) {
        return repository.save(product);
    }

    // ✅ READ ALL
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    // ✅ READ BY ID
    public Optional<Product> getProductById(Long id) {
        return repository.findById(id);
    }

    // ✅ UPDATE
    public Product updateProduct(Long id, Product newProduct) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(newProduct.getName());
        product.setPrice(newProduct.getPrice());
        product.setQuantity(newProduct.getQuantity());

        return repository.save(product);
    }

    // ✅ DELETE
    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }
}
