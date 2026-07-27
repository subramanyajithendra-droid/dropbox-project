let trashFiles=[];



window.onload=()=>{

    loadTrash();

};





async function loadTrash(){

    const res = await fetch("/api/files/trash");

    const data = await res.json();

    trashFiles=data.files || [];

    renderTrash(trashFiles);

}

function renderTrash(files){


    const grid = document.getElementById("trashGrid");

    if(files.length===0){

        grid.innerHTML=`

        <div class="empty">

            <h2>Trash is Empty 🗑</h2>

            <p>Deleted files appear here</p>

        </div>

        `;

        return;

    }

    grid.innerHTML="";

    files.forEach(file=>{

        grid.innerHTML+=`

        <div class="file-card">

            <div class="file-top">

                <div class="icon">

                    ${getIcon(file.mimeType)}

                </div>

            </div>

            <h3>

                ${getFileName(file.originalName)}

            </h3>

            <div class="file-type">

                ${getFileType(file.mimeType)}

            </div>

            <p>

                ${formatSize(file.size)}

            </p>

            <span>

                ${formatDate(file.createdAt)}

            </span>

            <div class="actions">

                <button class="restore-btn" onclick="restoreFile('${file._id}')">

                    ♻ Restore

                </button>

                <button class="delete-btn" onclick="deleteForever('${file._id}')">

                    ❌ Delete

                </button>

            </div>

        </div>

        `;

    });

}

async function restoreFile(id){

    const res = await fetch(`/api/files/restore/${id}`,{

        method:"PUT"

    });

    const data = await res.json();

    if(data.success){

        loadTrash();

    } else{

        alert(data.message);

    }
}


async function deleteForever(id){


    const ok = confirm("Delete permanently?");

    if(!ok) return;

    await fetch(`/api/files/delete/${id}`,{

        method:"DELETE"

    });

    loadTrash();

}







function getFileName(name){

    const i=name.lastIndexOf(".");


    return i===-1
    ?name
    :name.substring(0,i);

}




function getIcon(type=""){


    type=type.toLowerCase();


    if(type.includes("image"))
        return "🖼";


    if(type.includes("pdf"))
        return "📄";


    if(type.includes("video"))
        return "🎥";


    return "📦";


}





function getFileType(type){


    if(type.includes("image"))
        return "IMAGE";


    if(type.includes("pdf"))
        return "PDF";


    if(type.includes("video"))
        return "VIDEO";


    return "FILE";


}




function formatSize(bytes){


    if(bytes<1024)
        return bytes+" B";


    if(bytes<1024*1024)
        return (bytes/1024).toFixed(2)+" KB";


    return (bytes/1024/1024).toFixed(2)+" MB";


}



function formatDate(date){

    return new Date(date).toLocaleString("en-IN");

}