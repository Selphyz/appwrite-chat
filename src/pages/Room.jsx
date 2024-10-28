import {useState, useEffect} from 'react'
import {COLLECTION_ID_MESSAGES, database, DATABASE_ID} from "../appWriteConfig.js";
import {ID, Query} from 'appwrite'

const Room = () => {
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState("");
    const getMessages = async () => {
        const response = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES, [
                Query.orderDesc('$createdAt')
            ])
        console.log(response);
        setMessages(response.documents)
    }
    useEffect(() => {
        getMessages();
    }, []);
    const handleSumit = async (e) => {
        e.preventDefault();
        let payload = {
            body: messageBody
        }
        let response = await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload
        );
        setMessages(prevState => [response, ...messages]);
        setMessageBody("");
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
                                <small className="message-timestamp">{message.$createdAt}</small>
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