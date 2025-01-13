import { client } from "../config/db";


const postgresClient = () => {
    return client.connect().then(() => console.log("Connected to database")).catch((err) => console.log("somthing went wrong", err));
}


declare global {
    var connection: undefined | ReturnType<typeof postgresClient>
}

const connection = globalThis.connection ?? postgresClient();

export default connection


if (process.env.NODE_ENV !== 'production') globalThis.connection = connection