-- Coloque scripts iniciais aqui
CREATE TABLE IF NOT EXISTS CLIENTES (
    nome varchar(80) NOT NULL, limite integer NOT NULL
)

INSERT INTO
    clientes (nome, limite)
VALUES (
        'o barato sai caro', 1000 * 100
    ),
    ('zan corp ltda', 800 * 100),
    ('les cruders', 10000 * 100),
    (
        'padaria joia de cocaia', 100000 * 100
    ),
    ('kid mais', 5000 * 100);