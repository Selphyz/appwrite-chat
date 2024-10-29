import { Client, Databases } from 'appwrite';

export const PROJECT_ID = '671fa7450021c9ae4dc7';
export const DATABASE_ID = '67200f91000d5b573df6';
export const COLLECTION_ID_MESSAGES = '67200f9e0021e8df13aa';
const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('671fa7450021c9ae4dc7');

export const database = new Databases(client);
export default client;