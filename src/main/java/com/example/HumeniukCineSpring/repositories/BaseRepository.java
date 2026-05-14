package com.example.HumeniukCineSpring.repositories;

import java.io.Serializable;

import com.example.HumeniukCineSpring.entities.Base;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;



@NoRepositoryBean
public interface BaseRepository<E extends Base, Id extends Serializable> extends JpaRepository<E, Id> {

    @Override
    Page<E> findAll(Pageable pageable);
}

