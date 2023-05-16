import { useState, useEffect, useRef } from 'react';
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
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const buttonStyle = {
    width: '10%',
    height: 30,
    cursor: 'pointer',
  };

  const tableStyle = {
    width: '100%',
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
    noteFormRef.current.toggleVisibility();
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
        setUserName('');
        setPassword('');
      })
      .catch((_exception) => {
        setErrorMessage('Wrong credentials');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const noteFormRef = useRef();

  const loginForm = () => (
    <Togglable buttonLabel="Login">
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUserName={setUserName}
        setPassword={setPassword}
      />
    </Togglable>
  );

  const noteForm = () => (
    <Togglable buttonLabel="New note" ref={noteFormRef}>
      <NoteForm createNote={createNote} />
    </Togglable>
  );

  return (
    <div>
      <Notification message={errorMessage} />
      <div>
        <h1>Notes App</h1>
        {user === null ? (
          loginForm()
        ) : (
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
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>

        {user !== null && (
          <div>
            <p>{user.name} logged in</p>
            {noteForm()}
          </div>
        )}
      </div>
      <table id="notes" style={tableStyle}>
        <tbody>
          {notesToShow.map((note) => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => {
                toggleImportanceOf(note.id);
              }}
            />
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  );
};

export default App;
