
-- NOTE: run it inside the mysql container

create database superheroes;
use superheroes;

create user 'superuser' identified by 'superpass';
grant all on superheroes.* to 'superuser';

insert into UserRoles (name) values ('Admin');
insert into UserRoles (name) values ('Standard');

insert into Users (username, name, password, roleId) values ('admin', 'Administrator', '$2b$10$WRi/8imxDHDY1KioI/TMLuiyAWgg9S8eB8rUKmJnLLl8OZvuTVrwy', 'Admin');
