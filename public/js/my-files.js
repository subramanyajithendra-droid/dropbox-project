let allFiles = [];

let selectedFileId = null;

window.onload = () => {

    loadMyFiles();


    const searchInput = document.getElementById("searchInput");

    if(searchInput){

        searchInput.addEventListener(
            "input",
            searchFiles
        );

    }


    const sortSelect = document.getElementById("sortSelect");

    if(sortSelect){

        sortSelect.addEventListener(
            "change",
            sortFiles
        );

    }


    const closeModal =
        document.getElementById("closeModal");

    if(closeModal){

        closeModal.onclick = closePreview;

    }


    const menuOverlay =
        document.getElementById("menuOverlay");

    if(menuOverlay){

        menuOverlay.onclick = closeAllMenus;

    }

};

window.onclick=function(e){

    const modal=document.getElementById("previewModal");

    if(e.target===modal){
        closePreview();
    }

}

async function loadMyFiles(){

    const res = await getFiles();

    allFiles = res.files || [];

    document.getElementById("totalFiles").innerText =
        allFiles.length;

    const totalBytes =
        allFiles.reduce((sum,file)=>sum+file.size,0);

    document.getElementById("totalStorage").innerText =
        formatSize(totalBytes);

    document.getElementById("todayUploads").innerText =
        allFiles.filter(file=>{

            return new Date(file.createdAt).toDateString() ===
                   new Date().toDateString();

        }).length;

    renderFiles(allFiles);

}

function renderFiles(files){

    const grid=document.getElementById("fileGrid");

    if(files.length===0){

        grid.innerHTML=`
            <div class="empty">
                <h2>No Files Found</h2>
            </div>
        `;

        return;

    }

    grid.innerHTML="";

    files.forEach(file=>{

        grid.innerHTML += `

        <div class="file-card">

            <!-- Favourite Badge -->

            ${file.isFavorite ? `
                <div class="favorite-badge">
                    ⭐
                </div>
            ` : ""}

            <div class="file-top">

                <div class="icon">

                    ${getIcon(file.mimeType)}

                </div>

                <div class="menu-container">


                    <button class="menu-btn" onclick="toggleMenu(event,'${file._id}')">

                    ⋮

                    </button>

                    <div class="dropdown-menu" id="menu-${file._id}">

                        <button onclick="renamePrompt('${file._id}')">

                            ✏ Rename

                        </button>

                        <button onclick="toggleFavorite('${file._id}')">

                            ${file.isFavorite ? 
                            "⭐ Remove Favorite"
                            :
                            "⭐ Add Favorite"}

                        </button>

                        <button class="danger" onclick="moveToTrash('${file._id}')">

                            🗑 Move to Trash

                        </button>

                    </div>


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

                <button
                    onclick="previewFile('${file._id}')">

                    👁 Open

                </button>

                <button
                    onclick="downloadFile('${file._id}')">

                    ⬇ Download

                </button>

            </div>

        </div>

        `;

    });

}

function searchFiles(){

    const keyword =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = allFiles.filter(file=>{

        return file.originalName
            .toLowerCase()
            .includes(keyword);

    });

    renderFiles(filtered);

}

function sortFiles(){

    const value =
        document.getElementById("sortSelect").value;

    let files = [...allFiles];

    switch(value){

        case "name":

            files.sort((a,b)=>
                a.originalName.localeCompare(b.originalName));

            break;

        case "size":

            files.sort((a,b)=>b.size-a.size);

            break;

        case "oldest":

            files.sort((a,b)=>
                new Date(a.createdAt)-new Date(b.createdAt));

            break;

        default:

            files.sort((a,b)=>
                new Date(b.createdAt)-new Date(a.createdAt));

    }

    renderFiles(files);

}

function closePreview(){

    const modal=document.getElementById("previewModal");

    const body=document.getElementById("previewBody");

    // stop video/audio before destroying element
    const video=body.querySelector("video");

    if(video){

        video.pause();
        video.currentTime=0;

    }

    // stop iframe videos also
    const iframe=body.querySelector("iframe");

    if(iframe){

        iframe.src="";

    }

    body.innerHTML="";

    modal.style.display="none";

}

