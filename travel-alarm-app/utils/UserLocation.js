

export const errorHandler = async (error) => {
    console.log(error)
}

// TODO: FIX STORAGE FOR PERMISSION
const checkedStoredPermission = async () => {
    // try 
    // {
    //     console.log(AsyncStorage)
    //     const permissionStatus = await AsyncStorage.getItem("locationPermission")
    //     console.log(permissionStatus)
    //     if (permissionStatus) {
    //         setPermission(permissionStatus);
    //     } else {
    //         setPermission('not-asked')
    //     }
    // }
    // catch (e) {
    //     console.log("Could not access async storage while trying to retrieve permission status", e);
    // }
}

const askPermission = async (setPermission, setLocation) => {
    const request = await navigator.permissions.query({"name" : "geolocation"});
    console.log(request)
    switch (request.state) {
        case "granted":
            setPermission('granted');
               
            console.log("IN PROMPT");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // await AsyncStorage.setItem("locationPermission", 'granted');
                    setPermission(true);
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    setLocation([latitude, longitude]);
                }, (error) => {
                    errorHandler();
                }
            ); 
            break;
        case "prompt":
            console.log("IN PROMPT");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // await AsyncStorage.setItem("locationPermission", 'granted');
                    setPermission(true);
                    
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    setLocation([latitude, longitude]);
                }, (error) => {
                    errorHandler(error);
                }
            ); 

            break;

        default:
            console.log("IN DENIED");
            errorHandler();
    }
}

export const getLocation = (permission, setPermission, setLocation, location, options, setWatchPosId) => {
    checkedStoredPermission();

    if (permission === 'not-asked') {
        return askPermission(setPermission, setLocation);
    }

    if (permission === 'granted') {
        console.log("Granted permission");
        getLocation(setPermission, setLocation)
        //updateLocation(permission, location, setLocation, options, setWatchPosId);
    }

};

export const updateLocation = (permission, location, setLocation, options, setWatchPosId) => {
    console.log("Going to update location", permission);
    if (permission === 'granted') {
        const id = navigator.geolocation.watchPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setLocation([latitude, longitude]);

                console.log(location)
            }, (error) => {
                console.log("Error updating the users position", error)
            }, (options)
        );     

        setWatchPosId(id);
    }

}

export const stopUpdatingLocation = (watchPosId, setWatchPosId) => {
    if (watchPosId) {
        navigator.geolocation.clearWatch(watchPosId);
        setWatchPosId(null);
        console.log("Stopped updating location");
    }
}