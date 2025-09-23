CREATE TABLE Trip (
    Trip_ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    Alarm_ID integer, 
    User_ID integer, 
    Start_date DATE, 
    End_date DATE, 
    ETA DATE,
    FOREIGN KEY(Alarm_ID) REFERENCES Alarm(Alarm_ID),
    FOREIGN KEY(User_ID) REFERENCES User(User_ID)
);

CREATE TABLE User (
    User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    AlarmType char,
    AlarmValue char
);

CREATE TABLE Alarm (
    Alarm_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Trip_ID  INTEGER,
    Alarm_Time DATE,
    Status CHAR, 
    FOREIGN KEY(Trip_ID) REFERENCES Trip(Trip_ID)
);

CREATE TABLE Location (
    Location_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name char,
    Coordinates char
);