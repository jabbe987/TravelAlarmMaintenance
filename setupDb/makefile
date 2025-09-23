run:
	chmod +x script.bash
	./script.bash

open: 
	sqlite3 travelAlarm.db

data: 
	sqlite3 travelAlarm.db < seed.sql

reset: 
	sqlite3 travelAlarm.db < reset.sql