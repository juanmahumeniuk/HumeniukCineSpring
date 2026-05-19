-- Seed de datos ficticios para Humeniuk Cine (MySQL: db_cine)
-- Películas: títulos reales (franquicias Star Wars, Batman, Marvel, etc.)
-- Ejecutado por DatabaseSeeder al iniciar la app si pelicula está vacía.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- Películas (títulos reales; metadatos según IMDb / fichas oficiales)
-- puntaje = nota IMDb (0-10); duracion = corte teatral; clasificacion ≈ INCAA (AR)
-- ---------------------------------------------------------------------------
INSERT INTO pelicula (id, titulo, genero, descripcion, puntaje, anio, duracion_minutos, director, clasificacion) VALUES
  ( 1, 'Star Wars: Episodio IV - Una nueva esperanza', 'ACCION',
    'La princesa Leia cae prisionera del Imperio al intentar proteger los planos de la Estrella de la Muerte. Luke Skywalker y Han Solo se unen a la rebelión para rescatarla y destruir la superarma.',
    8.6, 1977, 121, 'George Lucas', 'ATP'),
  ( 2, 'Star Wars: Episodio V - El Imperio contraataca', 'ACCION',
    'Tras el ataque a Hoth, Luke entrena con Yoda mientras Han y Leia huyen del Imperio. Darth Vader revela un secreto que cambia el destino de la galaxia.',
    8.7, 1980, 124, 'Irvin Kershner', 'ATP'),
  ( 3, 'Star Wars: Episodio VI - El retorno del Jedi', 'ACCION',
    'La Alianza Rebelde prepara un asalto a la segunda Estrella de la Muerte mientras Luke intenta redimir a su padre y enfrentar al Emperador Palpatine.',
    8.3, 1983, 131, 'Richard Marquand', 'ATP'),
  ( 4, 'Star Wars: Episodio I - La amenaza fantasma', 'ACCION',
    'Dos Jedi protegen a la reina Amidala en Naboo y descubren a Anakin Skywalker, un niño con un potencial extraordinario en la Fuerza.',
    6.5, 1999, 136, 'George Lucas', 'ATP'),
  ( 5, 'Star Wars: Episodio VII - El despertar de la Fuerza', 'ACCION',
    'Treinta años después de la Caída del Imperio, la Primera Orden amenaza la galaxia. Rey, Finn y la Resistencia buscan a Luke Skywalker.',
    7.8, 2015, 138, 'J. J. Abrams', '+13'),
  ( 6, 'Rogue One: Una historia de Star Wars', 'ACCION',
    'Una soldado desertora y un grupo de rebeldes se infiltran en Scarif para robar los planos de la primera Estrella de la Muerte.',
    7.6, 2016, 133, 'Gareth Edwards', '+13'),
  ( 7, 'Batman', 'ACCION',
    'El millonario Bruce Wayne se convierte en Batman para detener al Joker, quien desata el caos en Ciudad Gótica.',
    7.5, 1989, 126, 'Tim Burton', '+13'),
  ( 8, 'Batman Begins', 'ACCION',
    'Tras años de entrenamiento en la Liga de las Sombras, Bruce Wayne regresa a Gótica para combatir el crimen bajo la identidad de Batman.',
    8.2, 2005, 140, 'Christopher Nolan', '+13'),
  ( 9, 'The Dark Knight', 'ACCION',
    'Batman, el teniente Gordon y el fiscal Harvey Dent se enfrentan al Joker, un criminal que busca sumir a Gótica en la anarquía.',
    9.0, 2008, 152, 'Christopher Nolan', '+13'),
  (10, 'The Dark Knight Rises', 'ACCION',
    'Ocho años después, Batman debe volver cuando Bane escapa de la prisión y planea destruir Ciudad Gótica.',
    8.4, 2012, 164, 'Christopher Nolan', '+13'),
  (11, 'The Batman', 'SUSPENSO',
    'En su segundo año como vigilante, Batman investiga una serie de asesinatos del Riddler que exponen la corrupción de la élite de Gótica.',
    7.8, 2022, 176, 'Matt Reeves', '+13'),
  (12, 'Iron Man', 'ACCION',
    'Tony Stark, industrial y fabricante de armas, construye una armadura de alta tecnología tras ser secuestrado en Afganistán.',
    7.9, 2008, 126, 'Jon Favreau', '+13'),
  (13, 'The Avengers', 'ACCION',
    'Nick Fury reúne a Iron Man, Capitán América, Thor, Hulk y otros héroes para detener a Loki y su invasión a la Tierra.',
    8.0, 2012, 143, 'Joss Whedon', '+13'),
  (14, 'Spider-Man: No Way Home', 'ACCION',
    'Tras ser desenmascarado, Peter Parker pide ayuda al Doctor Strange; un hechizo mal conjurado abre el multiverso y trae villanos de otras realidades.',
    8.2, 2021, 148, 'Jon Watts', '+13'),
  (15, 'Black Panther', 'ACCION',
    'Tras la muerte de su padre, T''Challa regresa a Wakanda para ser rey y enfrentar a Killmonger, quien cuestiona el aislamiento del país.',
    7.3, 2018, 134, 'Ryan Coogler', '+13'),
  (16, 'Guardians of the Galaxy', 'ACCION',
    'Peter Quill roba un orbe codiciado por Ronan el Acusador. Con un grupo de inadaptados, deberá salvar la galaxia.',
    8.0, 2014, 121, 'James Gunn', '+13'),
  (17, 'Harry Potter y la piedra filosofal', 'ACCION',
    'Harry Potter descubre que es mago e ingresa a Hogwarts, donde descubre un misterio ligado a la piedra filosofal y al mago que mató a sus padres.',
    7.6, 2001, 152, 'Chris Columbus', 'ATP'),
  (18, 'El señor de los anillos: La comunidad del anillo', 'ACCION',
    'El hobbit Frodo Bolsón hereda el Anillo Único y parte con la Comunidad hacia el Monte del Destino para destruirlo antes de que Sauron lo recupere.',
    8.9, 2001, 178, 'Peter Jackson', '+13'),
  (19, 'Jurassic Park', 'ACCION',
    'Un parque temático con dinosaurios clonados abre en una isla remota, pero un sabotaje desactiva los sistemas de seguridad y el caos se desata.',
    8.2, 1993, 127, 'Steven Spielberg', '+13'),
  (20, 'Indiana Jones y los cazadores del arca perdida', 'ACCION',
    'En 1936, el arqueólogo Indiana Jones es contratado por el gobierno estadounidense para encontrar el Arca de la Alianza antes que los nazis.',
    8.4, 1981, 115, 'Steven Spielberg', '+13'),
  (21, 'Casino Royale', 'ACCION',
    'James Bond obtiene el estatus 00 y debe derrotar al banquero Le Chiffre en un torneo de póquer en Montenegro, financiado por organizaciones terroristas.',
    8.0, 2006, 144, 'Martin Campbell', '+13'),
  (22, 'Fast & Furious', 'ACCION',
    'Brian O''Conner, policía encubierto, se infiltra en el mundo de las carreras callejeras de Los Ángeles para investigar una serie de robos de camiones.',
    6.8, 2001, 106, 'Rob Cohen', '+16'),
  (23, 'Mission: Impossible - Dead Reckoning', 'ACCION',
    'Ethan Hunt y su equipo deben localizar una entidad de inteligencia artificial que amenaza con desestabilizar el orden mundial.',
    7.6, 2023, 163, 'Christopher McQuarrie', '+13'),
  (24, 'Toy Story', 'COMEDIA',
    'Woody, el juguete favorito de Andy, ve su lugar amenazado cuando llega Buzz Lightyear, quien cree ser un auténtico ranger espacial.',
    8.3, 1995, 81, 'John Lasseter', 'ATP'),
  (25, 'Shrek', 'COMEDIA',
    'Un ogro solitario emprende un viaje para rescatar a la princesa Fiona y recuperar su pantano, acompañado por un burro parlanchín.',
    7.9, 2001, 90, 'Andrew Adamson, Vicky Jenson', 'ATP'),
  (26, 'El padrino', 'DRAMA',
    'En la década de 1940, la familia Corleone lucha por mantener su poder en el crimen organizado tras el intento de asesinato del patriarca Vito Corleone.',
    9.2, 1972, 175, 'Francis Ford Coppola', '+16'),
  (27, 'Forrest Gump', 'DRAMA',
    'Forrest Gump, un hombre de Alabama con coeficiente intelectual bajo, relata décadas de su vida entrelazadas con grandes acontecimientos de Estados Unidos.',
    8.8, 1994, 142, 'Robert Zemeckis', '+13'),
  (28, 'Titanic', 'DRAMA',
    'A bordo del RMS Titanic, la aristócrata Rose DeWitt Bukater y el artista Jack Dawson se enamoran mientras el transatlántico se dirige a su trágico final.',
    7.9, 1997, 194, 'James Cameron', '+13'),
  (29, 'El silencio de los corderos', 'SUSPENSO',
    'La agente del FBI Clarice Starling solicita la ayuda del caníbal Hannibal Lecter para capturar a Buffalo Bill, un asesino en serie que desolla a sus víctimas.',
    8.6, 1991, 118, 'Jonathan Demme', '+16'),
  (30, 'Inception', 'SUSPENSO',
    'Dom Cobb es un ladrón experto en extracción de secretos del subconsciente que acepta la tarea inversa: implantar una idea en la mente de un heredero industrial.',
    8.8, 2010, 148, 'Christopher Nolan', '+13');

