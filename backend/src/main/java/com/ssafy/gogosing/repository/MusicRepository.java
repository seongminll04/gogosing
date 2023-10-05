package com.ssafy.gogosing.repository;

import com.ssafy.gogosing.domain.music.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MusicRepository
        extends JpaRepository<Music, Long> {
    Optional<Music> findById(Long musicId);
    @Query("SELECT m FROM MusicGenre mg INNER JOIN Music m ON mg.music.id = m.id WHERE mg.genre.id = :genreId ORDER BY m.viewCount DESC")
    List<Music> findMusicByGenreId(Long genreId);

    @Query(value = "SELECT DISTINCT * " +
        "FROM (" +
        "    SELECT m.*, ROW_NUMBER() OVER (ORDER BY m.view_count DESC) AS row_num, RAND() AS random_num " +
        "    FROM music_genre mg " +
        "    INNER JOIN music m ON mg.music_id = m.music_id " +
        "    WHERE mg.genre_id IN (1, 2) " +
        "    ORDER BY m.view_count DESC " +
        "    LIMIT 1000" +
        ") AS subquery " +
        "ORDER BY subquery.random_num " +
        "LIMIT 10", nativeQuery = true)
    List<Music> findTopByPick();


}
