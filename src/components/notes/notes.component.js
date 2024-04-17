import React, { useState, useEffect } from 'react';
import NotesDrawer from './drawer/drawer.component';
import NotesEditor from './editor/editor.component';
import { AppBar, IconButton, CssBaseline, Box, Snackbar, Alert } from '@mui/material';
import SegmentRoundedIcon from '@mui/icons-material/SegmentRounded';
import { getAllNotes as getAllNotesService, getCurrentNote, saveNoteContent as saveNoteContentService, addNewNote as addNewNoteService } from '../../services/notes.service';
import './notes.component.css';

const drawerWidth = 240;
let toastMessage = '';
let severity = 'success';
function Notes() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [notesList, setNotesList] = useState([]);
    const [currentNote, setCurrentNote] = useState({});
    const [open, setOpen] = useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
      };
    
      const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
      };
    
      const handleDrawerToggle = () => {
        if (!isClosing) {
          setMobileOpen(!mobileOpen);
        }
      };

      useEffect(() => {
        getAllNotes(true);
      }, []);

      useEffect(() => {
        if(!currentNote._id) return;
        getCurrentNote(currentNote._id)
          .then(note => {
            setCurrentNote(note.data);
          })
      }, [currentNote._id]);

      const getAllNotes = async (initialRequest) => {
        const res = await getAllNotesService()
        if(initialRequest) setCurrentNote(res.data[0]);
        setNotesList(res.data);
      }

      const saveNoteContent = (content) => {
        const updatedNote = {...currentNote, ...content};
        saveNoteContentService(updatedNote).then((res) => {
            if(res.status === 200) {
                setCurrentNote(updatedNote);
                toastMessage = 'Note saved successfully';
                severity = 'success';
                openToast();
            }
        })
      }

      const addNewNote = (title) => {
        addNewNoteService(title).then((res) => {
          console.log(res);
            if(res.status === 200) {
                getAllNotes(false);
                toastMessage = 'Note created successfully';
                severity = 'success';
                openToast();
            }
        })
      }

      const openToast = () => {
        setOpen(true);
      };
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

      const drawerProps = {
        mobileOpen,
        setMobileOpen,
        drawerWidth,
        handleDrawerClose,
        handleDrawerTransitionEnd,
        notesList,
        currentNote,
        setCurrentNote,
        setNotesList,
        addNewNote,
        container: document.body
      };

      if(!currentNote || !currentNote.title) {
        return <div>Loading...</div>
      }
    return (
        <section className="notes-ctr">
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={
                        { 
                            top: {xs: 'auto', sm: 0}, 
                            bottom: {xs: 0, sm: 'auto'}, 
                            width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, 
                            pt: {sm: '3%', xs: '25px'},
                            pb: {xs: '3%', sm: '25px'}
                        }
                    
                    } > 
                        <section className='notes-top-bar'> 
                            <span className='note-title'> {currentNote.title || ''} </span>
                            <section className='add-note-button'>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <SegmentRoundedIcon />
                            </IconButton>
                            </section>
                        </section> 
                </AppBar>
                <NotesDrawer {...drawerProps}/>
                <Box
                    component="main"
                    sx={
                        { 
                            flexGrow: 1, 
                            p: 3, 
                            width: { sm: `calc(100% - ${drawerWidth}px)`}, 
                            position:{sm: 'fixed'}, 
                            top:{sm: '12%'}, 
                            left:{sm: drawerWidth},
                            pl:'3%',
                            pr:'3%',
                            maxWidth:'100%',
                        }}
                >
                    <section className='notes-body'>
                        {currentNote.content && <NotesEditor currentNote={currentNote} saveNoteContent={saveNoteContent}/>}
                    </section>
                </Box>
            </Box>
            
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {toastMessage}
                </Alert>
            </Snackbar>
        </section>
    );
}

export default Notes;