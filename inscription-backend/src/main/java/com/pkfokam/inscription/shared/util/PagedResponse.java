package com.pkfokam.inscription.shared.util;
import java.util.List;
public record PagedResponse<T>(List<T> content, long total, int totalPages, int page, int size) {}
