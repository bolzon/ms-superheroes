FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD=admin
ENV MYSQL_DATABASE=superheroes
ENV MYSQL_USER=superuser
ENV MYSQL_PASSWORD=superpass
ENV MYSQL_DATA_DIR=/var/lib/mysql
ENV MYSQL_RUN_DIR=/run/mysqld
ENV MYSQL_LOG_DIR=/var/log/mysql

COPY scripts/db/config.sql /docker-entrypoint-initdb.d
COPY scripts/db/dump.sql /docker-entrypoint-initdb.d

EXPOSE 3306