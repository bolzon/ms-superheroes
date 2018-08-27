
-- run this as root on mysql

create database superheroes;
use superheroes;

create user 'superuser' identified by 'superpass';
grant all on superheroes.* to 'superuser';
