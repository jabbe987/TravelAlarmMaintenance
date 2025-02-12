import { useState } from "react";


// FUNCTION TO GET LOCATION FROM WEBSITE
// ONLY WORKS FOR WEB BROWSERS

const GetLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [permission, setPermission] = useState('not-asked');
    const [watchPosId, setWatchPosId] = useState(null);

    const options = {
        enableHighAccuracy: true,
        distanceFilter: 0.2,
        timeout: 10000,
    };

    const errorHandler = async () => {
        // await AsyncStorage.setItem("locationPermission", 'denied');

        setPermission('denied');
        setError("User has denied accesses to location!")
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

    const askPermission = async () => {
        const request = await navigator.permissions.query({"name" : "geolocation"});
        console.log(request)
        switch (request.state) {
            case "granted":
                setPermission('granted');
                updateLocation();    

                break;
            case "prompt":
                console.log("IN PROMPT");
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // await AsyncStorage.setItem("locationPermission", 'granted');
                        setPermission(true);
                        
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        setLocation({
                            latitude: latitude,
                            longitude: longitude,
                        });
                    }, (error) => {
                        errorHandler();
                    }
                ); 

                break;

            default:
                console.log("IN DENIED");
                errorHandler();
        }
    }

    const getLocation = () => {
        checkedStoredPermission();

        if (permission === 'not-asked') {
            askPermission();
        }

        if (permission === 'granted') {
            console.log("Granted permission");

            updateLocation();
        }

    };

    const updateLocation = () => {
        console.log("Going to update location");
        if (permission === 'granted') {
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    setLocation({
                        latitude: latitude,
                        longitude: longitude,
                    });

                    console.log(location)
                }, (error) => {
                    console.log("Error updating the users position", error)
                }, (options)
            );     

            setWatchPosId(id);
        }

    }

    const stopUpdatingLocation = () => {
        if (watchPosId) {
            navigator.geolocation.clearWatch(watchPosId);
            setWatchPosId(null);
            console.log("Stopped updating location");
        }
    }

    return (
        <div>
            <button onClick={getLocation}>Get Location</button>
            {location && <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
            {error && <p>Error: {error}</p>}
            {watchPosId && <button title="Stop Tracking" onClick={stopUpdatingLocation}>Stop updating location</button>}
        </div>
    );
};


export default GetLocation;