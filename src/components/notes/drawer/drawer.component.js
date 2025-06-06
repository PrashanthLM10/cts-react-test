import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Box, Button, List, ListItem, ListItemText, Divider, Toolbar, IconButton, Tooltip, Menu, MenuItem, TextField } from '@mui/material';
import PostAddTwoToneIcon from '@mui/icons-material/PostAddTwoTone';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import './drawer.component.css';

function NotesDrawer(props) {
const { drawerWidth, handleDrawerClose, handleDrawerTransitionEnd, mobileOpen, setMobileOpen} = props;
   

    return (  
      
      <Box  component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} > 
        <Drawer
          container={document.body}
          anchor='right'
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <NotesList {...props} isMobile={true}/>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
            <NotesList {...props} />
        </Drawer>
      </Box>
    )
}


function NotesList(props) {
    const { notesList, currentNote, setCurrentNote, setMobileOpen, addNewNote, drawerWidth, deleteNote, isMobile} = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const newNoteTitleRef= useRef(null);
    const open = Boolean(anchorEl);
    const openAddNewMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const closeAddNewMenu = () => {
      setAnchorEl(null);
    };

    const addNewNoteHandler = () => {
      addNewNote(newNoteTitleRef.current.value);
      closeAddNewMenu();
    }
    return (
        <section className='notes-list-ctr'> 
            <span className='notes-title'> Notes</span>
            <ul className='notes-list'>
                {notesList.map((note, idx) => (
                <li 
                    key={note._id} 
                    onClick={() => {if(currentNote._id !== note._id) {setCurrentNote(notesList[idx])}; setMobileOpen(false)}} 
                    className={note._id === currentNote._id ? 'selected-note note': 'note'}>
                      <span>{note.title}</span>
                      <section className={`note-btns-ctr ${isMobile ? 'mobile-view' : ''}`}>
                        <IconButton size="small" onClick={(e) => {e.stopPropagation(); deleteNote(note._id);}}> <DeleteForeverTwoToneIcon /> </IconButton>
                      </section>
                </li>
            ))}
            </ul>
            <section className='add-new-note-btn' style={{width: drawerWidth}} id="add-new-item-menu" onClick={openAddNewMenu}>
              <IconButton
                  color="#736e6e"
                  edge="start"
                  sx={{ mr: 2, width: drawerWidth}}
              >
                  <PostAddTwoToneIcon />
                  <span className='add-new-note-btn-text'> Add New Note</span>
              </IconButton>
            </section>
            <Menu
              id="add-new-item-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={closeAddNewMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem> 
                <section className='add-new-title-text-ctr'>
                   <TextField required placeholder='Enter title' inputRef={newNoteTitleRef} size='small'/> 
                  <Button variant='contained' className='save-btn footer-btn right-aligned-btn' onClick={addNewNoteHandler}>
                    <DoneRoundedIcon />
                    <span>Add</span>
                  </Button>
                </section>
              </MenuItem>
            </Menu>
        </section>
    )
}

export default NotesDrawer;