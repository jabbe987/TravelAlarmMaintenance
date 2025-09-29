import { useEffect, useState } from "react";


type ETAUpdaterProps = {
    setETA: (eta: string) => void; // Function to update ETA in parent component
};


const ETAUpdater = ({ setETA }: ETAUpdaterProps) => {
    const [isActiveTrip, setIsActiveTrip] = useState(true);


    useEffect(() => {
        const updateETA = async () => {
            if (!isActiveTrip) return; // Stop updating if no active trip


            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;


                    try {
                        const response = await fetch(`/update-eta?lat=${latitude}&lng=${longitude}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" }
                        });


                        const data = await response.json();
                        console.log("Updated ETA:", data);


                        if (!data.isActive) {
                            setIsActiveTrip(false); // Stop updates when trip ends
                        } else {
                            setETA(data.newETA); // ✅ Update ETA in parent
                        }
                    } catch (error) {
                        console.error("Error updating ETA:", error);
                    }
                });
            }
        };


        const interval = setInterval(updateETA, 60000);


        return () => clearInterval(interval);
    }, [isActiveTrip]);


    return null; // No UI, only runs logic
};


export default ETAUpdater;
