package br.com.softplan.domain;

import br.com.softplan.enuns.NacionalidadeEnum;
import br.com.softplan.enuns.SexoEnum;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

@Entity
@Data
public class Cliente implements Serializable {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    @NotNull(message = "Campo nome é obrigatório")
    private String nome;

    @Convert(converter = SexoEnum.Mapeador.class)
    private SexoEnum sexo;

    @Email(message = "Email inválido")
    private String email;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @NotNull(message = "Campo Data de Nascimento é obrigatório")
    @Column(nullable = false)
    private Date dtNascimento;

    private String naturalidade;

    @Convert(converter = NacionalidadeEnum.Mapeador.class)
    private NacionalidadeEnum nacionalidade;

    @NotNull(message = "Campo cpf é obrigatório")
    @Column(unique = true, nullable = true)
    private String cpf;
}