-- ---------------------------------------------------------------------------
-- Cines (ficticios)
-- ---------------------------------------------------------------------------
INSERT INTO cine (id, nombre, direccion) VALUES
  (1, 'Humeniuk Multiplex Centro',    'Av. Corrientes 1234, CABA'),
  (2, 'Humeniuk Cine Norte',          'Av. del Libertador 4500, Vicente López'),
  (3, 'Humeniuk Premium Palermo',     'Av. Santa Fe 3200, CABA');

INSERT INTO cine_pelicula (cine_id, pelicula_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 7), (1, 8), (1, 9), (1, 12), (1, 13), (1, 19), (1, 30),
  (2, 4), (2, 5), (2, 6), (2, 10), (2, 11), (2, 14), (2, 15), (2, 22), (2, 23), (2, 29),
  (3, 16), (3, 17), (3, 18), (3, 20), (3, 21), (3, 24), (3, 25), (3, 26), (3, 27), (3, 28);

-- ---------------------------------------------------------------------------
-- Salas (JOINED: primero sala, luego sala_vip si aplica)
-- ---------------------------------------------------------------------------
INSERT INTO sala (id, numero, capacidad, cine_id) VALUES
  ( 1,  1, 120, 1),
  ( 2,  2,  80, 1),
  ( 3,  3,  50, 1),
  ( 4,  1, 100, 2),
  ( 5,  2,  90, 2),
  ( 6,  1,  60, 2),
  ( 7,  1, 150, 3),
  ( 8,  2, 110, 3),
  ( 9,  3,  40, 3);

