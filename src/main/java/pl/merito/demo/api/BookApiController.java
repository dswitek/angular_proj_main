package pl.merito.demo.api;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import pl.merito.demo.*;
import pl.merito.demo.Actors;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200","http://localhost:8081"})
@RequestMapping("/api/books")
public class BookApiController {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final ActorsRepository actorsRepository;

    public BookApiController(BookRepository bookRepository, CategoryRepository categoryRepository, ActorsRepository actorsRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.actorsRepository = actorsRepository;
    }

    @GetMapping()
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    @PostMapping()
    public Book createBook(@Valid @RequestBody Book book, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            throw new IllegalArgumentException("Invalid book data");
        }
        return bookRepository.save(book);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("Book not found with id: " + id);
        }
        book.setId(id);
        return bookRepository.save(book);
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }


    @GetMapping("/actors")
    public List<Actors> getActors() {
        return actorsRepository.findAll();
    }

    @PostMapping("/actors")
    public Actors addActor(@RequestBody Actors actor) {
        return actorsRepository.save(actor);
    }
}
