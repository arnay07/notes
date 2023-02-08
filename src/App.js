import { useState, useEffect } from 'react';
import Note from './components/Note.js';
import notesService from './services/notes.js';
import Notification from './components/Notification.js';
import Footer from './components/Footer.js';
import LoginForm from './components/LoginForm.js';
import Togglable from './components/Togglable.js';
import loginService from './services/login.js';
import NoteForm from './components/NoteForm.js';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const buttonStyle = {
    width: '10%',
    height: 30,
    cursor: 'pointer',
  };

  const appStyle = {
    paddingLeft: 40,
    paddingBottom: 40,
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

  const createNote = (noteObject) => {
    noteObject.id = notes.length + 1;
    noteObject.date = new Date().toISOString();
    notesService.create(noteObject).then((createdNote) => {
      setNotes(notes.concat(createdNote));
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

  const handleLogin = ({ username, password }) => {
    loginService
      .login({
        username,
        password,
      })
      .then((user) => {
        window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
        setUser(user);
        notesService.setToken(user.token);
      })
      .catch((error) => {
        setErrorMessage('Wrong credentials');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const loginForm = () => (
    <Togglable buttonLabel="Login">
      <LoginForm handleLogin={handleLogin} />
    </Togglable>
  );

  const noteForm = () => (
    <Togglable buttonLabel="New note">
      <NoteForm createNote={createNote} />
    </Togglable>
  );

  return (
    <div>
      <Notification message={errorMessage} />
      <div style={topStyle}>
        <h1 style={appStyle}>Notes</h1>
        {user === null && loginForm()}
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
      <div style={appStyle}>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>

        {user !== null && noteForm()}
      </div>

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
