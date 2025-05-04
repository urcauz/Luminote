import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function NoteEditor() {
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const { getToken } = useAuth();

  const handleSave = async () => {
    const token = await getToken();
    const res = await axios.post("http://localhost:5000/api/notes", { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSummary(res.data.summary);
  };

  useEffect(() => {
    socket.on("noteUpdate", ({ content }) => {
      setContent(content);
    });
    return () => socket.off("noteUpdate");
  }, []);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit("noteUpdate", { content: newContent });
  };

  return (
    <div>
      <textarea value={content} onChange={handleChange} rows={10} cols={60} />
      <br />
      <button onClick={handleSave}>Summarize & Save</button>
      <p><strong>Summary:</strong> {summary}</p>
    </div>
  );
}
