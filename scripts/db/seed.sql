
-- run this as root or superuser

use superheroes;

insert into UserRoles (name, description)
	values ('Admin', 'Admin users can list and modify contents');

insert into UserRoles (name, description)
	values ('Standard', 'Standard users can just list contents');

insert into Users (username, name, password, roleId)
	values ('admin', 'Administrator', '$2b$10$WRi/8imxDHDY1KioI/TMLuiyAWgg9S8eB8rUKmJnLLl8OZvuTVrwy', 'Admin');
