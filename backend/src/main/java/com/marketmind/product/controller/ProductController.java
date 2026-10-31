package com.marketmind.product.controller;

import com.marketmind.auth.model.User;
import com.marketmind.common.api.ApiResponse;
import com.marketmind.product.dto.ProductRequestDto;
import com.marketmind.product.dto.ProductResponseDto;
import com.marketmind.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Products", description = "Manage product profiles and metadata")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "List all products for authenticated user")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> listProducts(@AuthenticationPrincipal User user) {
        List<ProductResponseDto> products = productService.getProductsForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single product by ID")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProduct(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        ProductResponseDto product = productService.getProductByIdAndUser(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @PostMapping
    @Operation(summary = "Create a new product profile")
    public ResponseEntity<ApiResponse<ProductResponseDto>> createProduct(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProductRequestDto request
    ) {
        ProductResponseDto created = productService.createProduct(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Product created successfully", created));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product by ID")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        productService.deleteProduct(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully", null));
    }
}

