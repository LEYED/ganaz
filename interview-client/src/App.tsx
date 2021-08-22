import React, {useEffect, useState} from 'react';

const SOCKET_SERVER_URL = 'ws://localhost:7777';

interface Call {
    first_name: string,
    last_name: string,
    priority: number
}

function App() {
    const [calls, setCalls] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!isConnected) {
            const socket = new WebSocket(SOCKET_SERVER_URL)

            socket.addEventListener('open', function (event) {
                console.log("websocket connected!")
            });

            socket.addEventListener('message', function (event) {
                console.log(event.data);
                setIsConnected(true);
                addCall(event.data);
            });
        }
    });

    const addCall = (data: string) => {
        const values = JSON.parse(data);
        // @ts-ignore
        if (values.first_name && values.last_name && values.priority) {
            // @ts-ignore
            setCalls(prevCalls => [...prevCalls, {
                first_name: values.first_name,
                last_name: values.last_name,
                priority: values.priority
            }].sort((a: Call, b: Call) => (a.priority < b.priority) ? 1 : -1));
        }
    }

    const answerFirstCall = () => {
        setCalls(calls.slice(1));
    }

    return (
        <div>
            <div>Total calls on hold: {calls.length}</div>

            <button onClick={answerFirstCall}>Answer first Call</button>

            {calls.map((call: Call) =>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1}}> Priority: {call.priority} </div>
                    <div style={{flex: 1}}> First name: {call.first_name} </div>
                    <div style={{flex: 1}}> Last name: {call.last_name} </div>
                </div>
            )}
        </div>

    );
}

export default App;
