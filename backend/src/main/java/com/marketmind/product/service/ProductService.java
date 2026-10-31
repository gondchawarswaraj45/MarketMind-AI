package com.marketmind.product.service;

import com.marketmind.auth.model.User;
import com.marketmind.common.exception.ResourceNotFoundException;
import com.marketmind.product.dto.ProductRequestDto;
import com.marketmind.product.dto.ProductResponseDto;
import com.marketmind.product.model.Product;
import com.marketmind.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponseDto> getProductsForUser(String userId) {
        return productRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductByIdAndUser(String productId, String userId) {
        Product product = productRepository.findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        return ProductResponseDto.fromEntity(product);
    }

    public Product getProductEntity(String productId, String userId) {
        return productRepository.findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    @Transactional
    public ProductResponseDto createProduct(User user, ProductRequestDto dto) {
        Product product = new Product(
                user,
                dto.getName().trim(),
                dto.getTagline() != null ? dto.getTagline().trim() : null,
                dto.getDescription().trim(),
                dto.getCategory().trim(),
                dto.getWebsiteUrl() != null ? dto.getWebsiteUrl().trim() : null,
                dto.getPricingModel() != null ? dto.getPricingModel().trim() : null,
                dto.getTargetGeography() != null ? dto.getTargetGeography().trim() : null
        );

        Product saved = productRepository.save(product);
        return ProductResponseDto.fromEntity(saved);
    }

    @Transactional
    public void deleteProduct(String productId, String userId) {
        Product product = productRepository.findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        productRepository.delete(product);
    }
}

