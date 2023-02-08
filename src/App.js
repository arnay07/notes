import { useState, useEffect } from 'react';
import Note from './components/Note.js';
import notesService from './services/notes.js';
import Notification from './components/Notification.js';
import Footer from './components/Footer.js';
import Login from './components/Login.js';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const appStyle = {
    paddingLeft: 40,
    paddingBottom: 40,
  };

  const formStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  };

  const inputStyle = {
    width: '70%',
    height: 30,
  };
  const buttonStyle = {
    width: '10%',
    height: 30,
    cursor: 'pointer',
  };

  const topStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 20,
  };

  const hook = () => {
    notesService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  };

  useEffect(hook, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      notesService.setToken(user.token);
    }
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
      id: notes.length + 1,
    };
    notesService.create(noteObject).then((createdNote) => {
      setNotes(notes.concat(createdNote));
      setNewNote('');
    });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };
    notesService
      .update(id, changedNote)
      .then((updatedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : updatedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  return (
    <div>
      <div style={topStyle}>
        <h1 style={appStyle}>Notes</h1>
        {user !== null && (
          <button
            style={buttonStyle}
            onClick={() => {
              window.localStorage.removeItem('loggedNoteappUser');
              setUser(null);
            }}
          >
            Logout
          </button>
        )}
      </div>
      <Notification message={errorMessage} />
      <div style={appStyle}>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      {user ? (
        <form onSubmit={addNote} style={formStyle}>
          <label htmlFor="newNote">New note :&nbsp; </label>
          <input
            style={inputStyle}
            value={newNote}
            onChange={({ target }) => setNewNote(target.value)}
          />
          &nbsp;
          <button style={buttonStyle} type="submit">
            Save
          </button>
        </form>
      ) : (
        <Login setErrorMessage={setErrorMessage} setUser={setUser} />
      )}
      <ul id="notes">
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => {
              toggleImportanceOf(note.id);
            }}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;
