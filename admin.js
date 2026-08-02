let editID = null;


// Upload / Update Note

function addNote(){

let title = document.getElementById("noteTitle").value;
let description = document.getElementById("noteDescription").value;
let category = document.getElementById("noteCategory").value;
let thumbnail = document.getElementById("thumbnailURL").value;
let pdf = document.getElementById("pdfURL").value;


if(title=="" || pdf==""){
    alert("Title and PDF required");
    return;
}


let notesRef = dbRef(window.db,"notes");


if(editID){

    let updateRef = dbRef(window.db,"notes/"+editID);

    dbUpdate(updateRef,{
        title:title,
        description:description,
        category:category,
        thumbnail:thumbnail,
        pdf:pdf
    });


    editID=null;

    alert("Note Updated");


}else{


let newNote = dbPush(notesRef);


dbSet(newNote,{

title:title,
description:description,
category:category,
thumbnail:thumbnail,
pdf:pdf

});


alert("Note Uploaded");


}


clearForm();

}



// Load Notes

let allNotes=[];


dbOnValue(
dbRef(window.db,"notes"),
(snapshot)=>{


allNotes=[];


snapshot.forEach((child)=>{

allNotes.push({

id:child.key,

...child.val()

});


});


showNotes(allNotes);


});




// Show Notes

function showNotes(notes){


let box=document.getElementById("adminNotesList");


box.innerHTML="";


notes.forEach(note=>{


box.innerHTML += `

<div class="note-item">

<h3>${note.title}</h3>

<p>${note.category}</p>

<p>${note.description}</p>


<button onclick="editNote('${note.id}')">
Edit
</button>


<button onclick="deleteNote('${note.id}')">
Delete
</button>


</div>

`;

});


}




// Delete Note

function deleteNote(id){


if(confirm("Delete this note?")){


dbRemove(
dbRef(window.db,"notes/"+id)
);


}


}



// Edit Note

function editNote(id){


let note = allNotes.find(n=>n.id==id);


document.getElementById("noteTitle").value=note.title;

document.getElementById("noteDescription").value=note.description;

document.getElementById("noteCategory").value=note.category;

document.getElementById("thumbnailURL").value=note.thumbnail;

document.getElementById("pdfURL").value=note.pdf;


editID=id;


}




// Search Admin Notes

function adminSearchNotes(){


let value=document
.getElementById("adminSearch")
.value
.toLowerCase();



let filtered=allNotes.filter(note=>

note.title.toLowerCase()
.includes(value)

);



showNotes(filtered);


}




function clearForm(){

document.getElementById("noteTitle").value="";

document.getElementById("noteDescription").value="";

document.getElementById("thumbnailURL").value="";

document.getElementById("pdfURL").value="";

}



// Logout

function logout(){

window.location.href="index.html";

}