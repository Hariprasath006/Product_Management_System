package com.example.Product.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;   // ✅ IMPORTANT

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name required 🔥")
    private String name;

    @Positive(message = "Price must be positive 🔥")
    private double price;

    @PositiveOrZero(message = "Quantity cannot be negative 🔥")
    private int quantity;

    // ✅ Constructors
    public Product() {}

    public Product(String name, double price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    // ✅ Getters & Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }

    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) { this.quantity = quantity; }
}