INSERT INTO sala_vip (sala_id, beneficios) VALUES
  (3, 'Butacas reclinables, servicio en butaca, estacionamiento preferencial'),
  (6, 'Sala lounge, combo gourmet incluido los viernes'),
  (9, 'Premier con coctelería y menú ejecutivo');

-- ---------------------------------------------------------------------------
-- Proveedores e insumos (ficticios)
-- ---------------------------------------------------------------------------
INSERT INTO proveedor (id, nombre, telefono, direccion) VALUES
  (1, 'Distribuidora Andes S.A.',     '011-4555-1001', 'Parque Industrial Pilar, BA'),
  (2, 'Snack Films Supply',           '011-4555-2020', 'Av. Juan B. Justo 2100, CABA'),
  (3, 'Bebidas del Plata',            '0341-555-3300', 'Rosario, Santa Fe'),
  (4, 'Pochoclería Nacional',         '011-4555-4040', 'Av. Rivadavia 8900, CABA');

INSERT INTO insumo (id, nombre, precio) VALUES
  (1, 'Pochoclos grandes',        4500.00),
  (2, 'Pochoclos medianos',       3200.00),
  (3, 'Gaseosa 500 ml',           2800.00),
  (4, 'Agua mineral 500 ml',      1800.00),
  (5, 'Combo familiar',           8900.00),
  (6, 'Nachos con queso',         5200.00),
  (7, 'Chocolates surtidos',      3500.00),
  (8, 'Vaso térmico reutilizable',12000.00);

-- ---------------------------------------------------------------------------
-- Empleados y asignación a cines
-- ---------------------------------------------------------------------------
INSERT INTO empleado (id, nombre, dni) VALUES
  (1, 'María González',    30123456),
  (2, 'Lucas Fernández',   31234567),
  (3, 'Ana Ruiz',          32345678),
  (4, 'Diego Martínez',    33456789),
  (5, 'Sofía López',       34567890),
  (6, 'Pablo Herrera',     35678901);

INSERT INTO empleado_cine (empleado_id, cine_id) VALUES
  (1, 1), (2, 1), (3, 1),
  (4, 2), (5, 2),
  (6, 3), (1, 3);

-- ---------------------------------------------------------------------------
-- Clientes (JOINED: cliente + cliente_vip)
-- ---------------------------------------------------------------------------
INSERT INTO cliente (id, nombre, email) VALUES
  (1, 'Juan Pérez',           'juan.perez@mail.com'),
  (2, 'Carla Díaz',           'carla.diaz@mail.com'),
  (3, 'Martín Acosta',        'martin.acosta@mail.com'),
  (4, 'Valentina Romero',   'vale.romero@mail.com'),
  (5, 'Cliente ocasional',    'invitado@ejemplo.com');

INSERT INTO cliente_vip (cliente_id, descuento) VALUES
  (2, 15.0),
  (4, 20.0);

