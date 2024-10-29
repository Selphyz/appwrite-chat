import {useState, useEffect} from 'react'
import client, {COLLECTION_ID_MESSAGES, database, DATABASE_ID} from "../appWriteConfig.js";
import {ID, Permission, Query, Role} from 'appwrite'
import {Trash2} from "react-feather";
import Header from "../components/Header.jsx";
import {useAuth} from "../utils/AuthContext.jsx";

const Room = () => {
    const {user} = useAuth();
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
        const handleEvents = response => {
            console.log(response);
            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                setMessages(prevMessages => [response.payload, ...prevMessages]);
            }

            if(response.events.includes('databases.*.collections.*.documents.*.delete')) {
                //setMessages(messages.filter(message => message.$id !== response.payload.$id))
                setMessages((prevMessages) => prevMessages.filter((message) => message.$id !== response.payload.$id)
                );
            }


        };
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
            handleEvents
        );
        return () => {
            unsubscribe();
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const permissions = [Permission.write(Role.user((user.$id)))];
        const payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody
        }
        await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload,
            permissions
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
            <Header />
            <div className="room--container">
                <form onSubmit={handleSubmit} id="message--form">
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
                                <p>
                                    <span>{message?.username ?? 'Anonymous'}</span>
                                </p>
                                <small className="message-timestamp">
                                    {new Date(message.$createdAt).toLocaleDateString()} {new Date(message.$createdAt).toLocaleTimeString()}
                                </small>
                                {message.$permissions.includes(`delete("user:${user.$id}")`) &&
                                <Trash2 className="delete--btn" onClick={() => handleDelete(message.$id)}>Delete</Trash2>}
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