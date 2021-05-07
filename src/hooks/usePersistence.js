import { useEffect, useState } from 'react';
import Database from '../util/workoutPersistence';

export default function usePersistence() {
    const [db, setDb] = useState(null);

    useEffect(() => {
        const database = new Database();
        database.init().then(() => setDb(database));
    }, []);

    return db;
}