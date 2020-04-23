package br.com.softplan.enuns;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

public enum NacionalidadeEnum {
    BRASILEIRO('B'), ESTRANGEIRO('E');

    private final char nacionalidade;

    NacionalidadeEnum(char nacionalidade) {
        this.nacionalidade = nacionalidade;
    }

    public char getNacionalidade() {
        return nacionalidade;
    }

    @Converter(autoApply = true)
    public static class Mapeador implements AttributeConverter<NacionalidadeEnum, String> {

        @Override
        public String convertToDatabaseColumn(NacionalidadeEnum x) {
            return String.valueOf(x.getNacionalidade());
        }

        @Override
        public NacionalidadeEnum convertToEntityAttribute(String y) {
            if (y == null) return null;
            if ("B".equals(y)) return BRASILEIRO;
            if ("E".equals(y)) return ESTRANGEIRO;
            throw new IllegalStateException("Valor inválido: " + y);
        }
    }
}
