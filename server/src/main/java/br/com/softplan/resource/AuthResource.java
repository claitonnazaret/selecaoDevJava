package br.com.softplan.resource;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
//@CrossOrigin(origins = "http://localhost:3000")
public class AuthResource {

    @PostMapping(
            path = "/auth",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<String> login(@RequestBody String auth) {
        return ResponseEntity.ok(auth);
    }

}
