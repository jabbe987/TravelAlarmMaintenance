export type RootStackParamList = {
    AddTrip: { userId?: number};
    Map: { trip?: Trip };
  };

export type Trip = {
    Alarm_ID: number, 
    ETA: string, 
    End: string, 
    Start: string, 
    Trip_ID: number, 
    User_ID: number
}