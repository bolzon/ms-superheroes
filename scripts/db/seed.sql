
-- run this as root or superuser

use superheroes;

insert into UserRoles (name) values ('Admin');
insert into UserRoles (name) values ('Standard');

insert into Users (username, name, password, roleId)
	values ('admin', 'Administrator', '$2b$10$WRi/8imxDHDY1KioI/TMLuiyAWgg9S8eB8rUKmJnLLl8OZvuTVrwy', 'Admin');
