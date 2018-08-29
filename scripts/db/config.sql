
FLUSH PRIVILEGES;
CREATE USER IF NOT EXISTS 'superuser' IDENTIFIED BY 'superpass';
GRANT ALL ON superheroes.* TO 'superuser';
