import React, { useState, useEffect } from 'react';
import config from './config';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
// import { gapi } from 'gapi';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    maxWidth: '650px'
  },
  h1: {
    marginTop: '30px',
    marginBottom: '50px',
  },
  buttonContainer: {
    display: 'flex',
    margin: '30px 0'
  }
}

function App() {
  const [json, setJson] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [docId,setDocId] = useState('');
  const gapi = window.gapi;

  const initClient = () => {
    gapi.client.init({
      apiKey: config.apiKey,
      clientId: config.cliendId,
      discoveryDocs: config.discoveryDocs,
      scope: config.scope
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn(isSignedIn));
      // Handle the initial sign-in state
      setIsSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  useEffect(() => {
      gapi.load('client:auth2', initClient);
  },[])

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  }

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  }

  const handleGetJson = () => {
    window.gapi.client.docs.documents.get({
      documentId: '1xVxwds3cdBAHPxYfIuIJxsYqCpi9hAOU2-qcqdoFoIQ'
    })
    .then(response => {
      const doc = response.result;
      const body = doc.body;
      setJson(body);
    })
    .catch(error => {
      console.log(error)
    })
  }

  const parseDocumentUrl = (url) => {
    setDocId(url.match(/[-\w]{25,}/));
  }
  
  return (
    <div style={styles.root}>
      <h1 style={styles.h1}>Google Docs Integration</h1>
      <TextField variant='standard' placeholder='Document ID' onChange={(event) => parseDocumentUrl(event.target.value)} />
      {docId}
      <div style={styles.buttonContainer}>
        {isSignedIn
          ? <Button onClick={handleSignoutClick} variant='outlined' color='primary'>Sign out</Button>
          : <Button onClick={handleAuthClick} variant='outlined' color='primary'>Authorize</Button>
        }
      </div>
      <div>
        <button onClick={handleGetJson}>GET</button>
      </div>
      <pre>
        {json ? JSON.stringify(json, null, 4) : null}
      </pre>
    </div>
  );
}

export default App;
