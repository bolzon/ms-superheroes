
-- NOTE: run it inside the mysql container

create database superheroes;

use superheroes;

create user 'superuser' identified by 'superpass';

grant all on superheroes.* to 'superuser';
