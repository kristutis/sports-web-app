ALTER TABLE users
ADD UNIQUE (email);

ALTER TABLE `users` CHANGE `password` `password` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;

admin hash $2b$10$dN.67YJ0oMVqYtQ4lRzOXuCFyrFGn57DFGwyanZo8DFCeHb8Tma9C

create table orders ( order_id int AUTO_INCREMENT PRIMARY KEY, fk_user_id int not null, fk_product_id int not null, quantity float not null, total_price float not null );

create table trainer_ratings ( 
    fk_user_id int not null,
    trainer_id int not null,
    rating float not null,
    date timestamp NOT NULL DEFAULT current_timestamp() on UPDATE CURRENT_TIMESTAMP(),
    CONSTRAINT pk_trainer_comment PRIMARY KEY (fk_user_id,trainer_id)
);


create table trainer_comments ( 
    id int PRIMARY KEY AUTO_INCREMENT,
    fk_user_id int not null,
    trainer_id int not null,
    comment text not null,
    date timestamp NOT NULL DEFAULT current_timestamp() on UPDATE CURRENT_TIMESTAMP()
);


create TABLE trainers ( id int PRIMARY KEY AUTO_INCREMENT, name varchar(255) NOT NULL, surname varchar(255) NOT NULL, price float not null, description text not null, moto varchar(255) NOT NULL );

INSERT INTO trainers (name, surname, price, description, moto)
VALUES ('Treneris 1', 'Petrauskas', 55.55, 'Labai geras treneris', 'Sportas - sveikata!');

INSERT INTO trainers (name, surname, price, description, moto)
VALUES ('Treneris 2', 'Jonauskas', 66.66, 'Labai blogas treneris', 'Man patinka sportuoti!');
