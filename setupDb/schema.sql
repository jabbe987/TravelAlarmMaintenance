CREATE TABLE Trip (
    Trip_ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    Alarm_ID integer, 
    User_ID integer, 
    Start CHAR, 
    End CHAR, 
    ETA CHAR,
    FOREIGN KEY(Alarm_ID) REFERENCES Alarm(Alarm_ID),
    FOREIGN KEY(User_ID) REFERENCES User(User_ID)
);

CREATE TABLE User (
    User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    AlarmType INTEGER,
    AlarmValue INTEGER
);

CREATE TABLE Alarm (
    Alarm_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Trip_ID  INTEGER,
    Alarm_Time INTEGER,
    Status INTEGER, 
    FOREIGN KEY(Trip_ID) REFERENCES Trip(Trip_ID)
);

CREATE TABLE Location (
    Location_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name char,
    Coordinates char
);