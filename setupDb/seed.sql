INSERT INTO User(AlarmType, AlarmValue) VALUES (1, 10);
INSERT INTO User(AlarmType, AlarmValue) VALUES (0, 15);
INSERT INTO User(AlarmType, AlarmValue) VALUES (1, 5);

INSERT INTO Alarm(Trip_ID, Alarm_Time, Status) VALUES(1, 5, 0);
INSERT INTO Alarm(Trip_ID, Alarm_Time, Status) VALUES(2, 5, 0);
INSERT INTO Alarm(Trip_ID, Alarm_Time, Status) VALUES(3, 5, 0);
INSERT INTO Alarm(Trip_ID, Alarm_Time, Status) VALUES(4, 5, 0);

INSERT INTO Trip(Alarm_ID, User_ID, Start, End, ETA) VALUES(1, 1, "59.33258, 18.0649", "57.70716, 11.96679", "13:00");
INSERT INTO Trip(Alarm_ID, User_ID, Start, End, ETA) VALUES(1, 1, "59.85882, 17.63889", "59.33258, 18.0649", "10:00");
INSERT INTO Trip(Alarm_ID, User_ID, Start, End, ETA) VALUES(2, 1, "59.85882, 17.63889", "60.67452, 17.14174", "09:00");
INSERT INTO Trip(Alarm_ID, User_ID, Start, End, ETA) VALUES(2, 2, "59.85882, 17.63889", "58.41086, 15.62157", "19:00");
INSERT INTO Trip(Alarm_ID, User_ID, Start, End, ETA) VALUES(3, 2, "59.85882, 17.63889", "59.61617, 16.55276", "21:00");
INSERT INTO Trip(Alarm_ID, User_ID, Start, End, ETA) VALUES(4, 3, "59.85882, 17.63889", "59.63607, 17.07768", "22:00");

INSERT INTO Location(Name, Coordinates) VALUES("Stockholm", "59.33258, 18.0649");
INSERT INTO Location(Name, Coordinates) VALUES("Göteborg", "57.70716, 11.96679");
INSERT INTO Location(Name, Coordinates) VALUES("Uppsala", "59.85882, 17.63889");
INSERT INTO Location(Name, Coordinates) VALUES("Linköping", "58.41086, 15.62157");
INSERT INTO Location(Name, Coordinates) VALUES("Gävle", "60.67452, 17.14174");
INSERT INTO Location(Name, Coordinates) VALUES("Västerås", "59.61617, 16.55276");
INSERT INTO Location(Name, Coordinates) VALUES("Enköping", "59.63607, 17.07768");
