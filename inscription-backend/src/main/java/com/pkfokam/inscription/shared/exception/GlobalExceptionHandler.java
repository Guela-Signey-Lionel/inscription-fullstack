package com.pkfokam.inscription.shared.exception;

import org.slf4j.*;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.stream.Collectors;

record ApiError(String code, String message, Instant timestamp) {
    ApiError(String code, String message) { this(code, message, Instant.now()); }
}

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    @ExceptionHandler(BusinessException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
    ApiError business(BusinessException e) { return new ApiError("BUSINESS_ERROR",e.getMessage()); }
    @ExceptionHandler(ResourceNotFoundException.class) @ResponseStatus(HttpStatus.NOT_FOUND)
    ApiError notFound(ResourceNotFoundException e) { return new ApiError("NOT_FOUND",e.getMessage()); }
    @ExceptionHandler(AccessDeniedException.class) @ResponseStatus(HttpStatus.FORBIDDEN)
    ApiError forbidden() { return new ApiError("FORBIDDEN","Accès refusé"); }
    @ExceptionHandler(MethodArgumentNotValidException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
    ApiError validation(MethodArgumentNotValidException e) {
        return new ApiError("VALIDATION_ERROR", e.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.joining(", ")));
    }
    @ExceptionHandler(Exception.class) @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    ApiError general(Exception e) { log.error("Erreur non gérée",e); return new ApiError("INTERNAL_ERROR","Erreur interne"); }
}
