import {useState, useEffect} from 'react'
import client, {COLLECTION_ID_MESSAGES, database, DATABASE_ID} from "../appWriteConfig.js";
import {ID, Query} from 'appwrite'
import {Trash2} from "react-feather";

const Room = () => {
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState("");
    const getMessages = async () => {
        const response = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES, [
                Query.orderDesc('$createdAt'),
                Query.limit(10)
            ])
        console.log(response);
        setMessages(response.documents)
    }
    useEffect(() => {
        getMessages();
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, (response) => {
            console.log(response);
            if (response.events.some(event => /databases\.\*\.collections\.\*\.documents\.\*\.create/.test(event))){
                setMessages(prevState => [response.payload, ...prevState]);
                console.log("create");
            }
            if(response.events.some(event => /databases\.\*\.collections\.\*\.documents\.\*\.delete/.test(event))){
                setMessages(prevState => [response.payload, ...prevState]);
                console.log("delete");
            }
        });
        return () => {
            unsubscribe();
        }
    }, []);
    const handleSumit = async (e) => {
        e.preventDefault();
        let payload = {
            body: messageBody
        }
        await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload
        );
        setMessageBody("");
    }
    const handleDelete = async (id) => {
        console.log(id);
        await database.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id);
        messages.filter((message) => message.$id !== id);
    }
    return (
        <main className="container">
            <div className="room--container">
                <form onSubmit={handleSumit} id="message--form">
                    <div>
                        <textarea
                            required
                            maxLength="1000"
                            placeholder="Say algo"
                            onChange={(e)=>{setMessageBody(e.target.value)}}
                            value={messageBody}>
                        </textarea>
                    </div>
                    <div className="send-btn--wrapper">
                        <input className="btn btn--secondary" type="submit" value="Send"/>
                    </div>
                </form>
                <div>
                    {messages && messages.map((message) => (
                        <div key={message.$id} className="message--wrapper">
                            <div className="message--header">
                                <small className="message-timestamp">
                                    {new Date(message.$createdAt).toLocaleDateString()} {new Date(message.$createdAt).toLocaleTimeString()}
                                </small>
                                <Trash2 className="delete--btn" onClick={() => handleDelete(message.$id)}>Delete</Trash2>
                            </div>
                            <div className="message--body">
                                <span>{message.body}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Room