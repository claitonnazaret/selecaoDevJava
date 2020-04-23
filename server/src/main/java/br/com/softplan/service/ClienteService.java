package br.com.softplan.service;

import br.com.softplan.domain.Cliente;
import br.com.softplan.repository.ClienteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Page<Cliente> findAll(Pageable pageable) {
        return clienteRepository.findAll(pageable);
    }

    public Cliente findById(Long id) {
        return clienteRepository
                .findById(id)
                .orElse(null);
    }

    public void delete(Long id) {
        Cliente cliente = findById(id);
        if(Objects.nonNull(cliente))
            clienteRepository.delete(cliente);
    }

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
}
