import NoteEditor from "../components/NoteEditor";
import { UserButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div>
      <UserButton />
      <h2>Luminote</h2>
      <NoteEditor />
    </div>
  );
}
