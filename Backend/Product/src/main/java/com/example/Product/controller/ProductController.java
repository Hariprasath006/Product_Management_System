package com.example.Product.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Product.model.Product;
import com.example.Product.services.ProductService;

import jakarta.validation.Valid;   // ✅ IMPORTANT

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService service;

    // ✅ CREATE
    @PostMapping
    public Product createProduct(@Valid @RequestBody Product product) {
        return service.createProduct(product);
    }

    // ✅ READ ALL
    @GetMapping
    public List<Product> getProducts() {
        return service.getAllProducts();
    }

    // ✅ READ BY ID
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return service.getProductById(id).orElse(null);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @Valid @RequestBody Product product) {
        return service.updateProduct(id, product);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Product deleted successfully 😎🔥";
    }
}
