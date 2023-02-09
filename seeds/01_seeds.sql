INSERT INTO users (name,email,password)
VALUES ('Emma', 'emma@mail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Steve', 'steve@mail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Alex', 'alex@mail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url, country, street,
  city, province, post_code
)
VALUES (1,'title','desc','thumburl','coverurl','country','street','city','province','postal'), 
(2,'title','desc','thumburl','coverurl','country','street','city','province','postal'), 
(3,'title','desc','thumburl','coverurl','country','street','city','province','postal');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews ( guest_id,property_id,reservation_id,rating,message)
VALUES 
(3,2,1,3,'messages'),
(2,2,2,4,'messages'),
(3,1,3,4,'messages');