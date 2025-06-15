package pl.merito.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("SELECT b FROM Book b JOIN FETCH b.category WHERE b.id = :id")
    //@Query("SELECT b FROM Book b LEFT JOIN FETCH b.category LEFT JOIN FETCH b.actors WHERE b.id = :id")
    Optional<Book> findByIdWithCategoryAndActors(@Param("id") Long id);
}
