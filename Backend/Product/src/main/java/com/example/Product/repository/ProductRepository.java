package com.example.Product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Product.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
