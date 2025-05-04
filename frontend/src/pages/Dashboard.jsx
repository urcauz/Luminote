import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
    })();
  }, []);

  return (
    <div>
      <h2>Your Notes</h2>
      {notes.map(note => (
        <div key={note._id}>
          <p>{note.content}</p>
          <strong>{note.summary}</strong>
        </div>
      ))}
    </div>
  );
}