-- ---------------------------------------------------------------------------
-- Funciones (horario ficticio; películas reales)
-- ---------------------------------------------------------------------------
INSERT INTO funcion (id, horario, pelicula_id, sala_id) VALUES
  ( 1, '2026-05-18 14:00:00',  1,  1),
  ( 2, '2026-05-18 17:30:00',  2,  1),
  ( 3, '2026-05-18 20:45:00',  9,  3),
  ( 4, '2026-05-18 15:15:00', 13,  2),
  ( 5, '2026-05-18 19:00:00', 19,  2),
  ( 6, '2026-05-19 16:00:00',  5,  4),
  ( 7, '2026-05-19 21:00:00', 11,  6),
  ( 8, '2026-05-19 18:30:00', 14,  5),
  ( 9, '2026-05-20 13:30:00', 18,  7),
  (10, '2026-05-20 22:00:00', 30,  9),
  (11, '2026-05-20 17:00:00',  8,  8),
  (12, '2026-05-21 20:00:00', 23,  4);

-- ---------------------------------------------------------------------------
-- Entradas (asientos y precios ficticios)
-- ---------------------------------------------------------------------------
INSERT INTO entrada (id, precio, asiento, funcion_id) VALUES
  ( 1, 8500.00, 'F12',  1),
  ( 2, 8500.00, 'F13',  1),
  ( 3, 9200.00, 'D08',  2),
  ( 4, 12000.00, 'A05', 3),
  ( 5, 12000.00, 'A06', 3),
  ( 6, 7800.00, 'H15',  4),
  ( 7, 7800.00, 'H16',  4),
  ( 8, 7800.00, 'H17',  4),
  ( 9, 9500.00, 'C10',  5),
  (10, 11000.00, 'B02', 7),
  (11, 6500.00, 'K20',  8),
  (12, 13500.00, 'VIP-03', 10);

-- ---------------------------------------------------------------------------
-- Pagos y ventas
-- ---------------------------------------------------------------------------
INSERT INTO pago (id, monto, tipo) VALUES
  (1, 17000.00, 'TARJETA'),
  (2,  9200.00, 'EFECTIVO'),
  (3, 24000.00, 'TARJETA'),
  (4, 23400.00, 'TARJETA'),
  (5,  9500.00, 'EFECTIVO'),
  (6, 11000.00, 'TARJETA');

INSERT INTO venta (id, fecha, cine_id, pago_id) VALUES
  (1, '2026-05-17 19:22:00', 1, 1),
  (2, '2026-05-17 20:05:00', 1, 2),
  (3, '2026-05-18 11:40:00', 1, 3),
  (4, '2026-05-18 18:55:00', 2, 4),
  (5, '2026-05-18 21:10:00', 2, 5),
  (6, '2026-05-19 09:30:00', 2, 6);

INSERT INTO venta_funcion (venta_id, funcion_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5),
  (6, 7);

INSERT INTO venta_cliente (venta_id, cliente_id) VALUES
  (1, 1), (1, 2),
  (2, 3),
  (3, 4),
  (4, 2), (4, 3),
  (5, 5),
  (6, 4);

-- ---------------------------------------------------------------------------
-- Compras de insumos a proveedores
-- ---------------------------------------------------------------------------
INSERT INTO compra (id, fecha, cine_id) VALUES
  (1, '2026-05-10 08:00:00', 1),
  (2, '2026-05-11 09:15:00', 2),
  (3, '2026-05-12 10:30:00', 3);

INSERT INTO compra_insumo (compra_id, insumo_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 5),
  (2, 3), (2, 4), (2, 6),
  (3, 1), (3, 7), (3, 8);

INSERT INTO compra_proveedor (compra_id, proveedor_id) VALUES
  (1, 1), (1, 4),
  (2, 2), (2, 3),
  (3, 1), (3, 2);

SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE pelicula   AUTO_INCREMENT = 31;
ALTER TABLE cine       AUTO_INCREMENT = 4;
ALTER TABLE sala       AUTO_INCREMENT = 10;
ALTER TABLE proveedor  AUTO_INCREMENT = 5;
ALTER TABLE insumo     AUTO_INCREMENT = 9;
ALTER TABLE empleado   AUTO_INCREMENT = 7;
ALTER TABLE cliente    AUTO_INCREMENT = 6;
ALTER TABLE funcion    AUTO_INCREMENT = 13;
ALTER TABLE entrada    AUTO_INCREMENT = 13;
ALTER TABLE pago       AUTO_INCREMENT = 7;
ALTER TABLE venta      AUTO_INCREMENT = 7;
ALTER TABLE compra     AUTO_INCREMENT = 4;
