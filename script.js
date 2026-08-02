let notesData = [];


// Load Notes From Firebase

dbOnValue(
dbRef(window.db,"notes"),
(snapshot)=>{


notesData=[];


snapshot.forEach((child)=>{


notesData.push({

id:child.key,

...child.val()

});


});


displayNotes(notesData);


});




// Display Notes

function displayNotes(notes){


let container = document.getElementById("notesContainer");


container.innerHTML="";



if(notes.length===0){

container.innerHTML="<h3>No Notes Found</h3>";

return;

}



notes.forEach(note=>{


container.innerHTML += `

<div class="note-card">


<img src="${note.thumbnail}" 
alt="Note Image">


<h2>${note.title}</h2>


<p>${note.description}</p>


<span>${note.category}</span>



<button onclick="openPDF('${note.pdf}')">

📖 Read PDF

</button>


</div>

`;

});


}



// Search Notes

document
.getElementById("searchBox")
.addEventListener("keyup",function(){


let value=this.value.toLowerCase();



let result = notesData.filter(note=>


note.title
.toLowerCase()
.includes(value)


);



displayNotes(result);



});





// Category Filter

function filterCategory(category){



if(category==="All"){

displayNotes(notesData);

return;

}



let result = notesData.filter(note=>

note.category===category

);



displayNotes(result);


}





// PDF Viewer

function openPDF(url){


window.open(url,"_blank");


}