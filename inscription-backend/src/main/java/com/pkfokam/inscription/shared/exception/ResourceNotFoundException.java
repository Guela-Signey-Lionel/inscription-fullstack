package com.pkfokam.inscription.shared.exception;
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String id) { super(resource + " introuvable : " + id); }
}
