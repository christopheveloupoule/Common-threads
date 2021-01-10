CREATE TABLE series (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  released_Date DATE NOT NULL,
  watched BOOLEAN NOT NULL 
);


INSERT INTO series (name, released_Date, watched) VALUES 
('Friends', '2004-01-13', TRUE),
('Breaking Bad', '2013-12-03', False),
('GOT', '2019-06-15', TRUE),
('Seinfeld', '1998-08-18', False),
('Les soprano', '2007-12-03', False),
('Les simpson', '2018-10-14', TRUE),
('Cheers', '1993-05-12', False);

