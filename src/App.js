import React, { useState, useEffect } from 'react';
import config from './config';
import Button from '@material-ui/core/Button';
import { TextField, Paper, Tabs, Tab, Typography, makeStyles } from '@material-ui/core';
// import { gapi } from 'gapi';

const useStyles = makeStyles({
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
  },
  outputHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  tabs: {
    flexGrow: 1
  },
  textField: {
    margin: '20px 0'
  },
  getButton: {
    marginRight: '20px'
  }
})

function App() {
  const [json, setJson] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [docId,setDocId] = useState('');
  const gapi = window.gapi;
  const [tab,setTab] = useState(0);
  const classes = useStyles();

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

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  
  return (
    <div className={classes.root}>
      <h1 className={classes.h1}>Google Docs Integration</h1>
      <div className={classes.buttonContainer}>
        {isSignedIn
          ? <Button onClick={handleSignoutClick} variant='outlined' color='primary'>Sign out</Button>
          : <Button onClick={handleAuthClick} variant='outlined' color='primary'>Authorize</Button>
        }
      </div>
      <TextField className={classes.textField} variant='standard' placeholder='Document ID' onChange={(event) => parseDocumentUrl(event.target.value)} />
      <Typography variant='body2' color='textSecondary'>{docId}</Typography>
      <Paper square className={classes.outputHeader}>
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab label="GDoc JSON" />
          <Tab label="Floovio JSON" />
          <Tab label="HTML" />
        </Tabs>
        <Button onClick={handleGetJson} variant='contained' size='small' color='primary' className={classes.getButton} disabled={!isSignedIn}>Get</Button>
      </Paper>
      <Paper> 
        <pre>
          {(json && tab === 0) ? JSON.stringify(json, null, 4) : null}
        </pre>
      </Paper>
    </div>
  );
}

export default App;
