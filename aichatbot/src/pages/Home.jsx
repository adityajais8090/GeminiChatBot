import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import { uploadFile } from '../service/api';
import MessageBubble from '../components/MessageBubble';
import SpinnerLoader from '../components/SpinnerLoader';

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [conversation, setConversation] = useState("No conversation yet");
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        // Update sidebar width when sidebarCollapsed state changes
        if (sidebarCollapsed) {
            document.querySelector('.chat-container').style.width = '96%';
            document.querySelector('.chat-container').style.marginLeft = '3%';
        } else {
            document.querySelector('.chat-container').style.width = 'calc(100% - 300px)';
            document.querySelector('.chat-container').style.marginLeft = '300px';
        }
    }, [sidebarCollapsed]);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Function to handle sending the message
    const handleSendMessage = async () => {
        
        if (userInput.trim() === "" && !file) {
            return; // Don't send empty message
        }

        try {
            setLoading(true);
            const payload = new FormData();

            // Append the message if it exists
            if (userInput && userInput.trim()) {
                payload.append('message', userInput.trim());
            } else {
                console.error("User input is missing.");
            }
            // Append the file only if it exists
            if (file) {
                payload.append('file', file);
            }
            console.log("Payload ", payload);

            const response = await uploadFile(payload);
            console.log("File uploaded successfully:", response);

            // Add the message and file to the conversation
            setMessages((prevMessages) => [
                ...prevMessages, 
                { sender: "You", message: userInput }, 
                { sender: "Gemini", message: response.extractedData }
              ]);
            setLoading(false);

            setUserInput(''); // Reset input field
            setFileName('');  // Reset file name
            setFile(null);    // Reset file
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <>
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="tooltip">
                    <span className="tooltiptext">Open Sidebar</span>
                    <button onClick={toggleSidebar}>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div className="sidebar-content">
                    <div className="conversation-list">
                        <div className="conversation">
                            <p className="conversation-text">Last Conversation:</p>
                            <p className="conversation-content">{conversation}</p>
                        </div>
                    </div>
                    <button onClick={() => setConversation('New Conversation Started!')}>
                        Start New Conversation
                    </button>
                </div>
            </div>

            <div className={`chat-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className="chat-content">
                    <div className="chat-header">
                        <div className="logo-container">
                            <h1>ChatGPT 3.5&nbsp;<i className="fa fa-caret-down"></i></h1>
                        </div>
                        <div className="mode-toggle">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isDarkMode}
                                    onChange={toggleDarkMode}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                 
                 {loading ? <SpinnerLoader/> : (
                    <div className="chat-box">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <MessageBubble key={index} message={msg} />
                            ))
                        ) : (
                            <p>No messages yet.</p>
                        )}
                    </div>
                 )}

                    
                    <form onSubmit={(e) => {
                            e.preventDefault(); // Prevent browser reload
                            handleSendMessage(); // Call the message-sending function
                        }}
                        > 

                        <div className="input-container">
                            {fileName && (
                                <div className="file-info">
                                    <p>File Uploaded: {fileName}</p>
                                </div>
                            )}
                            <label htmlFor="file-upload" className="file-upload-label">
                                📎
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                className="file-upload-input"
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (selectedFile) {
                                        setFile(selectedFile);
                                        setFileName(selectedFile.name);
                                        console.log("File uploaded:", selectedFile.name);
                                    }
                                }}
                            />

                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <button type="submit"> {/* Prevent form submission */}
                                <b>&uarr;</b>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
};

export default Home;
