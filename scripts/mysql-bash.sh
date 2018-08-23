
# run the mysql container
#docker run -d -p 3306:3306 -P -e MYSQL_ROOT_PASSWORD=admin --name mysql-superheroes mysql:5.7

# access mysql docker bash
docker exec -it mysql-superheroes bash

# access mysql bash inside container
#mysql -u root -p
