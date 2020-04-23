package br.com.softplan.enuns;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

public enum SexoEnum {
    MASCULINO('M'), FEMININO('F');

    private final char sexo;

    SexoEnum(char sexo) {
        this.sexo = sexo;
    }

    public char getSexo() {
        return sexo;
    }

    @Converter(autoApply = true)
    public static class Mapeador implements AttributeConverter<SexoEnum, String> {

        @Override
        public String convertToDatabaseColumn(SexoEnum x) {
            return String.valueOf(x.getSexo());
        }

        @Override
        public SexoEnum convertToEntityAttribute(String y) {
            if (y == null) return null;
            if ("M".equals(y)) return MASCULINO;
            if ("F".equals(y)) return FEMININO;
            throw new IllegalStateException("Valor inválido: " + y);
        }
    }
}
