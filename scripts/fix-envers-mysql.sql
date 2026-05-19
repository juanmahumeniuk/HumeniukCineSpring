-- Limpieza Envers + tabla de revisiones (ejecutar con la app DETENIDA).
-- Uso: mysql -u jota -p db_cine < scripts/fix-envers-mysql.sql

SET FOREIGN_KEY_CHECKS = 0;

-- Tablas de auditoría (y joins Envers)
DROP TABLE IF EXISTS venta_funcion_aud;
DROP TABLE IF EXISTS venta_cliente_aud;
DROP TABLE IF EXISTS venta_aud;
DROP TABLE IF EXISTS sala_vip_aud;
DROP TABLE IF EXISTS sala_aud;
DROP TABLE IF EXISTS proveedor_aud;
DROP TABLE IF EXISTS pelicula_aud;
DROP TABLE IF EXISTS pago_aud;
DROP TABLE IF EXISTS insumo_aud;
DROP TABLE IF EXISTS funcion_aud;
DROP TABLE IF EXISTS entrada_aud;
DROP TABLE IF EXISTS empleado_cine_aud;
DROP TABLE IF EXISTS empleado_aud;
DROP TABLE IF EXISTS compra_proveedor_aud;
DROP TABLE IF EXISTS compra_insumo_aud;
DROP TABLE IF EXISTS compra_aud;
DROP TABLE IF EXISTS cliente_vip_aud;
DROP TABLE IF EXISTS cliente_aud;
DROP TABLE IF EXISTS cine_pelicula_aud;
DROP TABLE IF EXISTS cine_aud;

-- Revisiones (nombres viejos y nuevo estándar Envers)
DROP TABLE IF EXISTS revision_info;
DROP TABLE IF EXISTS REVISION_INFO;
DROP TABLE IF EXISTS REVINFO;
DROP TABLE IF EXISTS seq_revision_id;

-- Tabla de revisiones que Envers espera (DEBE existir antes de crear *_aud)
CREATE TABLE REVINFO (
    rev INT NOT NULL AUTO_INCREMENT,
    revtstmp BIGINT NOT NULL,
    PRIMARY KEY (rev)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Luego: ./gradlew bootRun  (Hibernate recrea las tablas *_aud con FK a REVINFO.rev)
