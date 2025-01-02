const MessageBubble = ({ message }) => {
  const isUser = message.sender === "You";

  // Inline styles for message bubbles
  const bubbleStyle = {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
    alignSelf: isUser ? "flex-end" : "flex-start",
    backgroundColor: isUser ? "#d4f3d7" : "#f1f1f1",
    color: "#333",
    textAlign: isUser ? "right" : "left",
  };

  return (
    <div style={bubbleStyle}>
      <p>{message.message}</p>
    </div>
  );
};

export default MessageBubble;