async function previewFile(id) {


    const modal = document.getElementById("previewModal");

    const body = document.getElementById("previewBody");


    modal.style.display="flex";


    body.innerHTML=`

        <div class="preview-loader">

            Loading preview...

        </div>

    `;


    const res = await fetch(`/api/files/preview/${id}`);

    const data = await res.json();

    if(data.mimeType.startsWith("image")){

        body.innerHTML=`
            <img
                src="${data.url}"
                class="preview-image">
        `;

    }
    else if(data.mimeType.startsWith("video")){

        body.innerHTML=`

            <video

                id="previewVideo" class="preview-video" 
                
                controls autoplay playsinline preload="none">

                <source

                    src="${data.url}"

                    type="${data.mimeType}"
                >

            </video>

        `;

    }
    else if(data.mimeType==="application/pdf"){

        body.innerHTML=`
            <iframe
                class="preview-pdf"
                src="${data.url}">
            </iframe>
        `;

    }
    else{

        body.innerHTML=`
            <iframe
                class="preview-office"
                src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.url)}">
            </iframe>
        `;

    }

    document.getElementById("previewModal").style.display="flex";
}

async function downloadFile(id) {

    const res = await fetch(`/api/files/download/${id}`);

    const data = await res.json();

    if(!data.success){
        alert(data.message);
        return;
    }

    const a=document.createElement("a");

    a.href=data.url;

    a.download=data.fileName || "download";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
}

function toggleMenu(event,id){

    event.stopPropagation();

    closeAllMenus();

    const menu=document.getElementById(
        `menu-${id}`
    );

    menu.classList.add("show");

    document.getElementById("menuOverlay").classList.add("active");
}

function closeAllMenus(){

    document.querySelectorAll(".dropdown-menu").forEach(menu=>{

        menu.classList.remove("show");

    });

    const overlay=document.getElementById(
        "menuOverlay"
    );

    if(overlay){

        overlay.classList.remove("active");

    }
}


function renamePrompt(id){

    selectedFileId=id;

    const file=allFiles.find(
        f=>f._id===id
    );

    document.getElementById("renameInput").value=file.originalName;

    document.getElementById("renameModal").classList.add("active");

    closeAllMenus();

}

function closeRenameModal(){

    document.getElementById("renameModal").classList.remove("active");

    selectedFileId=null;

}

async function renameFile(){

    const name= document.getElementById("renameInput").value.trim();

    if(!name){
        alert("Enter file name");
        return;
    }

    const res=await fetch(`/api/files/${selectedFileId}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({fileName:name})
        }
    );

    const data = await res.json();

    if(data.success){

        closeRenameModal();
        loadMyFiles();

    }
    else{
        alert(data.message);
    }
}

async function toggleFavorite(id){

    const res= await fetch( `/api/files/favorite/${id}`,
        {
            method:"PUT"
        }
    );

    const data= await res.json();

    if(data.success){

        loadMyFiles();

    } else{

        alert(data.message);

    }
    closeAllMenus();

}

async function moveToTrash(id){

    const confirmDelete= confirm(
        "Move this file to trash?"
    );

    if(!confirmDelete) return;

    const res= await fetch( `/api/files/trash/${id}`,
        {
            method:"PUT"
        }
    );

    const data= await res.json();

    if(data.success){

        loadMyFiles();

    } else{

        alert(data.message);

    }
    closeAllMenus();
}

function getFileName(name){

    const i=name.lastIndexOf(".");

    if(i==-1) return name;

    return name.substring(0,i);

}

function getFileType(type){

    if(type.includes("image")) return "IMAGE";

    if(type.includes("pdf")) return "PDF";

    if(type.includes("video")) return "VIDEO";

    if(type.includes("word")) return "WORD";

    if(type.includes("excel")) return "EXCEL";

    if(type.includes("zip")) return "ZIP";

    if(type.includes("text")) return "TEXT";

    return "FILE";

}

function getIcon(type=""){

    type=type.toLowerCase();

    if(type.includes("image")) return "🖼";

    if(type.includes("pdf")) return "📄";

    if(type.includes("video")) return "🎥";

    if(type.includes("word")) return "📝";

    if(type.includes("excel")) return "📊";

    if(type.includes("powerpoint")) return "📽";

    if(type.includes("zip")) return "🗜";

    if(type.includes("text")) return "📃";

    if(type.includes("audio")) return "🎵";

    return "📦";

}

function formatSize(bytes){

    if(bytes<1024)
        return bytes+" B";

    if(bytes<1024*1024)
        return (bytes/1024).toFixed(2)+" KB";

    if(bytes<1024*1024*1024)
        return (bytes/1024/1024).toFixed(2)+" MB";

    return (bytes/1024/1024/1024).toFixed(2)+" GB";

}

function formatDate(date){

    return new Date(date).toLocaleString("en-IN",{

        day:"2-digit",

        month:"short",

        year:"numeric",

        hour:"2-digit",

        minute:"2-digit",

        hour12:true

    });

}

// Close all menus when clicking outside
document.addEventListener("click", ()=>{ 
    closeAllMenus(); 
});