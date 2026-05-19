package com.example.HumeniukCineSpring.config;

import org.hibernate.envers.RevisionListener;

public class CustomRevisionListener implements RevisionListener {
    @Override
    public void newRevision(Object revisionEntity) {
        // Hook opcional al crear una revisión (AuditRevision)
    }
}
